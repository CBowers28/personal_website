"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PROJECTS } from "@/lib/projects";

// ─── Pantone Palette ────────────────────────────────────────────────
// Hero cycling colors — vivid & bright
const HERO_COLORS = [
  { hex: "#E8192C", code: "18-1663 TCX", name: "Racing Red" },
  { hex: "#0047AB", code: "19-4150 TCX", name: "Royal Blue" },
  { hex: "#FF6B00", code: "16-1462 TCX", name: "Blaze Orange" },
  { hex: "#007A3D", code: "18-0135 TCX", name: "Emerald" },
  { hex: "#8B00FF", code: "18-3633 TCX", name: "Violet" },
  { hex: "#FFD700", code: "13-0858 TCX", name: "Gold Fusion" },
  { hex: "#CC0000", code: "19-1664 TCX", name: "True Red" },
  { hex: "#0098DB", code: "15-4020 TCX", name: "Cerulean" },
  { hex: "#FF1493", code: "17-2034 TCX", name: "Deep Pink" },
  { hex: "#00B388", code: "15-5519 TCX", name: "Jade" },
  { hex: "#FF4500", code: "17-1462 TCX", name: "Vermillion" },
  { hex: "#1E3A8A", code: "19-4340 TCX", name: "Cobalt" },
];

// PANTONE_COLORS still used for contact picker + transit map
const PANTONE_COLORS = [
  { hex: "#D2362B", code: "18-1662 TCX", name: "Flame Scarlet" },
  { hex: "#E8A820", code: "14-1064 TCX", name: "Saffron" },
  { hex: "#1B3F6B", code: "19-4052 TCX", name: "Classic Blue" },
  { hex: "#2A9D8F", code: "15-5718 TCX", name: "Biscay Green" },
  { hex: "#4A5240", code: "19-0323 TCX", name: "Chive" },
  { hex: "#7B9EB5", code: "17-4021 TCX", name: "Faded Denim" },
  { hex: "#E07B39", code: "16-1359 TCX", name: "Orange Peel" },
  { hex: "#1A6B7A", code: "18-4528 TCX", name: "Mosaic Blue" },
  { hex: "#E8D8A0", code: "13-0822 TCX", name: "Sunlight" },
  { hex: "#E8A898", code: "14-1318 TCX", name: "Coral Pink" },
  { hex: "#8B4A2A", code: "18-1345 TCX", name: "Cinnamon Stick" },
  { hex: "#6B5070", code: "18-3513 TCX", name: "Grape Compote" },
];


// ─── Timeline ───────────────────────────────────────────────────────
// Transit map timeline
// Time axis: Jan 2022 (0) → Jun 2027 (66 months)
const TOTAL_MONTHS = 66;
const toMonth = (year: number, month: number) => (year - 2022) * 12 + month; // month 0=Jan

// Current month-offset against the 2022 baseline — used to pin ongoing-track end dots to today
const _now = new Date();
const NOW_MONTH = Math.min(TOTAL_MONTHS, Math.max(0, toMonth(_now.getFullYear(), _now.getMonth())));
const trackEnd = (t: { start: number; end: number; ongoing: boolean }) =>
    t.ongoing ? Math.max(t.start + 0.5, NOW_MONTH) : t.end;

const TRACKS = [
  {
    label: "B.S. Computer Science",
    sub: "University of Florida · 3.93 GPA",
    start: toMonth(2022, 7),
    end:   toMonth(2026, 4),
    color: "#1B3F6B",
    ongoing: false,
    link: "https://www.cise.ufl.edu",
  },
  {
    label: "M.S. Computer Science",
    sub: "University of Florida · 4.0 GPA",
    start: toMonth(2025, 7),
    end:   toMonth(2027, 4),
    color: "#2A9D8F",
    ongoing: true,
    link: "https://www.cise.ufl.edu",
  },
  {
    label: "AlgoGators Investment Fund",
    sub: "Lead Developer · Risk & Attribution",
    start: toMonth(2024, 0),
    end:   toMonth(2024, 9),
    color: "#E8A820",
    ongoing: false,
    link: "/experience/algogators",
  },
  {
    label: "Morgan Stanley",
    sub: "Software Engineering Intern",
    start: toMonth(2024, 4),
    end:   toMonth(2024, 7),
    color: "#D2362B",
    ongoing: false,
    link: "/experience/morgan-stanley",
  },
  {
    label: "Ruiz HCI Lab",
    sub: "Undergraduate Researcher · NASA",
    start: toMonth(2024, 9),
    end:   toMonth(2026, 1),
    color: "#E07B39",
    ongoing: true,
    link: "/experience/ruiz-hci-lab",
  },
  {
    label: "Digital Markets Initiative",
    sub: "Undergraduate Researcher · LLM",
    start: toMonth(2025, 11),
    end:   toMonth(2026, 1),
    link: "/experience/digital-markets-initiative",
    color: "#1A6B7A",
    ongoing: true,
  },
  {
    label: "The Feed",
    sub: "SWE · Ops, Forecasting & Fulfillment",
    start: toMonth(2026, 4),
    end:   toMonth(2026, 7),
    color: "#2A6E3F",
    ongoing: true,
    link: "/experience/the-feed",
  },
];

const YEAR_MARKS = [2022, 2023, 2024, 2025, 2026, 2027];

