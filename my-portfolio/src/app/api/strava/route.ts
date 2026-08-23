import { NextResponse } from "next/server";
import { getBikeStats } from "@/lib/strava";

// Serves the pre-aggregated cycling stats consumed by the "On the Bike"
// graph. Same-origin only (the site's CSP connect-src is 'self'); the actual
// Strava API calls happen here on the server where the secrets live.
//
// getBikeStats() already caches its upstream Strava fetches (revalidate 15m),
// so this handler stays cheap even under the client's periodic polling.
export const revalidate = 900; // 15 minutes

export async function GET() {
    try {
        const stats = await getBikeStats();
        return NextResponse.json(stats, {
            headers: {
                "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
            },
        });
    } catch (err) {
        console.error("Failed to load Strava stats:", err);
        return NextResponse.json({ error: "Unable to load cycling stats right now." }, { status: 502 });
    }
}
