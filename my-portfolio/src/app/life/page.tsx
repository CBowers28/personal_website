import Link from "next/link";
import BikeStats from "./BikeStats";

// "Full Spectrum", the personal / off-the-clock page. Cycling is live from
// Strava (see <BikeStats />); the remaining facets are placeholder copy for now.
const FACETS = [
    {
        label: "Giving Back",
        color: "#2A6E3F",
        body: "Placeholder: the charities and volunteering you're part of, and what draws you to them.",
    },
    {
        label: "Otherwise",
        color: "#1E63C4",
        body: "Placeholder: anything else that's you outside of work. Interests, hobbies, the things you'd bring up over coffee.",
    },
];

export default function LifePage() {
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');

        :root { --bg: #F8F6F0; --ink: #1A1A18; --subtle: #9A9088; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: var(--bg);
          color: var(--ink);
          font-family: var(--font-advercase), 'Cormorant Garamond', Georgia, serif;
          min-height: 100vh;
        }

        .back-bar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 1.25rem 3rem;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(248,246,240,0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(26,26,24,0.08);
        }
        .back-link {
          display: flex; align-items: center; gap: 0.6rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--subtle); text-decoration: none; transition: color 0.2s;
        }
        .back-link:hover { color: var(--ink); }
        .back-arrow { font-size: 1rem; transition: transform 0.2s; }
        .back-link:hover .back-arrow { transform: translateX(-3px); }
        .back-kicker {
          font-family: 'Space Mono', monospace; font-size: 0.65rem;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--subtle);
        }

        .life-wrap {
          max-width: 1000px;
          margin: 0 auto;
          padding: 140px 1.5rem 6rem;
          animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .life-label {
          font-family: 'Space Mono', monospace; font-size: 0.65rem;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--subtle); margin-bottom: 0.5rem;
        }
        .life-title {
          font-family: var(--font-advercase), 'Bebas Neue', sans-serif;
          font-size: clamp(2.8rem, 7vw, 4.5rem);
          letter-spacing: 0.03em; line-height: 1; margin-bottom: 1.25rem;
        }
        .life-lede {
          font-size: 1.2rem; line-height: 1.6; color: #666;
          font-style: italic; max-width: 620px; margin-bottom: 3rem;
        }

        .facets-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        .facet-card {
          display: flex; flex-direction: column;
          background: #fff; border: 1.5px solid rgba(26,26,24,0.08);
          overflow: hidden;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s;
        }
        .facet-card:hover { transform: translateY(-4px); box-shadow: 0 14px 34px rgba(0,0,0,0.08); }
        .facet-stripe { height: 8px; width: 100%; }
        .facet-body { padding: 1.6rem 1.7rem 1.7rem; }
        .facet-label {
          font-family: var(--font-advercase), 'Bebas Neue', sans-serif; font-size: 1.5rem;
          letter-spacing: 0.03em; color: var(--ink); margin-bottom: 0.55rem;
        }
        .facet-text { font-size: 1.02rem; line-height: 1.55; color: #999; font-style: italic; }

        @media (max-width: 768px) {
          .back-bar { padding: 1rem 1.25rem; }
          .life-wrap { padding: 120px 1.25rem 4rem; }
          .facets-grid { grid-template-columns: 1fr; gap: 1rem; }
        }
      `}</style>

            <nav className="back-bar">
                <Link href="/" className="back-link">
                    <span className="back-arrow">←</span>
                    Back to Portfolio
                </Link>
                <span className="back-kicker">Off the Clock</span>
            </nav>

            <main className="life-wrap">
                <div className="life-label">Off the Clock</div>
                <h1 className="life-title">FULL SPECTRUM</h1>
                <p className="life-lede">
                    The parts of me that don&apos;t fit on a résumé. (Placeholder for now,
                    we&apos;ll fill this in.)
                </p>

                <BikeStats />

                <div className="facets-grid" style={{ marginTop: "4.5rem" }}>
                    {FACETS.map((f) => (
                        <div key={f.label} className="facet-card">
                            <div className="facet-stripe" style={{ background: f.color }} />
                            <div className="facet-body">
                                <div className="facet-label">{f.label}</div>
                                <p className="facet-text">{f.body}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
}
