"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EXPERIENCE, PROJECTS } from "@/lib/projects";

export default function ExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const exp = EXPERIENCE.find((e) => e.slug === slug);
    if (!exp) notFound();

    const related = PROJECTS.filter((p) => exp.relatedProjects.includes(p.slug));

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');

        :root { --bg: #F2EFE4; --ink: #1A1A18; --subtle: #9A9088; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); color: var(--ink); font-family: 'Cormorant Garamond', Georgia, serif; min-height: 100vh; }

        .back-bar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 1.25rem 3rem;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(242,239,228,0.9); backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(26,26,24,0.08);
        }
        .back-link {
          display: flex; align-items: center; gap: 0.6rem;
          font-family: 'Space Mono', monospace; font-size: 0.7rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--subtle); text-decoration: none; transition: color 0.2s;
        }
        .back-link:hover { color: var(--ink); }
        .back-arrow { transition: transform 0.2s; }
        .back-link:hover .back-arrow { transform: translateX(-3px); }

        .detail-hero {
          padding-top: 80px; display: flex; min-height: 100vh; align-items: stretch;
        }

        /* Left panel */
        .chip-panel {
          width: min(400px, 42vw); flex-shrink: 0;
          display: flex; flex-direction: column;
          position: sticky; top: 80px; height: calc(100vh - 80px);
        }
        .chip-color-fill {
          flex: 1; position: relative; overflow: hidden;
        }
        .chip-color-fill::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%);
        }
        .chip-label-panel {
          background: #fff; padding: 2rem 2.5rem 2.5rem;
        }
        .chip-company {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          letter-spacing: 0.03em; line-height: 1; color: var(--ink);
          margin-bottom: 0.4rem;
        }
        .chip-role {
          font-family: 'Space Mono', monospace; font-size: 0.68rem;
          color: #aaa; letter-spacing: 0.08em; margin-bottom: 0.6rem;
        }
        .chip-period-loc {
          font-size: 0.95rem; color: #777; font-style: italic;
        }

        /* Right content */
        .detail-content {
          flex: 1; padding: 5rem 5rem 5rem 4rem; max-width: 700px;
          animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .section-label {
          font-family: 'Space Mono', monospace; font-size: 0.62rem;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--subtle); margin-bottom: 0.5rem;
        }

        .summary-text {
          font-size: 1.2rem; line-height: 1.75; color: #444; margin-bottom: 3.5rem;
        }

        .bullets-list { list-style: none; margin-bottom: 3.5rem; }
        .bullets-list li {
          display: flex; gap: 1rem; font-size: 1rem; line-height: 1.65; color: #444;
          padding: 1rem 0; border-bottom: 1px solid rgba(26,26,24,0.07);
        }
        .bullets-list li:first-child { border-top: 1px solid rgba(26,26,24,0.07); }
        .bullet-dot {
          width: 8px; height: 8px; border-radius: 50%;
          margin-top: 0.45rem; flex-shrink: 0;
        }

        .tech-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 3.5rem; }
        .tech-pill {
          font-family: 'Space Mono', monospace; font-size: 0.65rem;
          letter-spacing: 0.08em; padding: 0.35rem 0.8rem;
          border: 1.5px solid rgba(26,26,24,0.15); color: var(--subtle);
          border-radius: 2px; transition: all 0.15s;
        }
        .tech-pill:hover { border-color: var(--ink); color: var(--ink); }

        /* Related project mini-swatches */
        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .related-card {
          display: flex; flex-direction: column;
          text-decoration: none; color: inherit;
          box-shadow: 2px 2px 0 rgba(0,0,0,0.06), 4px 4px 16px rgba(0,0,0,0.05);
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
        }
        .related-card:hover {
          transform: translateY(-4px);
          box-shadow: 2px 2px 0 rgba(0,0,0,0.08), 8px 12px 28px rgba(0,0,0,0.1);
        }
        .related-color { height: 80px; position: relative; overflow: hidden; }
        .related-color::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%);
        }
        .related-label { background: #fff; padding: 0.6rem 0.75rem 0.75rem; }
        .related-tag {
          font-family: 'Space Mono', monospace; font-size: 0.55rem;
          letter-spacing: 0.1em; text-transform: uppercase; color: #aaa;
        }
        .related-name {
          font-family: 'Bebas Neue', sans-serif; font-size: 0.95rem;
          letter-spacing: 0.04em; line-height: 1.15; color: var(--ink);
          margin-top: 1px;
        }

        @media (max-width: 768px) {
          .detail-hero { flex-direction: column; }
          .chip-panel { width: 100%; height: auto; position: static; }
          .chip-color-fill { height: 200px; }
          .detail-content { padding: 2.5rem 1.5rem; }
          .back-bar { padding: 1rem 1.5rem; }
        }
      `}</style>

            <nav className="back-bar">
                <Link href="/#process" className="back-link">
                    <span className="back-arrow">←</span>
                    Back to Portfolio
                </Link>
                <span style={{
                    fontFamily: "'Space Mono', monospace", fontSize: "0.65rem",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    padding: "0.3rem 0.8rem", background: exp.color.hex, color: "#fff", borderRadius: 2,
                }}>
          Experience
        </span>
            </nav>

            <div className="detail-hero">
                {/* LEFT — Company chip */}
                <div className="chip-panel">
                    <div className="chip-color-fill" style={{ background: exp.color.hex }} />
                    <div className="chip-label-panel">
                        <div className="chip-company">{exp.company}</div>
                        <div className="chip-role">{exp.role}</div>
                        <div className="chip-period-loc">{exp.period} · {exp.location}</div>
                    </div>
                </div>

                {/* RIGHT — Content */}
                <div className="detail-content">
                    <div className="section-label">Overview</div>
                    <p className="summary-text">{exp.summary}</p>

                    <div className="section-label">What I Did</div>
                    <ul className="bullets-list">
                        {exp.bullets.map((b, i) => (
                            <li key={i}>
                                <div className="bullet-dot" style={{ background: exp.color.hex }} />
                                <span>{b}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="section-label" style={{ marginBottom: "1rem" }}>Tech Stack</div>
                    <div className="tech-grid">
                        {exp.tech.map((t) => (
                            <span key={t} className="tech-pill">{t}</span>
                        ))}
                    </div>

                    {related.length > 0 && (
                        <>
                            <div className="section-label" style={{ marginBottom: "1rem" }}>Related Projects</div>
                            <div className="related-grid">
                                {related.map((p) => (
                                    <Link key={p.slug} href={`/projects/${p.slug}`} className="related-card">
                                        <div className="related-color" style={{ background: p.color.hex }} />
                                        <div className="related-label">
                                            <div className="related-tag">{p.tag}</div>
                                            <div className="related-name">{p.name}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}