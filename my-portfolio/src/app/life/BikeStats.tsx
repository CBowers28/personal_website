"use client";

import { useCallback, useEffect, useState } from "react";
import type { BikeStats } from "@/lib/strava";

// Live cycling panel for the /life page. Pulls pre-aggregated ride data from
// the same-origin /api/strava route, redraws a hand-rolled SVG bar chart of
// weekly mileage, and re-polls so the numbers stay fresh without a reload.

const ACCENT = "#E5442E"; // matches the "On the Bike" facet + Strava's orange
const POLL_MS = 5 * 60_000; // re-fetch every 5 minutes for a "live" feel

// SVG chart geometry (viewBox units; the element scales to its container).
const CHART_W = 720;
const CHART_H = 240;
const PAD_L = 34;
const PAD_R = 8;
const PAD_T = 18;
const PAD_B = 34;

function timeAgo(iso: string): string {
    const then = new Date(iso).getTime();
    const secs = Math.max(0, Math.round((Date.now() - then) / 1000));
    if (secs < 60) return "just now";
    const mins = Math.round(secs / 60);
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
    const days = Math.round(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
}

function fmt(n: number): string {
    return n.toLocaleString("en-US");
}

function WeeklyChart({ data }: { data: BikeStats["weekly"] }) {
    const [hover, setHover] = useState<number | null>(null);

    const max = Math.max(10, ...data.map((w) => w.miles));
    const plotW = CHART_W - PAD_L - PAD_R;
    const plotH = CHART_H - PAD_T - PAD_B;
    const slot = plotW / data.length;
    const barW = Math.min(38, slot * 0.62);

    // Three evenly-spaced y gridlines (0, mid, max), rounded to something tidy.
    const ticks = [0, 0.5, 1].map((t) => Math.round(max * t));

    return (
        <div className="bike-chart-wrap">
            <svg
                className="bike-chart"
                viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                role="img"
                aria-label="Weekly cycling mileage over the last 12 weeks"
                onMouseLeave={() => setHover(null)}
            >
                {ticks.map((t) => {
                    const y = PAD_T + plotH - (t / max) * plotH;
                    return (
                        <g key={t}>
                            <line
                                x1={PAD_L}
                                x2={CHART_W - PAD_R}
                                y1={y}
                                y2={y}
                                stroke="rgba(26,26,24,0.08)"
                                strokeWidth={1}
                            />
                            <text x={PAD_L - 8} y={y + 4} className="bike-axis" textAnchor="end">
                                {t}
                            </text>
                        </g>
                    );
                })}

                {data.map((w, i) => {
                    const h = (w.miles / max) * plotH;
                    const x = PAD_L + i * slot + (slot - barW) / 2;
                    const y = PAD_T + plotH - h;
                    const active = hover === i;
                    return (
                        <g
                            key={w.weekStart}
                            onMouseEnter={() => setHover(i)}
                            style={{ cursor: "default" }}
                        >
                            {/* invisible full-height hit area for easier hover */}
                            <rect
                                x={PAD_L + i * slot}
                                y={PAD_T}
                                width={slot}
                                height={plotH}
                                fill="transparent"
                            />
                            <rect
                                className="bike-bar"
                                x={x}
                                y={y}
                                width={barW}
                                height={Math.max(0, h)}
                                rx={3}
                                fill={ACCENT}
                                opacity={active ? 1 : 0.82}
                                style={{ transformOrigin: `${x + barW / 2}px ${PAD_T + plotH}px` }}
                            />
                            {active && w.miles > 0 && (
                                <text
                                    x={x + barW / 2}
                                    y={y - 6}
                                    className="bike-barlabel"
                                    textAnchor="middle"
                                >
                                    {w.miles} mi
                                </text>
                            )}
                            {i % 2 === 0 && (
                                <text
                                    x={x + barW / 2}
                                    y={CHART_H - 12}
                                    className="bike-axis"
                                    textAnchor="middle"
                                >
                                    {w.label}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default function BikeStats() {
    const [data, setData] = useState<BikeStats | null>(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            const res = await fetch("/api/strava", { cache: "no-store" });
            if (!res.ok) throw new Error(String(res.status));
            const json = (await res.json()) as BikeStats;
            setData(json);
            setError(false);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
        const id = setInterval(load, POLL_MS);
        const onVisible = () => {
            if (document.visibilityState === "visible") load();
        };
        document.addEventListener("visibilitychange", onVisible);
        return () => {
            clearInterval(id);
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, [load]);

    return (
        <section className="bike" aria-labelledby="bike-heading">
            <style>{`
        .bike { margin-top: 4.5rem; }
        .bike-head {
          display: flex; align-items: baseline; justify-content: space-between;
          flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;
        }
        .bike-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 5vw, 2.8rem);
          letter-spacing: 0.03em; line-height: 1;
        }
        .bike-live {
          display: inline-flex; align-items: center; gap: 0.45rem;
          font-family: 'Space Mono', monospace; font-size: 0.62rem;
          letter-spacing: 0.14em; text-transform: uppercase; color: var(--subtle);
        }
        .bike-dot {
          width: 7px; height: 7px; border-radius: 50%; background: ${ACCENT};
          box-shadow: 0 0 0 0 rgba(229,68,46,0.55);
          animation: bikePulse 2s infinite;
        }
        @keyframes bikePulse {
          0%   { box-shadow: 0 0 0 0 rgba(229,68,46,0.5); }
          70%  { box-shadow: 0 0 0 7px rgba(229,68,46,0); }
          100% { box-shadow: 0 0 0 0 rgba(229,68,46,0); }
        }

        .bike-tiles {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;
          margin-bottom: 1.75rem;
        }
        .bike-tile {
          background: #fff; border: 1.5px solid rgba(26,26,24,0.08);
          padding: 1.15rem 1.25rem;
        }
        .bike-tile-num {
          font-family: 'Bebas Neue', sans-serif; font-size: 2.1rem;
          line-height: 1; color: var(--ink);
        }
        .bike-tile-unit { font-size: 0.9rem; color: ${ACCENT}; margin-left: 0.15rem; }
        .bike-tile-label {
          font-family: 'Space Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--subtle); margin-top: 0.45rem;
        }

        .bike-panel {
          background: #fff; border: 1.5px solid rgba(26,26,24,0.08);
          padding: 1.5rem 1.5rem 1rem;
        }
        .bike-panel-label {
          font-family: 'Space Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--subtle); margin-bottom: 0.75rem;
        }
        .bike-chart-wrap { width: 100%; overflow-x: auto; }
        .bike-chart { width: 100%; height: auto; display: block; }
        .bike-bar { transition: opacity 0.2s; animation: bikeGrow 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes bikeGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .bike-axis {
          font-family: 'Space Mono', monospace; font-size: 11px; fill: var(--subtle);
        }
        .bike-barlabel {
          font-family: 'Space Mono', monospace; font-size: 12px; font-weight: 700;
          fill: var(--ink);
        }

        .bike-recent { margin-top: 1.75rem; }
        .bike-ride {
          display: flex; align-items: baseline; justify-content: space-between;
          gap: 1rem; padding: 0.85rem 0; border-top: 1px solid rgba(26,26,24,0.07);
        }
        .bike-ride:first-of-type { border-top: none; }
        .bike-ride-name {
          font-size: 1.05rem; color: var(--ink); font-style: italic;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .bike-ride-date {
          font-family: 'Space Mono', monospace; font-size: 0.58rem;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--subtle);
        }
        .bike-ride-stats {
          font-family: 'Space Mono', monospace; font-size: 0.72rem;
          color: #666; white-space: nowrap; flex-shrink: 0;
        }
        .bike-ride-stats b { color: ${ACCENT}; font-weight: 700; }

        .bike-foot {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 0.5rem; margin-top: 1.25rem;
          font-family: 'Space Mono', monospace; font-size: 0.58rem;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--subtle);
        }
        .bike-sample {
          color: ${ACCENT}; border: 1px solid rgba(229,68,46,0.35);
          padding: 0.2rem 0.5rem;
        }
        .bike-skeleton {
          background: #fff; border: 1.5px solid rgba(26,26,24,0.08);
          height: 300px; display: flex; align-items: center; justify-content: center;
          font-family: 'Space Mono', monospace; font-size: 0.7rem;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--subtle);
        }

        @media (max-width: 640px) {
          .bike-tiles { grid-template-columns: repeat(2, 1fr); }
          .bike-ride-name { max-width: 48vw; }
        }
      `}</style>

            <div className="bike-head">
                <h2 id="bike-heading" className="bike-title">On the Bike</h2>
                <span className="bike-live">
                    <span className="bike-dot" aria-hidden="true" />
                    {data ? `Updated ${timeAgo(data.updatedAt)}` : "Live from Strava"}
                </span>
            </div>

            {loading && !data && <div className="bike-skeleton">Loading rides…</div>}

            {error && !data && (
                <div className="bike-skeleton">Couldn&apos;t reach Strava right now — check back soon.</div>
            )}

            {data && (
                <>
                    <div className="bike-tiles">
                        <div className="bike-tile">
                            <div className="bike-tile-num">{fmt(data.totals.miles)}<span className="bike-tile-unit">mi</span></div>
                            <div className="bike-tile-label">Total Distance</div>
                        </div>
                        <div className="bike-tile">
                            <div className="bike-tile-num">{fmt(data.totals.elevationFt)}<span className="bike-tile-unit">ft</span></div>
                            <div className="bike-tile-label">Elevation Climbed</div>
                        </div>
                        <div className="bike-tile">
                            <div className="bike-tile-num">{fmt(data.totals.rides)}</div>
                            <div className="bike-tile-label">Rides Logged</div>
                        </div>
                        <div className="bike-tile">
                            <div className="bike-tile-num">{fmt(data.longestRideMiles)}<span className="bike-tile-unit">mi</span></div>
                            <div className="bike-tile-label">Longest Ride</div>
                        </div>
                    </div>

                    <div className="bike-panel">
                        <div className="bike-panel-label">Weekly Mileage · Last 12 Weeks</div>
                        <WeeklyChart data={data.weekly} />
                    </div>

                    {data.recent.length > 0 && (
                        <div className="bike-recent">
                            <div className="bike-panel-label">Recent Rides</div>
                            {data.recent.map((r) => (
                                <div key={r.id} className="bike-ride">
                                    <div style={{ minWidth: 0 }}>
                                        <div className="bike-ride-name">{r.name}</div>
                                        <div className="bike-ride-date">{r.date}</div>
                                    </div>
                                    <div className="bike-ride-stats">
                                        <b>{r.miles}</b> mi · {r.elevationFt} ft · {r.avgMph} mph
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="bike-foot">
                        <span>Powered by Strava</span>
                        {!data.configured && <span className="bike-sample">Sample data — Strava not connected</span>}
                    </div>
                </>
            )}
        </section>
    );
}
