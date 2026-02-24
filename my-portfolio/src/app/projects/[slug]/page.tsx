"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PROJECTS } from "@/lib/projects";

export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const project = PROJECTS.find((p) => p.slug === slug);
    if (!project) notFound();

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');

        :root {
          --bg: #F2EFE4;
          --ink: #1A1A18;
          --subtle: #9A9088;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--bg);
          color: var(--ink);
          font-family: 'Cormorant Garamond', Georgia, serif;
          min-height: 100vh;
        }

        .back-bar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 1.25rem 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(242,239,228,0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(26,26,24,0.08);
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--subtle);
          text-decoration: none;
          transition: color 0.2s;
        }

        .back-link:hover { color: var(--ink); }

        .back-arrow {
          font-size: 1rem;
          transition: transform 0.2s;
        }

        .back-link:hover .back-arrow { transform: translateX(-3px); }

        .back-tag {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.3rem 0.8rem;
          color: var(--bg);
          border-radius: 2px;
        }

        /* ── HERO CHIP ── */
        .detail-hero {
          padding-top: 80px;
          display: flex;
          min-height: 100vh;
          align-items: stretch;
        }

        .chip-panel {
          width: min(420px, 45vw);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 80px;
          height: calc(100vh - 80px);
        }

        .chip-color-fill {
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .chip-color-fill::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%);
        }

        .chip-label-panel {
          background: #fff;
          padding: 2rem 2.5rem 2.5rem;
          border-top: none;
        }

        .chip-name-large {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          letter-spacing: 0.03em;
          line-height: 1;
          color: var(--ink);
          margin-bottom: 0.5rem;
        }

        .chip-code-small {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          color: #aaa;
          letter-spacing: 0.08em;
          margin-bottom: 0.75rem;
        }

        .chip-org {
          font-size: 0.95rem;
          color: #777;
          font-style: italic;
          margin-bottom: 0.3rem;
        }

        .chip-period {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          color: #aaa;
          letter-spacing: 0.1em;
        }

        /* ── CONTENT ── */
        .detail-content {
          flex: 1;
          padding: 5rem 5rem 5rem 4rem;
          max-width: 700px;
          animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .detail-section-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--subtle);
          margin-bottom: 0.5rem;
        }

        .detail-full-desc {
          font-size: 1.2rem;
          line-height: 1.75;
          color: #444;
          margin-bottom: 3.5rem;
        }

        .highlights-list {
          list-style: none;
          margin-bottom: 3.5rem;
        }

        .highlights-list li {
          display: flex;
          gap: 1rem;
          font-size: 1rem;
          line-height: 1.65;
          color: #444;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(26,26,24,0.07);
        }

        .highlights-list li:first-child { border-top: 1px solid rgba(26,26,24,0.07); }

        .bullet-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 0.45rem;
          flex-shrink: 0;
        }

        .tech-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 3rem;
        }

        .tech-pill {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          padding: 0.35rem 0.8rem;
          border: 1.5px solid rgba(26,26,24,0.15);
          color: var(--subtle);
          border-radius: 2px;
          transition: all 0.15s;
        }

        .tech-pill:hover {
          border-color: var(--ink);
          color: var(--ink);
        }

        .action-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.75rem 1.5rem;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
          display: inline-block;
        }

        .btn-primary {
          background: var(--ink);
          color: var(--bg);
        }

        .btn-primary:hover { opacity: 0.8; }

        .btn-outline {
          background: transparent;
          color: var(--ink);
          border: 1.5px solid var(--ink);
        }

        .btn-outline:hover {
          background: var(--ink);
          color: var(--bg);
        }

        @media (max-width: 768px) {
          .detail-hero { flex-direction: column; }
          .chip-panel { width: 100%; height: auto; position: static; }
          .chip-color-fill { height: 220px; }
          .detail-content { padding: 2.5rem 1.5rem; }
          .back-bar { padding: 1rem 1.5rem; }
        }
      `}</style>

            {/* BACK BAR */}
            <nav className="back-bar">
                <Link href="/" className="back-link">
                    <span className="back-arrow">←</span>
                    Back to Portfolio
                </Link>
                <span
                    className="back-tag"
                    style={{ background: project.color.hex }}
                >
          {project.tag}
        </span>
            </nav>

            <div className="detail-hero">
                {/* LEFT — Pantone chip */}
                <div className="chip-panel">
                    <div className="chip-color-fill" style={{ background: project.color.hex }} />
                    <div className="chip-label-panel">
                        <div className="chip-name-large">{project.name}</div>
                        <div className="chip-code-small">{project.color.code} · {project.color.name}</div>
                        <div className="chip-org">{project.org}</div>
                        <div className="chip-period">{project.period}</div>
                    </div>
                </div>

                {/* RIGHT — Content */}
                <div className="detail-content">
                    <div className="detail-section-label">Overview</div>
                    <p className="detail-full-desc">{project.fullDescription}</p>

                    <div className="detail-section-label">Highlights</div>
                    <ul className="highlights-list">
                        {project.highlights.map((h, i) => (
                            <li key={i}>
                                <div className="bullet-dot" style={{ background: project.color.hex }} />
                                <span>{h}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="detail-section-label" style={{ marginBottom: "1rem" }}>Tech Stack</div>
                    <div className="tech-grid">
                        {project.tech.map((t) => (
                            <span key={t} className="tech-pill">{t}</span>
                        ))}
                    </div>

                    <div className="action-row">
                        {project.showGithub !== false && (
                            <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-primary">
                                View on GitHub ↗
                            </a>
                        )}
                        {project.pdf && (
                            <a href={project.pdf} target="_blank" rel="noreferrer" className="btn btn-outline">
                                Read Paper ↗
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}