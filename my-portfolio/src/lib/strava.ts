// ─── Strava integration ─────────────────────────────────────────────
// Pulls Christopher's cycling activity from the Strava API and shapes it
// into the small, pre-aggregated payload the "On the Bike" graph needs.
//
// SETUP (all server-side secrets — never exposed to the browser):
//   STRAVA_CLIENT_ID      – from https://www.strava.com/settings/api
//   STRAVA_CLIENT_SECRET  – same page
//   STRAVA_REFRESH_TOKEN  – a refresh token with `activity:read` scope
//
// How to get the refresh token once:
//   1. Create an API application at https://www.strava.com/settings/api
//   2. Authorize with the required scope by visiting (in a browser):
//        https://www.strava.com/oauth/authorize?client_id=CLIENT_ID
//          &redirect_uri=http://localhost&response_type=code
//          &scope=activity:read_all&approval_prompt=force
//      Grab the `code` query param off the redirect URL.
//   3. Exchange it once:
//        curl -X POST https://www.strava.com/oauth/token \
//          -d client_id=... -d client_secret=... \
//          -d code=CODE -d grant_type=authorization_code
//      Store the returned `refresh_token` as STRAVA_REFRESH_TOKEN.
//
// Strava refresh tokens are long-lived; the short-lived access token is
// re-minted on each server fetch. If the env vars are absent (e.g. a fresh
// clone or a preview deploy without secrets) we fall back to representative
// sample data so the page still renders — flagged via `configured: false`.

const TOKEN_URL = "https://www.strava.com/oauth/token";
const ACTIVITIES_URL = "https://www.strava.com/api/v3/athlete/activities";

const METERS_PER_MILE = 1609.344;
const METERS_PER_FOOT = 0.3048;
const WEEKS_SHOWN = 12;

// Ride-like activity types we count toward "biking".
const RIDE_TYPES = new Set(["Ride", "VirtualRide", "GravelRide", "MountainBikeRide", "EBikeRide"]);

export type WeekBucket = {
    /** ISO date (yyyy-mm-dd) of the Monday that starts this week. */
    weekStart: string;
    /** Short label, e.g. "Aug 4". */
    label: string;
    miles: number;
    rides: number;
};

export type RecentRide = {
    id: number;
    name: string;
    date: string; // ISO date of the ride
    miles: number;
    elevationFt: number;
    movingMinutes: number;
    avgMph: number;
};

export type BikeStats = {
    /** false ⇒ these are sample numbers because Strava env vars aren't set. */
    configured: boolean;
    /** ISO timestamp the data was assembled server-side. */
    updatedAt: string;
    totals: {
        rides: number;
        miles: number;
        elevationFt: number;
        hours: number;
    };
    /** Longest single ride in the window, in miles. */
    longestRideMiles: number;
    /** Best single-week mileage in the window. */
    biggestWeekMiles: number;
    weekly: WeekBucket[];
    recent: RecentRide[];
};

type StravaActivity = {
    id: number;
    name: string;
    type: string;
    sport_type?: string;
    distance: number; // meters
    total_elevation_gain: number; // meters
    moving_time: number; // seconds
    start_date_local: string; // ISO
};

const round = (n: number, dp = 1) => {
    const f = 10 ** dp;
    return Math.round(n * f) / f;
};

/** Monday 00:00 (local, date-only) for a given date, as yyyy-mm-dd. */
function mondayOf(d: Date): string {
    const copy = new Date(d);
    const day = (copy.getDay() + 6) % 7; // 0 = Monday
    copy.setDate(copy.getDate() - day);
    return copy.toISOString().slice(0, 10);
}

function shortLabel(isoDate: string): string {
    const d = new Date(isoDate + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Exchange the long-lived refresh token for a short-lived access token. */
async function getAccessToken(): Promise<string> {
    const res = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            refresh_token: process.env.STRAVA_REFRESH_TOKEN,
            grant_type: "refresh_token",
        }),
        // Access tokens live ~6h; let Next cache the token exchange briefly.
        next: { revalidate: 60 * 30 },
    });
    if (!res.ok) {
        throw new Error(`Strava token exchange failed: ${res.status}`);
    }
    const json = (await res.json()) as { access_token?: string };
    if (!json.access_token) throw new Error("Strava token exchange returned no access_token");
    return json.access_token;
}

/** Build the empty week scaffold (oldest → newest) so gaps render as zero. */
function emptyWeeks(now: Date): WeekBucket[] {
    const weeks: WeekBucket[] = [];
    const thisMonday = new Date(mondayOf(now) + "T00:00:00");
    for (let i = WEEKS_SHOWN - 1; i >= 0; i--) {
        const wd = new Date(thisMonday);
        wd.setDate(wd.getDate() - i * 7);
        const weekStart = wd.toISOString().slice(0, 10);
        weeks.push({ weekStart, label: shortLabel(weekStart), miles: 0, rides: 0 });
    }
    return weeks;
}