// Mobile-only condensed window (24 months centered on current work)
const MOBILE_START = toMonth(2025, 4);   // May 2025
const MOBILE_END   = toMonth(2027, 4);   // May 2027
const MOBILE_MONTHS = MOBILE_END - MOBILE_START;
const MOBILE_YEAR_MARKS = [2025, 2026, 2027];

// Inline-SVG arrows (replace emoji ↗ / →)
const ArrowRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
);
const ArrowUpRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="9 7 17 7 17 15" />
    </svg>
);

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [heroColorIdx, setHeroColorIdx] = useState(2);
  const [eduModal, setEduModal] = useState<"bs" | "ms" | null>(null);
  const [projectFilter, setProjectFilter] = useState<"All" | "Operations" | "Research" | "Publication" | "Project">("All");

  const TAG_ORDER: Record<string, number> = { Operations: 0, Project: 1, Research: 2, Publication: 3 };
  const visibleProjects = PROJECTS
      .filter((p) => p.tag === "Research" || p.tag === "Publication" || p.showInGrid)
      .filter((p) => projectFilter === "All" ? true : p.tag === projectFilter)
      .slice()
      .sort((a, b) => (TAG_ORDER[a.tag] ?? 99) - (TAG_ORDER[b.tag] ?? 99));

  const heroPantone = HERO_COLORS[heroColorIdx];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroColorIdx((i) => (i + 1) % HERO_COLORS.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = HERO_COLORS[heroColorIdx].hex;
    ctx.fillRect(0, 0, 32, 32);
    const link = (document.querySelector("link[rel~='icon']") as HTMLLinkElement) || document.createElement("link");
    link.rel = "icon";
    link.href = canvas.toDataURL("image/png");
    document.head.appendChild(link);
  }, [heroColorIdx]);
  const nameToColor = (name: string) => {
    if (!name.trim()) return {
      hsl: "#C8C0B0",
      code: "00-0000 TCX",
      pantone: "Type your name to mix your color",
    };
    let h = 0, s = 0;
    for (let i = 0; i < name.length; i++) {
      h = (name.charCodeAt(i) * 37 + h * 31) & 0xffffffff;
      s = (name.charCodeAt(i) * 17 + s * 13) & 0xffffffff;
    }
    const hue = Math.abs(h) % 360;
    const sat = 55 + (Math.abs(s) % 25);
    const lit = 38 + (Math.abs(h >> 4) % 18);
    const codeA = String(10 + (Math.abs(h) % 89)).padStart(2, "0");
    const codeB = String(1000 + (Math.abs(s) % 8999));
    const suffixes = ["TCX", "TPX", "TPG", "TN"];
    const suffix = suffixes[Math.abs(h) % 4];
    const adjectives = ["Vivid","Deep","Soft","Bright","True","Pure","Rich","Bold","Warm","Cool","Wild","Faded"];
    const nouns = ["Azure","Coral","Jade","Amber","Rose","Slate","Sage","Ochre","Indigo","Crimson","Ivory","Teal"];
    const adj  = adjectives[Math.abs(h) % adjectives.length];
    const noun = nouns[Math.abs(s) % nouns.length];
    return {
      hsl: `hsl(${hue},${sat}%,${lit}%)`,
      code: `${codeA}-${codeB} ${suffix}`,
      pantone: `${adj} ${noun}`,
    };
  };

  const nameColor = nameToColor(formData.name);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');

        :root {
          --bg: #F2EFE4;
          --ink: #1A1A18;
          --subtle: #9A9088;
        }

        html { scroll-behavior: smooth; scroll-padding-top: 80px; }
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--bg);
          color: var(--ink);
          font-family: 'Cormorant Garamond', Georgia, serif;
          overflow-x: hidden;
        }

        /* ── NAV ── */
        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 3rem;
          background: rgba(244,240,230,0.85);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(26,26,24,0.08);
        }

        .nav-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.4rem;
          letter-spacing: 0.15em;
          color: var(--ink);
          text-decoration: none;
        }

        .nav-links {
          display: flex; gap: 2.5rem; list-style: none;
        }

        .nav-links a {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--subtle);
          text-decoration: none;
          transition: color 0.2s;
        }

        .nav-links a:hover { color: var(--ink); }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8rem 3rem 4rem;
        }

        .hero-chip {
          display: flex;
          flex-direction: column;
          width: min(480px, 90vw);
          box-shadow: 4px 4px 0 rgba(0,0,0,0.12), 12px 12px 40px rgba(0,0,0,0.08);
          animation: chipRise 0.9s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes chipRise {
          from { opacity: 0; transform: translateY(40px) rotate(-1deg); }
          to   { opacity: 1; transform: translateY(0) rotate(0deg); }
        }

        .chip-color {
          height: 320px;
          background: #1B3F6B;
          position: relative;
          overflow: hidden;
        }

        .chip-color::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%);
        }

        .chip-label {
          background: #fff;
          padding: 1.4rem 1.6rem 1.6rem;
          border-top: none;
        }

        .chip-brand {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1rem;
          letter-spacing: 0.25em;
          color: #888;
          margin-bottom: 0.1rem;
        }

        .chip-name {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: clamp(2rem, 5vw, 3.6rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 0.95;
          color: var(--ink);
        }

        .chip-code {
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          color: #888;
          margin-top: 0.4rem;
          letter-spacing: 0.06em;
        }

        .chip-desc {
          font-size: 1rem;
          line-height: 1.5;
          color: #555;
          margin-top: 0.75rem;
          font-style: italic;
        }

        .hero-aside {
          max-width: 360px;
          padding-left: 4rem;
          animation: fadeUp 1s 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hero-tagline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 3.5rem;
          line-height: 1;
          letter-spacing: 0.03em;
          margin-bottom: 1.2rem;
        }

        .hero-tagline span { color: #E8A820; }

        .hero-body {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #555;
          margin-bottom: 2rem;
        }

        .hero-links {
          display: flex; gap: 1rem; flex-wrap: wrap;
        }

        .btn {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.7rem 1.4rem;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
        }

        .btn-primary {
          background: var(--ink);
          color: var(--bg);
        }

        .btn-primary:hover {
          background: #E8A820;
          color: var(--ink);
        }

        .btn-outline {
          background: transparent;
          color: var(--ink);
          border: 1.5px solid var(--ink);
        }

        .btn-outline:hover {
          background: var(--ink);
          color: var(--bg);
        }

        /* ── SECTION HEADER ── */
        section { padding: 6rem 3rem; }

        .section-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--subtle);
          margin-bottom: 0.5rem;
        }

        .section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          letter-spacing: 0.03em;
          line-height: 1;
          margin-bottom: 3rem;
        }

        /* ── SWATCHES ── */
        .swatches-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .swatch {
          display: flex;
          flex-direction: column;
          gap: 0;
          box-shadow: 2px 2px 0 rgba(0,0,0,0.08), 6px 6px 20px rgba(0,0,0,0.06);
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s;
          text-decoration: none;
          color: inherit;
        }

        .swatch:hover {
          transform: translateY(-6px) rotate(0.5deg);
          box-shadow: 2px 2px 0 rgba(0,0,0,0.1), 12px 20px 40px rgba(0,0,0,0.12);
        }

        .swatch-color {
          height: 160px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          display: block;
        }

        .swatch-color::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%);
          pointer-events: none;
        }

        .swatch-label {
          background: #fff;
          padding: 0.9rem 1rem 1rem;
          margin-top: 0;
          flex: 1;
        }

        .swatch-brand {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: #999;
        }

        .swatch-name {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--ink);
          margin: 0.1rem 0;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .swatch-desc {
          font-size: 0.75rem;
          color: #888;
          font-style: italic;
          margin-top: 0.25rem;
        }

        .swatch-link {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          color: #aaa;
          letter-spacing: 0.06em;
          margin-top: 0.4rem;
          word-break: break-all;
        }

        /* ── TRANSIT MAP (HORIZONTAL) ── */
        .transit-wrapper {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .transit-map {
          width: 100%;
          position: relative;
        }

        /* X axis */
        .transit-x-axis {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1.5px solid rgba(26,26,24,0.12);
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
        }

        .axis-year-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          color: var(--subtle);
          letter-spacing: 0.06em;
        }

        /* Tracks area */
        .tracks-area {
          width: 100%;
          position: relative;
        }

        .track-row {
          position: absolute;
          height: 14px;
          border-radius: 5px;
          transition: opacity 0.2s;
        }

        .track-row:hover { opacity: 0.75; }

        .track-dot-h {
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
        }

        .track-dot-h-start {
          background: var(--bg);
          border: 3px solid currentColor;
        }

        .track-dot-h-end {
          background: currentColor;
        }

        .track-dot-h-ongoing {
          background: var(--bg);
          border: 3px solid currentColor;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 currentColor; }
          50%       { box-shadow: 0 0 0 5px transparent; }
        }

        /* Color key — horizontal grid below the map */
        .color-key {
          width: 100%;
        }

        .key-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.6rem;
          letter-spacing: 0.06em;
          color: var(--ink);
          margin-bottom: 1rem;
        }

        .key-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }

        .key-item {
          display: flex;
          align-items: stretch;
          gap: 0;
          text-decoration: none;
          color: inherit;
          border: 1.5px solid rgba(26,26,24,0.08);
          background: #fff;
          transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
          cursor: pointer;
          overflow: hidden;
        }

        .key-item:hover {
          transform: translateY(-3px);
          border-color: rgba(26,26,24,0.2);
          box-shadow: 4px 4px 16px rgba(0,0,0,0.08);
        }

        .key-swatch {
          width: 10px;
          flex-shrink: 0;
        }

        .key-text {
          padding: 1.2rem 1.2rem;
          flex: 1;
        }

        .key-name {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          line-height: 1.1;
          color: var(--ink);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .key-sub {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          color: var(--subtle);
          letter-spacing: 0.05em;
          margin-top: 4px;
        }

        .key-arrow {
          color: var(--subtle);
          padding: 0.65rem 0.85rem 0.65rem 0;
          align-self: center;
          display: inline-flex;
          align-items: center;
          transition: transform 0.2s, color 0.2s;
        }
        .key-arrow svg { display: block; }

        .key-item:hover .key-arrow { transform: translateX(3px); color: var(--ink); }

        .key-dot-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          color: var(--subtle);
          letter-spacing: 0.06em;
        }

        /* ── EDU MODAL ── */
        .edu-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(26,26,24,0.5);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          backdrop-filter: blur(4px);
        }

        .edu-modal {
          background: var(--bg);
          max-width: 680px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 24px 80px rgba(0,0,0,0.2);
          position: relative;
        }

        .edu-modal-close {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: var(--bg);
          border: 1.5px solid rgba(26,26,24,0.15);
          width: 32px;
          height: 32px;
          cursor: pointer;
          font-size: 1rem;
          color: var(--subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          z-index: 10;
        }

        .edu-modal-close:hover {
          border-color: var(--ink);
          color: var(--ink);
        }

        /* ── EDUCATION CARDS ── */
        .edu-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .edu-card {
          background: #fff;
          border: 1.5px solid rgba(26,26,24,0.08);
          overflow: hidden;
        }

        .edu-card-header {
          padding: 1.4rem 3.5rem 1.2rem 1.5rem;
          border-bottom: 1.5px solid rgba(26,26,24,0.06);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .edu-card-degree {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: var(--ink);
          line-height: 1.2;
        }

        .edu-card-school {
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem;
          color: var(--subtle);
          letter-spacing: 0.06em;
          margin-top: 4px;
        }

        .edu-card-gpa {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          letter-spacing: 0.04em;
          color: var(--ink);
          line-height: 1;
          flex-shrink: 0;
        }

        .edu-card-gpa-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem;
          color: var(--subtle);
          letter-spacing: 0.08em;
          text-align: right;
          margin-top: 2px;
        }

        .edu-card-body {
          padding: 1.2rem 1.5rem 1.4rem;
        }

        .edu-courses-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          color: var(--subtle);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }

        .edu-courses {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .edu-course-chip {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: var(--bg);
          border: 1px solid rgba(26,26,24,0.1);
          padding: 0.3rem 0.65rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          color: var(--ink);
          letter-spacing: 0.04em;
        }

        .edu-course-grade {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 0.6rem;
          font-weight: 700;
          padding: 1px 4px;
          border-radius: 2px;
        }

        .edu-honors {
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(26,26,24,0.06);
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .edu-honor-tag {
          font-family: 'Space Mono', monospace;
          font-size: 0.52rem;
          letter-spacing: 0.06em;
          color: var(--subtle);
          border: 1px solid rgba(26,26,24,0.12);
          padding: 0.25rem 0.6rem;
        }

        @media (max-width: 768px) {
          .edu-grid { grid-template-columns: 1fr; }
        }

        /* ── CONTACT ── */
        .contact-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: start;
          max-width: 1000px;
        }

        .color-preview {
          position: sticky;
          top: 6rem;
          display: flex;
          flex-direction: column;
          gap: 0;
          box-shadow: 4px 4px 0 rgba(0,0,0,0.1), 14px 14px 40px rgba(0,0,0,0.08);
        }

        .preview-swatch {
          height: 240px;
          transition: background 0.4s ease;
        }

        .preview-label {
          background: #fff;
          padding: 1.2rem 1.4rem 1.4rem;
        }

        .preview-brand {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          color: #999;
        }

        .preview-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.6rem;
          letter-spacing: 0.04em;
          color: var(--ink);
        }

        .preview-code {
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem;
          color: #aaa;
          margin-top: 0.3rem;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--subtle);
        }

        .form-input {
          background: transparent;
          border: none;
          border-bottom: 1.5px solid rgba(26,26,24,0.2);
          padding: 0.6rem 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.05rem;
          color: var(--ink);
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }

        .form-input:focus {
          border-bottom-color: var(--ink);
        }

        textarea.form-input {
          resize: none;
          min-height: 100px;
        }

        .submit-success {
          font-family: 'Space Mono', monospace;
          font-size: 0.8rem;
          color: #2A9D8F;
          letter-spacing: 0.08em;
          padding: 1rem 0;
        }

        /* ── FOOTER ── */
        footer {
          border-top: 1px solid rgba(26,26,24,0.08);
          padding: 2rem 3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-copy {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          color: var(--subtle);
          letter-spacing: 0.1em;
        }

        .footer-made {
          font-size: 0.85rem;
          color: var(--subtle);
          font-style: italic;
        }

        /* Default: desktop map shown, mobile map hidden */
        .timeline-mobile { display: none; }
        .key-title-mobile { display: none; }
        .mobile-window-note {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.75rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          color: var(--ink);
          text-transform: uppercase;
        }
        .mobile-window-hint {
          color: var(--subtle);
          font-size: 0.55rem;
          letter-spacing: 0.06em;
          text-transform: none;
          font-style: italic;
        }
        .mobile-track-label {
          position: absolute;
          left: 0;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        @media (max-width: 1024px) {
          .swatches-grid { grid-template-columns: repeat(2, 1fr); }
          .key-grid     { grid-template-columns: repeat(2, 1fr); }
        }

        /* ─── TABLET / LARGE PHONE ─── */
        @media (max-width: 768px) {
          /* NAV — stack logo above links, both centered */
          nav {
            padding: 0.9rem 1.25rem;
            flex-direction: column;
            gap: 0.55rem;
          }
          .nav-logo { font-size: 1.05rem; letter-spacing: 0.18em; }
          .nav-links { gap: 1.25rem; flex-wrap: wrap; justify-content: center; }
          .nav-links a { font-size: 0.65rem; }
          html { scroll-padding-top: 110px; }

          /* HERO — fully stacked + centered */
          .hero {
            flex-direction: column;
            padding: 7rem 1.25rem 3rem;
            justify-content: flex-start;
            align-items: center;
            text-align: center;
          }
          .hero-chip { width: 100%; max-width: 420px; margin: 0 auto; }
          .chip-color { height: 240px; }
          .chip-name { font-size: clamp(1.8rem, 8vw, 2.6rem); }
          .hero-aside {
            padding-left: 0;
            padding-top: 2rem;
            max-width: 100%;
            text-align: center;
          }
          .hero-tagline { font-size: 2.4rem; }
          .hero-body { font-size: 1rem; line-height: 1.6; }
          .hero-links {
            justify-content: center;
          }

          /* SECTION SPACING */
          section { padding: 3.5rem 1.25rem; }
          .section-title { font-size: clamp(1.75rem, 7vw, 2.5rem); margin-bottom: 2rem; }

          /* IMPACT TILES — already auto-fit, just shrink the big number */
          #impact { padding: 2rem 1.25rem 0.5rem !important; }

          /* PROJECTS GRID + FILTER CHIPS */
          .swatches-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }

          /* TRANSIT MAP — hidden on mobile entirely; legend list only */
          .timeline-desktop { display: none; }
          .timeline-mobile  { display: none; }
          .key-title-desktop { display: none; }
          .key-title-mobile  { display: block; }
          .axis-year-label { font-size: 0.6rem; }
          .key-grid { grid-template-columns: 1fr; gap: 0.4rem; }
          .key-name { font-size: 0.78rem; white-space: normal; }
          .key-text { padding: 0.9rem 1rem; }
          .key-sub  { font-size: 0.58rem; }

          /* CONTACT */
          .contact-inner { grid-template-columns: 1fr; gap: 2.5rem; }
          .color-preview { position: static; }

          /* FOOTER — stack stacked */
          footer {
            flex-direction: column;
            gap: 0.9rem;
            padding: 1.75rem 1.25rem;
            text-align: center;
          }
          footer > div { flex-wrap: wrap; justify-content: center; gap: 0.85rem !important; }

          /* EDU MODAL */
          .edu-modal-backdrop { padding: 1rem; }
          .edu-card-header { padding: 1.1rem 3rem 1rem 1.1rem; }
          .edu-card-body   { padding: 1rem 1.1rem 1.2rem; }
          .edu-card-gpa    { font-size: 1.6rem; }
          .edu-card-degree { font-size: 0.8rem; }
        }

        /* ─── SMALL PHONE ─── */
        @media (max-width: 480px) {
          .swatches-grid { grid-template-columns: 1fr; }
          .hero-tagline  { font-size: 2rem; }
          .chip-color    { height: 200px; }
          .chip-name     { font-size: clamp(1.6rem, 9vw, 2.2rem); }
          .nav-logo      { font-size: 0.95rem; letter-spacing: 0.14em; }
          .nav-links     { gap: 1rem; }
          .nav-links a   { font-size: 0.6rem; letter-spacing: 0.08em; }
          .hero-links .btn { flex: 1 1 auto; text-align: center; }
        }
      `}</style>

        {/* NAV */}
        <nav>
          <a href="#" className="nav-logo">CHRISTOPHER BOWERS</a>
          <ul className="nav-links">
            <li><a href="#projects">Projects</a></li>
            <li><a href="#process">Process</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        {/* HERO */}
        <section className="hero" style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
          <div className="hero-chip">
            <div className="chip-color" style={{ background: heroPantone.hex, transition: "background 1.5s ease" }} />
            <div className="chip-label">
              <div className="chip-name">CHRISTOPHER BOWERS</div>
              <div className="chip-code" style={{ transition: "all 1.5s ease" }}>{heroPantone.code} · {heroPantone.name}</div>
              <div className="chip-desc">
                Software for Operations · SWE · MS CS @ UF
              </div>
            </div>
          </div>

          <div className="hero-aside">
            <p className="hero-body">
              CS graduate student at the University of Florida building software that
              moves operations. From forecasting and fulfillment systems at The Feed,
              to risk infrastructure for an algorithmic investment fund, to NASA
              eye-tracking research and LLM pipelines — I write code where the
              metric is real-world throughput.
            </p>
            <div className="hero-links">
              <a href="#projects" className="btn btn-primary">View Operations Work</a>
              <a href="https://linkedin.com/in/christopherjbowers" className="btn btn-outline" target="_blank">LinkedIn ↗</a>
              <a href="https://github.com/CBowers28" className="btn btn-outline" target="_blank">GitHub ↗</a>
            </div>
          </div>
        </section>

        {/* IMPACT STRIP */}
        <section id="impact" style={{ padding: "3rem 3rem 1rem" }}>
          <div className="section-label">By the Numbers</div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
            marginTop: "1rem",
          }}>
            {[
              { stat: "+100%", label: "Warehouse capacity expansion", sub: "The Feed · 2026" },
              { stat: "30%", label: "Faster order fulfillment", sub: "The Feed · 2026" },
              { stat: "$750M+", label: "Client portfolio supported", sub: "Morgan Stanley · 2024" },
            ].map((tile) => (
                <div key={tile.label} style={{
                  background: "#fff",
                  border: "1.5px solid rgba(26,26,24,0.08)",
                  padding: "1.6rem 1.4rem",
                  boxShadow: "2px 2px 0 rgba(0,0,0,0.06)",
                }}>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "2.6rem",
                    letterSpacing: "0.02em",
                    lineHeight: 1,
                    color: "#2A6E3F",
                  }}>{tile.stat}</div>
                  <div style={{
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    marginTop: "0.6rem",
                    color: "var(--ink)",
                  }}>{tile.label}</div>
                  <div style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.08em",
                    color: "var(--subtle)",
                    marginTop: "0.35rem",
                  }}>{tile.sub}</div>
                </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" style={{ background: "rgba(0,0,0,0.02)" }}>
          <div className="section-label">The Collection</div>
          <div className="section-title">OPERATIONS · RESEARCH · SYSTEMS</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            {(["All", "Operations", "Project", "Research", "Publication"] as const).map((f) => {
              const active = projectFilter === f;
              return (
                  <button
                      key={f}
                      onClick={() => setProjectFilter(f)}
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.65rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        padding: "0.55rem 1.1rem",
                        cursor: "pointer",
                        border: active ? "1.5px solid var(--ink)" : "1.5px solid rgba(26,26,24,0.15)",
                        background: active ? "var(--ink)" : "transparent",
                        color: active ? "var(--bg)" : "var(--ink)",
                        transition: "all 0.15s",
                      }}
                  >
                    {f}
                  </button>
              );
            })}
          </div>
          <div className="swatches-grid">
            {visibleProjects.map((p) => (
                <Link key={p.name} href={`/projects/${p.slug}`} className="swatch">
                  <div className="swatch-color" style={{ background: p.color.hex }}>
                <span style={{
                  position: "absolute", top: 10, right: 10,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.6rem", letterSpacing: "0.1em",
                  background: "rgba(255,255,255,0.2)",
                  color: "#fff", padding: "2px 7px", borderRadius: 2,
                  backdropFilter: "blur(4px)",
                  zIndex: 1,
                }}>{p.tag}</span>
                  </div>
                  <div className="swatch-label">
                    <div className="swatch-name">{p.name}</div>
                    <div className="swatch-desc">{p.desc}</div>
                    <div className="swatch-link">{p.color.code} · {p.color.name}</div>
                  </div>
                </Link>
            ))}
          </div>
        </section>

        {/* TRANSIT MAP — HORIZONTAL, 2022 left / 2027 right */}
        <section id="process">
          <div className="section-label">Color Process</div>
          <div className="section-title">EDUCATION &amp; EXPERIENCE</div>
          <div className="transit-wrapper">

            {/* Horizontal Map — DESKTOP (full 2022–2027 window) */}
            <div className="transit-map timeline-desktop">
              {/* X axis — year labels */}
              <div className="transit-x-axis">
                {YEAR_MARKS.map((yr) => (
                    <span key={yr} className="axis-year-label">{yr}</span>
                ))}
              </div>

              {/* Tracks */}
              <div className="tracks-area" style={{ height: TRACKS.length * 36 + 20, position: "relative" }}>
                {TRACKS.map((track, i) => {
                  const MAP_W_PCT = 100;
                  const endM = trackEnd(track);
                  const leftPct  = (track.start / TOTAL_MONTHS) * MAP_W_PCT;
                  const widthPct = ((endM - track.start) / TOTAL_MONTHS) * MAP_W_PCT;
                  const topPx    = 10 + i * 36;
                  return (
                      <div key={track.label}>
                        <div
                            className="track-row"
                            style={{
                              left: `${leftPct}%`,
                              width: `${widthPct}%`,
                              top: topPx,
                              background: track.color,
                            }}
                        />
                        {/* Left dot = start */}
                        <div
                            className="track-dot-h track-dot-h-start"
                            style={{ left: `${leftPct}%`, top: topPx + 7, color: track.color, borderColor: track.color }}
                        />
                        {/* Right dot = end / ongoing */}
                        <div
                            className={`track-dot-h ${track.ongoing ? "track-dot-h-ongoing" : "track-dot-h-end"}`}
                            style={{
                              left: `${leftPct + widthPct}%`,
                              top: topPx + 7,
                              color: track.color,
                              borderColor: track.color,
                              background: track.ongoing ? "var(--bg)" : track.color,
                            }}
                        />
                      </div>
                  );
                })}
              </div>
            </div>

            {/* Horizontal Map — MOBILE (condensed 24-month window) */}
            <div className="transit-map timeline-mobile">
              <div className="mobile-window-note">
                <span>Recent · {MOBILE_YEAR_MARKS[0]}–{MOBILE_YEAR_MARKS[MOBILE_YEAR_MARKS.length - 1]}</span>
                <span className="mobile-window-hint">Older roles in legend below</span>
              </div>
              <div className="transit-x-axis">
                {MOBILE_YEAR_MARKS.map((yr) => (
                    <span key={yr} className="axis-year-label">{yr}</span>
                ))}
              </div>
              {(() => {
                const visible = TRACKS
                    .map((t) => {
                      const realEnd = trackEnd(t);
                      const vStart = Math.max(t.start, MOBILE_START);
                      const vEnd   = Math.min(realEnd, MOBILE_END);
                      if (vEnd <= MOBILE_START || vStart >= MOBILE_END) return null;
                      return {
                        ...t,
                        vStart, vEnd,
                        clipL: t.start < MOBILE_START,
                        clipR: realEnd > MOBILE_END,
                      };
                    })
                    .filter((t): t is NonNullable<typeof t> => t !== null);
                return (
                    <div className="tracks-area" style={{ height: visible.length * 44 + 12, position: "relative" }}>
                      {visible.map((t, i) => {
                        const leftPct  = ((t.vStart - MOBILE_START) / MOBILE_MONTHS) * 100;
                        const widthPct = ((t.vEnd - t.vStart) / MOBILE_MONTHS) * 100;
                        const topPx    = 6 + i * 44;
                        return (
                            <div key={t.label}>
                              <div
                                  className="track-row mobile-track-row"
                                  style={{
                                    left: `${leftPct}%`,
                                    width: `${widthPct}%`,
                                    top: topPx,
                                    background: t.color,
                                    borderTopLeftRadius:    t.clipL ? 0 : 5,
                                    borderBottomLeftRadius: t.clipL ? 0 : 5,
                                    borderTopRightRadius:    t.clipR ? 0 : 5,
                                    borderBottomRightRadius: t.clipR ? 0 : 5,
                                  }}
                              />
                              {!t.clipL && (
                                  <div className="track-dot-h track-dot-h-start"
                                       style={{ left: `${leftPct}%`, top: topPx + 7, color: t.color, borderColor: t.color }} />
                              )}
                              {!t.clipR && (
                                  <div className={`track-dot-h ${t.ongoing ? "track-dot-h-ongoing" : "track-dot-h-end"}`}
                                       style={{
                                         left: `${leftPct + widthPct}%`,
                                         top: topPx + 7,
                                         color: t.color,
                                         borderColor: t.color,
                                         background: t.ongoing ? "var(--bg)" : t.color,
                                       }} />
                              )}
                              <div className="mobile-track-label" style={{ top: topPx + 18, color: t.color }}>
                                {t.label}
                              </div>
                            </div>
                        );
                      })}
                    </div>
                );
              })()}
            </div>

            {/* Legend grid */}
            <div className="color-key">
              <div className="key-title key-title-desktop">Legend</div>
              <div className="key-title key-title-mobile">Experience</div>
              <div className="key-grid">
                {TRACKS.map((track) => {
                  const isEdu = track.label === "B.S. Computer Science" || track.label === "M.S. Computer Science";
                  const eduKey = track.label === "B.S. Computer Science" ? "bs" : "ms";
                  if (isEdu) {
                    return (
                        <button key={track.label} className="key-item" style={{ border: "none", cursor: "pointer", textAlign: "left", width: "100%" }}
                                onClick={() => setEduModal(eduKey as "bs" | "ms")}
                        >
                          <div className="key-swatch" style={{ background: track.color }} />
                          <div className="key-text">
                            <div className="key-name">{track.label}</div>
                            <div className="key-sub">{track.sub}</div>
                          </div>
                          <span className="key-arrow"><ArrowUpRight /></span>
                        </button>
                    );
                  }
                  return (
                      <Link key={track.label} href={track.link} className="key-item"
                            target={track.link.startsWith("http") ? "_blank" : undefined}
                            rel={track.link.startsWith("http") ? "noreferrer" : undefined}
                      >
                        <div className="key-swatch" style={{ background: track.color }} />
                        <div className="key-text">
                          <div className="key-name">{track.label}</div>
                          <div className="key-sub">{track.sub}</div>
                        </div>
                        <span className="key-arrow"><ArrowRight /></span>
                      </Link>
                  );
                })}
              </div>
              <div style={{ marginTop: "1.2rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", border: "2.5px solid #888", background: "var(--bg)", flexShrink: 0 }} />
                  <span className="key-dot-label">Start date</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#888", flexShrink: 0 }} />
                  <span className="key-dot-label">End date</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", border: "2.5px solid #888", background: "var(--bg)", flexShrink: 0, animation: "pulse 2s infinite" }} />
                  <span className="key-dot-label">Ongoing</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* EDUCATION MODAL */}
        {eduModal && (
            <div className="edu-modal-backdrop" onClick={() => setEduModal(null)}>
              <div className="edu-modal" onClick={(e) => e.stopPropagation()}>
                <button className="edu-modal-close" onClick={() => setEduModal(null)}>✕</button>

                {eduModal === "bs" && (
                    <div className="edu-card" style={{ border: "none", boxShadow: "none" }}>
                      <div className="edu-card-header">
                        <div>
                          <div className="edu-card-degree">B.S. Computer Science</div>
                          <div className="edu-card-school">University of Florida · Herbert Wertheim College of Engineering · 2022–May 2026</div>
                          <div className="edu-card-school" style={{ marginTop: 4 }}>Certificate: AI Fundamentals &amp; Applications · President&apos;s Honor Roll</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div className="edu-card-gpa" style={{ color: "#1B3F6B" }}>3.93</div>
                          <div className="edu-card-gpa-label">GPA</div>
                        </div>
                      </div>
                      <div className="edu-card-body">
                        <div className="edu-courses-label">Key Coursework</div>
                        <div className="edu-courses">
                          {[
                            { name: "Operating Systems", code: "COP4600", grade: "A" },
                            { name: "Data Structures & Algorithms", code: "COP3530", grade: "B" },
                            { name: "Computer Organization", code: "CDA3101", grade: "A" },
                            { name: "Software Engineering", code: "CEN3031", grade: "A" },
                            { name: "Machine Learning", code: "CIS4930", grade: "A" },
                            { name: "AI Fundamentals", code: "EEL3872", grade: "A" },
                            { name: "Computational Linear Algebra", code: "MAS3114", grade: "A" },
                            { name: "Discrete Structures", code: "COT3100", grade: "B+" },
                            { name: "Engineering Statistics", code: "STA3032", grade: "A" },
                            { name: "Prog Fundamentals I", code: "COP3502C", grade: "A" },
                            { name: "Prog Fundamentals II", code: "COP3503C", grade: "A" },
                          ].map((c) => (
                              <div key={c.code} className="edu-course-chip">
                                <span>{c.name}</span>
                                <span className="edu-course-grade" style={{
                                  background: c.grade === "A" ? "#2A9D8F22" : c.grade === "B+" ? "#E8A82022" : "#7B9EB522",
                                  color: c.grade === "A" ? "#2A9D8F" : c.grade === "B+" ? "#c8870a" : "#4a6a80",
                                }}>{c.grade}</span>
                              </div>
                          ))}
                        </div>
                        <div className="edu-honors">
                          <span className="edu-honor-tag">🏅 President&apos;s Honor Roll</span>
                          <span className="edu-honor-tag">📜 AI Fundamentals Certificate</span>
                          <span className="edu-honor-tag">149 Total Credit Hours</span>
                        </div>
                      </div>
                    </div>
                )}

                {eduModal === "ms" && (
                    <div className="edu-card" style={{ border: "none", boxShadow: "none" }}>
                      <div className="edu-card-header">
                        <div>
                          <div className="edu-card-degree">M.S. Computer Science</div>
                          <div className="edu-card-school">University of Florida · Herbert Wertheim College of Engineering · 2025–May 2027</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div className="edu-card-gpa" style={{ color: "#2A9D8F" }}>4.0</div>
                          <div className="edu-card-gpa-label">GPA</div>
                        </div>
                      </div>
                      <div className="edu-card-body">
                        <div className="edu-courses-label">Key Coursework</div>
                        <div className="edu-courses">
                          {[
                            { name: "Large Language Models", code: "CIS6930", grade: "A" },
                            { name: "Computer Networks", code: "CNT5106C", grade: "A" },
                            { name: "Operating Systems", code: "COP4600", grade: "A" },
                            { name: "Programming Language Principles", code: "COP5556", grade: "IP" },
                            { name: "Database Systems", code: "CIS4301", grade: "IP" },
                          ].map((c) => (
                              <div key={c.code} className="edu-course-chip">
                                <span>{c.name}</span>
                                <span className="edu-course-grade" style={{
                                  background: c.grade === "A" ? "#2A9D8F22" : "#E8A82022",
                                  color: c.grade === "A" ? "#2A9D8F" : "#c8870a",
                                }}>{c.grade}</span>
                              </div>
                          ))}
                        </div>
                        <div className="edu-honors">
                          <span className="edu-honor-tag">🔬 Active Researcher · Ruiz HCI Lab</span>
                          <span className="edu-honor-tag">🔬 Active Researcher · Digital Markets Initiative</span>
                        </div>
                      </div>
                    </div>
                )}
              </div>
            </div>
        )}

        {/* CONTACT */}
        <section id="contact" style={{ background: "rgba(0,0,0,0.02)" }}>
          <div className="section-title">GET IN TOUCH</div>
          <div className="contact-inner">
            {/* Live color chip — driven by name hash */}
            <div className="color-preview">
              <div className="preview-swatch" style={{ background: nameColor.hsl, transition: "background 0.6s ease" }} />
              <div className="preview-label">
                <div className="preview-name" style={{ transition: "all 0.4s ease" }}>
                  {formData.name || "YOUR NAME"}
                </div>
                <div className="preview-code" style={{ transition: "all 0.4s ease" }}>
                  {nameColor.code}
                </div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: "0.85rem",
                  color: "#888",
                  marginTop: "0.25rem",
                  transition: "all 0.4s ease",
                }}>
                  {nameColor.pantone}
                </div>
              </div>
            </div>

            {/* Form */}
            {submitted ? (
                <div className="submit-success">
                  ✓ COLOR MIXED — I&apos;ll be in touch soon.
                </div>
            ) : (
                <form
                    className="contact-form"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        await fetch("/api/contact", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            name: formData.name,
                            email: formData.email,
                            message: formData.message,
                            colorName: nameColor.pantone,
                            colorCode: nameColor.code,
                            colorHsl: nameColor.hsl,
                          }),
                        });
                      } catch (_) {}
                      setSubmitted(true);
                    }}
                >
                  <div className="form-field">
                    <label className="form-label">Your Name</label>
                    <input
                        name="name"
                        className="form-input"
                        placeholder="Jane Smith"
                        value={formData.name}
                        onChange={handleInput}
                        required
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Email</label>
                    <input
                        name="email"
                        type="email"
                        className="form-input"
                        placeholder="jane@example.com"
                        value={formData.email}
                        onChange={handleInput}
                        required
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Message</label>
                    <textarea
                        name="message"
                        className="form-input"
                        placeholder="Let's build something together..."
                        value={formData.message}
                        onChange={handleInput}
                        required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
                    Mix the Color →
                  </button>
                </form>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <div className="footer-copy">© 2026 CHRISTOPHER BOWERS · ALL RIGHTS RESERVED</div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <a href="mailto:christopherbowers28@gmail.com" style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "var(--subtle)", textDecoration: "none", letterSpacing: "0.08em" }}>christopherbowers28@gmail.com</a>
            <a href="https://linkedin.com/in/christopherjbowers" style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "var(--subtle)", textDecoration: "none", letterSpacing: "0.08em" }}>LinkedIn</a>
            <a href="https://github.com/CBowers28" style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "var(--subtle)", textDecoration: "none", letterSpacing: "0.08em" }}>GitHub</a>
          </div>
        </footer>
      </>
  );
}