function aggregate(activities: StravaActivity[], now: Date, configured: boolean): BikeStats {
    const rides = activities.filter(
        (a) => RIDE_TYPES.has(a.sport_type ?? a.type) || RIDE_TYPES.has(a.type),
    );

    const weeks = emptyWeeks(now);
    const weekIndex = new Map(weeks.map((w, i) => [w.weekStart, i]));
    const cutoff = weeks[0]?.weekStart ?? mondayOf(now);

    let totalMeters = 0;
    let totalElevM = 0;
    let totalSeconds = 0;
    let longestMeters = 0;

    for (const a of rides) {
        totalMeters += a.distance;
        totalElevM += a.total_elevation_gain;
        totalSeconds += a.moving_time;
        if (a.distance > longestMeters) longestMeters = a.distance;

        const wk = mondayOf(new Date(a.start_date_local));
        if (wk >= cutoff) {
            const idx = weekIndex.get(wk);
            if (idx !== undefined) {
                weeks[idx].miles += a.distance / METERS_PER_MILE;
                weeks[idx].rides += 1;
            }
        }
    }

    for (const w of weeks) w.miles = round(w.miles);

    const recent: RecentRide[] = rides
        .slice()
        .sort((a, b) => (a.start_date_local < b.start_date_local ? 1 : -1))
        .slice(0, 5)
        .map((a) => {
            const miles = a.distance / METERS_PER_MILE;
            const movingMinutes = a.moving_time / 60;
            return {
                id: a.id,
                name: a.name,
                date: a.start_date_local.slice(0, 10),
                miles: round(miles),
                elevationFt: Math.round(a.total_elevation_gain / METERS_PER_FOOT),
                movingMinutes: Math.round(movingMinutes),
                avgMph: a.moving_time > 0 ? round(miles / (a.moving_time / 3600)) : 0,
            };
        });

    return {
        configured,
        updatedAt: now.toISOString(),
        totals: {
            rides: rides.length,
            miles: Math.round(totalMeters / METERS_PER_MILE),
            elevationFt: Math.round(totalElevM / METERS_PER_FOOT),
            hours: round(totalSeconds / 3600, 0),
        },
        longestRideMiles: round(longestMeters / METERS_PER_MILE),
        biggestWeekMiles: weeks.reduce((m, w) => Math.max(m, w.miles), 0),
        weekly: weeks,
        recent,
    };
}

/**
 * Fetch and aggregate ride activity. Returns sample data (configured:false)
 * when the Strava env vars are missing so the page always renders.
 */
export async function getBikeStats(now: Date = new Date()): Promise<BikeStats> {
    const hasEnv =
        !!process.env.STRAVA_CLIENT_ID &&
        !!process.env.STRAVA_CLIENT_SECRET &&
        !!process.env.STRAVA_REFRESH_TOKEN;

    if (!hasEnv) return sampleStats(now);

    const token = await getAccessToken();
    // 200 activities comfortably covers the trailing 12-week window for a
    // regular rider; add pagination later if the window ever grows.
    const url = `${ACTIVITIES_URL}?per_page=200&page=1`;
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        // Refresh at most every 15 min — well inside Strava's rate limits and
        // plenty "live" for a personal site.
        next: { revalidate: 60 * 15 },
    });
    if (!res.ok) throw new Error(`Strava activities fetch failed: ${res.status}`);
    const activities = (await res.json()) as StravaActivity[];
    return aggregate(activities, now, true);
}

// ─── Sample fallback ────────────────────────────────────────────────
// Deterministic, believable numbers for local dev / preview deploys with no
// secrets. Clearly flagged (configured:false) so the UI can say so.
function sampleStats(now: Date): BikeStats {
    const weeklyMiles = [58, 72, 41, 84, 66, 90, 47, 78, 95, 61, 88, 73];
    const weeks = emptyWeeks(now).map((w, i) => ({
        ...w,
        miles: weeklyMiles[i] ?? 0,
        rides: Math.max(2, Math.round((weeklyMiles[i] ?? 0) / 22)),
    }));

    const recent: RecentRide[] = [
        { name: "Sunrise loop through the hills", miles: 34.2, elevationFt: 2140, movingMinutes: 128, avgMph: 16.0 },
        { name: "Recovery spin", miles: 14.7, elevationFt: 420, movingMinutes: 58, avgMph: 15.2 },
        { name: "Long Saturday — county line and back", miles: 62.5, elevationFt: 3980, movingMinutes: 231, avgMph: 16.2 },
        { name: "Lunch intervals", miles: 18.3, elevationFt: 610, movingMinutes: 61, avgMph: 18.0 },
        { name: "Gravel out to the reservoir", miles: 41.1, elevationFt: 2760, movingMinutes: 168, avgMph: 14.7 },
    ].map((r, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - i * 2);
        return { id: 1000 + i, date: d.toISOString().slice(0, 10), ...r };
    });

    const totalMiles = weeklyMiles.reduce((a, b) => a + b, 0);
    return {
        configured: false,
        updatedAt: now.toISOString(),
        totals: {
            rides: weeks.reduce((a, w) => a + w.rides, 0),
            miles: totalMiles,
            elevationFt: 41800,
            hours: Math.round(totalMiles / 15.5),
        },
        longestRideMiles: 62.5,
        biggestWeekMiles: Math.max(...weeklyMiles),
        weekly: weeks,
        recent,
    };
}
