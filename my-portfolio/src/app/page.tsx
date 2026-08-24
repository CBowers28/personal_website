"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PROJECTS, COLLECTIONS } from "@/lib/projects";
import { PUBLISHED_CURRENTLY } from "@/lib/currently";

// ─── Pantone Palette ────────────────────────────────────────────────
// Hero cycling colors, vivid & bright
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


// ─── Colors Over Time ───────────────────────────────────────────────
// A chromatic timeline: each era is a phase of interest with its own Pantone
// color, and the major milestone projects from that phase are pinned to it.
// The spine changes color era-to-era, a palette that evolves as focus shifts.
type Era = {
  years: string;
  focus: string;
  interest: string;
  color: { hex: string; code: string; name: string };
  roles: { label: string; link: string }[];
  milestones: string[]; // project slugs, resolved against PROJECTS
  ongoing?: boolean;
};

const ERAS: Era[] = [
  {
    years: "2022 – 2023",
    focus: "Foundations",
    interest: "Mostly just learning to build, the CS fundamentals, and the first programs of mine that actually did something.",
    color: { hex: "#1B3F6B", code: "19-4052 TCX", name: "Classic Blue" },
    roles: [],
    milestones: [],
  },
  {
    years: "2024",
    focus: "Markets & Risk",
    interest: "I got into finance because decisions driven purely by compute struck me as interesting. In practice that meant risk infrastructure for a student trading fund and tooling for a $750M+ desk.",
    color: { hex: "#E8A820", code: "14-1064 TCX", name: "Saffron" },
    roles: [
      { label: "AlgoGators Fund", link: "/experience/algogators" },
      { label: "Morgan Stanley", link: "/experience/morgan-stanley" },
    ],
    milestones: ["algogators-risk-framework", "morgan-stanley-automation"],
  },
  {
    years: "2024 – 2025",
    focus: "Research & Perception",
    interest: "A turn toward how people and computers actually interact, eye-tracking for a NASA fatigue study, and how people share attention in augmented reality.",
    color: { hex: "#E07B39", code: "16-1359 TCX", name: "Orange Peel" },
    roles: [{ label: "Ruiz HCI Lab", link: "/experience/ruiz-hci-lab" }],
    milestones: ["nasa-eye-tracking"],
  },
  {
    years: "2025 – 2026",
    focus: "Models & Language",
    interest: "Getting serious about ML, fine-tuning LLMs on HiPerGator and measuring what language models are doing to the economy. Less interested in the buzzwords than in how they actually work.",
    color: { hex: "#6C4F8C", code: "18-3339 TCX", name: "Amethyst Orchid" },
    roles: [{ label: "Digital Markets Initiative", link: "/experience/digital-markets-initiative" }],
    milestones: ["llm-finetuning", "llm-sentiment-analysis"],
  },
  {
    years: "2026 – Present",
    focus: "Operations",
    interest: "Software that moves real operations, forecasting, fulfillment, and the recommendation stack scaling The Feed into new regions.",
    color: { hex: "#2A6E3F", code: "18-6320 TCX", name: "Jolly Green" },
    roles: [{ label: "The Feed", link: "/experience/the-feed" }],
    milestones: ["feed-warehouse-expansion", "strava-recommender"],
    ongoing: true,
  },
];

// Two education tracks kept as clickable chips (open the coursework modals).
const EDU_TRACKS = [
  { key: "bs" as const, degree: "B.S. Computer Science", sub: "University of Florida · 2022 – 2026", gpa: "3.93", color: "#1B3F6B" },
  { key: "ms" as const, degree: "M.S. Computer Science", sub: "University of Florida · 2025 – 2027", gpa: "4.0", color: "#2A9D8F" },
];

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
// Two overlapping paint drops with a blended center — the "currently mixing" mark.
const MixIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="14" r="6" />
      <circle cx="15" cy="9" r="6" />
    </svg>
);

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [heroColorIdx, setHeroColorIdx] = useState(2);
  const [eduModal, setEduModal] = useState<"bs" | "ms" | null>(null);
  const [openCollection, setOpenCollection] = useState<string | null>(null);
  // Anti-spam: honeypot value + the moment the form was rendered (bots submit instantly).
  const [honeypot, setHoneypot] = useState("");
  const formRenderedAt = useRef<number | null>(null);

  // Stamp the render time on mount (kept out of render to stay pure).
  useEffect(() => {
    formRenderedAt.current = Date.now();
  }, []);

  // Three vivid "staple" projects, then everything else grouped into
  // muted themed collections.
  const heroProjects = PROJECTS.filter((p) => p.hero);
  const collectionGroups = COLLECTIONS.map((c) => ({
    ...c,
    projects: PROJECTS.filter((p) => p.collection === c.slug && !p.hero),
  })).filter((g) => g.projects.length > 0);

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
          --bg: #F8F6F0;
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
          background: rgba(248,246,240,0.85);
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
        section { padding: 4rem 3rem; }

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

        /* ── SECTION LEDE ── */
        .section-lede {
          font-size: 1.15rem;
          line-height: 1.6;
          color: #666;
          max-width: 560px;
          margin: -2rem 0 2.5rem;
          font-style: italic;
        }

        /* ── CURRENTLY MIXING ── */
        .mixing-kicker {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--subtle);
        }
        .mixing-kicker svg { animation: mixSpin 9s linear infinite; }
        @keyframes mixSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .mixing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
        }

        .mixing-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          background: #fff;
          box-shadow: 4px 4px 0 rgba(0,0,0,0.10), 10px 14px 34px rgba(0,0,0,0.09);
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s;
        }
        .mixing-card.is-link:hover {
          transform: translateY(-8px);
          box-shadow: 4px 4px 0 rgba(0,0,0,0.12), 18px 28px 52px rgba(0,0,0,0.16);
        }

        /* The "wet on the palette" swatch — a two-tone mix that keeps shifting. */
        .mixing-color {
          height: 210px;
          position: relative;
          overflow: hidden;
          background-size: 200% 200%;
          animation: mixShift 8s ease-in-out infinite;
        }
        @keyframes mixShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .mixing-color::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 55%);
          pointer-events: none;
        }

        .mixing-wet {
          position: absolute;
          top: 1.1rem;
          left: 1.1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          background: rgba(255,255,255,0.22);
          backdrop-filter: blur(4px);
          color: #fff;
          padding: 3px 9px 3px 7px;
          border-radius: 2px;
          z-index: 1;
        }
        .mixing-wet-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fff;
          animation: mixPulse 1.8s ease-in-out infinite;
        }
        @keyframes mixPulse {
          0%, 100% { opacity: 0.35; transform: scale(0.8); }
          50%      { opacity: 1;    transform: scale(1.15); }
        }

        .mixing-stage {
          position: absolute;
          top: 1.1rem;
          right: 1.1rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(4px);
          color: #fff;
          padding: 3px 9px;
          border-radius: 2px;
          z-index: 1;
        }

        .mixing-label {
          padding: 1.4rem 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .mixing-brand {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.25em;
          color: #b0a89c;
          margin-bottom: 0.2rem;
        }
        .mixing-name {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          line-height: 1.15;
          color: var(--ink);
        }
        .mixing-desc {
          font-size: 0.95rem;
          line-height: 1.45;
          color: #777;
          font-style: italic;
          margin-top: 0.5rem;
        }
        .mixing-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 1rem;
        }
        .mixing-tech-chip {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--subtle);
          border: 1px solid rgba(26,26,24,0.12);
          padding: 0.2rem 0.5rem;
          border-radius: 2px;
        }
        .mixing-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.1rem;
          padding-top: 0.9rem;
          border-top: 1px solid rgba(26,26,24,0.08);
        }
        .mixing-code {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          color: #aaa;
          letter-spacing: 0.05em;
        }
        .mixing-arrow {
          color: var(--subtle);
          display: inline-flex;
          transition: transform 0.2s, color 0.2s;
        }
        .mixing-card.is-link:hover .mixing-arrow { transform: translate(3px, -3px); color: var(--ink); }

        /* ── HERO STAPLES ── */
        .staples-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
        }

        .staple {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          background: #fff;
          box-shadow: 4px 4px 0 rgba(0,0,0,0.10), 10px 14px 34px rgba(0,0,0,0.09);
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s;
        }

        .staple:hover {
          transform: translateY(-8px);
          box-shadow: 4px 4px 0 rgba(0,0,0,0.12), 18px 28px 52px rgba(0,0,0,0.16);
        }

        .staple-color {
          height: 260px;
          position: relative;
          overflow: hidden;
        }

        .staple-color::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 55%);
          pointer-events: none;
        }

        .staple-index {
          position: absolute;
          top: 1rem;
          left: 1.1rem;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.4rem;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.8);
          z-index: 1;
        }

        .staple-tag {
          position: absolute;
          top: 1.1rem;
          right: 1.1rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(4px);
          color: #fff;
          padding: 3px 9px;
          border-radius: 2px;
          z-index: 1;
        }

        .staple-label {
          padding: 1.4rem 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .staple-brand {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.25em;
          color: #b0a89c;
          margin-bottom: 0.2rem;
        }

        .staple-name {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          line-height: 1.15;
          color: var(--ink);
        }

        .staple-desc {
          font-size: 0.95rem;
          line-height: 1.45;
          color: #777;
          font-style: italic;
          margin-top: 0.5rem;
          flex: 1;
        }

        .staple-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.1rem;
          padding-top: 0.9rem;
          border-top: 1px solid rgba(26,26,24,0.08);
        }

        .staple-code {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          color: #aaa;
          letter-spacing: 0.05em;
        }

        .staple-arrow {
          color: var(--subtle);
          display: inline-flex;
          transition: transform 0.2s, color 0.2s;
        }
        .staple:hover .staple-arrow { transform: translate(3px, -3px); color: var(--ink); }

        /* ── COLLECTIONS ── */
        .collections-list {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .collection {
          background: #fff;
          border: 1.5px solid rgba(26,26,24,0.08);
          overflow: hidden;
          transition: box-shadow 0.25s, border-color 0.25s;
        }

        .collection.is-open {
          box-shadow: 0 10px 34px rgba(0,0,0,0.08);
          border-color: rgba(26,26,24,0.14);
        }

        .collection-head {
          width: 100%;
          display: flex;
          align-items: stretch;
          gap: 0;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          padding: 0;
        }

        .collection-swatch {
          width: 14px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }
        .collection-swatch-seg { flex: 1; }

        .collection-meta {
          padding: 1.4rem 1.5rem;
          flex: 1;
          min-width: 0;
        }

        .collection-kicker {
          display: block;
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--subtle);
          margin-bottom: 0.35rem;
        }

        .collection-name {
          display: block;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.7rem;
          letter-spacing: 0.03em;
          line-height: 1;
          color: var(--ink);
        }

        .collection-blurb {
          display: block;
          font-size: 0.95rem;
          line-height: 1.45;
          color: #888;
          margin-top: 0.5rem;
          max-width: 560px;
        }

        .collection-aside {
          display: flex;
          align-items: center;
          gap: 1.1rem;
          padding: 1.4rem 1.5rem;
          flex-shrink: 0;
        }

        .collection-count {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--subtle);
          white-space: nowrap;
        }

        .collection-chevron {
          color: var(--subtle);
          display: inline-flex;
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), color 0.2s;
          transform: rotate(90deg);
        }
        .collection-chevron.up { transform: rotate(-90deg); color: var(--ink); }
        .collection-head:hover .collection-chevron { color: var(--ink); }

        .collection-body {
          border-top: 1.5px solid rgba(26,26,24,0.06);
          padding: 0.5rem 1.5rem 0.75rem;
          animation: collectionOpen 0.35s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes collectionOpen {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .collection-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0.25rem;
          text-decoration: none;
          color: inherit;
          border-bottom: 1px solid rgba(26,26,24,0.06);
          transition: padding-left 0.18s;
        }
        .collection-item:last-child { border-bottom: none; }
        .collection-item:hover { padding-left: 0.75rem; }

        .collection-item-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .collection-item-text { flex: 1; min-width: 0; }

        .collection-item-name {
          display: block;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          color: var(--ink);
          line-height: 1.2;
        }

        .collection-item-desc {
          display: block;
          font-size: 0.9rem;
          color: #999;
          font-style: italic;
          margin-top: 0.15rem;
        }

        .collection-item-tag {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--subtle);
          border: 1px solid rgba(26,26,24,0.12);
          padding: 0.2rem 0.55rem;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .collection-item-arrow {
          color: var(--subtle);
          display: inline-flex;
          flex-shrink: 0;
          transition: transform 0.18s, color 0.18s;
        }
        .collection-item:hover .collection-item-arrow { transform: translateX(3px); color: var(--ink); }

        .collection-intro {
          font-size: 1.08rem;
          line-height: 1.7;
          font-style: italic;
          color: #555;
          padding: 0.4rem 0 1rem 1.1rem;
          margin: 0.6rem 0 0;
          max-width: 640px;
        }

        .collection-palette {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
          padding: 0 0 1rem 1.1rem;
          margin-bottom: 0.5rem;
        }
        .collection-palette-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--subtle);
        }
        .collection-palette-chips {
          display: inline-flex;
          box-shadow: 2px 2px 0 rgba(0,0,0,0.06);
        }
        .collection-palette-chip {
          width: 26px;
          height: 26px;
          display: inline-block;
        }
        .collection-palette-name {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .collection-palette-mood {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          font-weight: 400;
          letter-spacing: 0.06em;
          text-transform: none;
          color: var(--subtle);
        }

        /* ── COLORS OVER TIME (chromatic timeline) ── */
        .chrono { display: flex; flex-direction: column; }
        .era { display: flex; gap: 1.75rem; }
        .era-rail {
          width: 18px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .era-node {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 3px solid var(--bg);
          margin-top: 5px;
          flex-shrink: 0;
          z-index: 1;
          box-shadow: 0 0 0 1px rgba(26,26,24,0.12);
        }
        .era-node-ongoing { animation: pulse 2s infinite; }
        .era-line { width: 3px; flex: 1; margin-top: -3px; border-radius: 2px; }
        .era-card { flex: 1; min-width: 0; padding-bottom: 3rem; }
        .era:last-child .era-card { padding-bottom: 0.5rem; }

        .era-head {
          display: flex;
          align-items: baseline;
          gap: 0.9rem;
          flex-wrap: wrap;
          margin-bottom: 0.35rem;
        }
        .era-years {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--ink);
        }
        .era-code {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.06em;
          color: var(--subtle);
        }
        .era-focus {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          letter-spacing: 0.03em;
          line-height: 1;
          color: var(--ink);
          margin-bottom: 0.6rem;
        }
        .era-interest {
          font-size: 1.12rem;
          line-height: 1.6;
          color: #555;
          max-width: 620px;
          margin-bottom: 1.1rem;
        }
        .era-roles { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.1rem; }
        .era-role {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--subtle);
          text-decoration: none;
          border: 1.5px solid rgba(26,26,24,0.14);
          padding: 0.35rem 0.75rem;
          transition: all 0.18s;
        }
        .era-role:hover { color: var(--ink); border-color: var(--ink); }
        .era-role svg { transition: transform 0.18s; }
        .era-role:hover svg { transform: translateX(2px); }

        .era-milestones { display: flex; align-items: center; gap: 0.85rem; flex-wrap: wrap; }
        .era-milestones-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--subtle);
        }
        .era-milestone-chips { display: inline-flex; flex-wrap: wrap; gap: 0.5rem; }
        .milestone-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: var(--ink);
          text-decoration: none;
          background: #fff;
          border: 1.5px solid rgba(26,26,24,0.1);
          padding: 0.45rem 0.8rem;
          border-radius: 2px;
          transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
        }
        .milestone-chip:hover {
          transform: translateY(-2px);
          border-color: rgba(26,26,24,0.22);
          box-shadow: 3px 3px 0 rgba(0,0,0,0.06);
        }
        .milestone-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

        /* Education band */
        .edu-band { margin-top: 3.5rem; padding-top: 2.5rem; border-top: 1px solid rgba(26,26,24,0.1); }
        .edu-band-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--subtle);
          margin-bottom: 1rem;
        }
        .edu-band-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .edu-band-card {
          display: flex;
          align-items: stretch;
          background: #fff;
          border: 1.5px solid rgba(26,26,24,0.1);
          cursor: pointer;
          text-align: left;
          overflow: hidden;
          padding: 0;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        .edu-band-card:hover {
          transform: translateY(-3px);
          border-color: rgba(26,26,24,0.2);
          box-shadow: 4px 4px 16px rgba(0,0,0,0.08);
        }
        .edu-band-swatch { width: 10px; flex-shrink: 0; }
        .edu-band-text { padding: 1.1rem 1.2rem; flex: 1; min-width: 0; }
        .edu-band-degree {
          display: block;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          color: var(--ink);
        }
        .edu-band-sub {
          display: block;
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.05em;
          color: var(--subtle);
          margin-top: 4px;
        }
        .edu-band-gpa {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.9rem;
          line-height: 1;
          color: var(--ink);
          padding: 0 0.6rem;
        }
        .edu-band-gpa-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem;
          letter-spacing: 0.08em;
          color: var(--subtle);
          margin-top: 3px;
        }
        .edu-band-arrow {
          color: var(--subtle);
          padding: 0 1.1rem;
          display: inline-flex;
          align-items: center;
          transition: transform 0.2s, color 0.2s;
        }
        .edu-band-card:hover .edu-band-arrow { transform: translate(2px,-2px); color: var(--ink); }

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

        /* Color key, horizontal grid below the map */
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
          .mixing-grid  { grid-template-columns: repeat(2, 1fr); }
        }

        /* ─── TABLET / LARGE PHONE ─── */
        @media (max-width: 768px) {
          /* NAV, stack logo above links, both centered */
          nav {
            padding: 0.9rem 1.25rem;
            flex-direction: column;
            gap: 0.55rem;
          }
          .nav-logo { font-size: 1.05rem; letter-spacing: 0.18em; }
          .nav-links { gap: 1.25rem; flex-wrap: wrap; justify-content: center; }
          .nav-links a { font-size: 0.65rem; }
          html { scroll-padding-top: 110px; }

          /* HERO, fully stacked + centered */
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

          /* IMPACT TILES, already auto-fit, just shrink the big number */
          #impact { padding: 2rem 1.25rem 0.5rem !important; }

          /* PROJECTS GRID + FILTER CHIPS */
          .swatches-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }

          /* STAPLES, single column on phones */
          .section-lede { font-size: 1rem; margin: -1.25rem 0 2rem; }
          .staples-grid { grid-template-columns: 1fr; gap: 1.25rem; }
          .staple-color { height: 220px; }

          /* CURRENTLY MIXING, single column on phones */
          .mixing-grid { grid-template-columns: 1fr; gap: 1.25rem; }

          /* COLLECTIONS, stack header + move count/chevron under text */
          .collection-head { flex-wrap: wrap; }
          .collection-meta { padding: 1.2rem 1.25rem 0.6rem; flex-basis: calc(100% - 12px); }
          .collection-aside { padding: 0 1.25rem 1.2rem; width: 100%; justify-content: space-between; }
          .collection-name { font-size: 1.5rem; }
          .collection-item { gap: 0.75rem; }
          .collection-item-tag { display: none; }
          .collection-intro { font-size: 1rem; }

          /* TRANSIT MAP, hidden on mobile entirely; legend list only */
          .timeline-desktop { display: none; }
          .timeline-mobile  { display: none; }
          .key-title-desktop { display: none; }
          .key-title-mobile  { display: none; }
          .axis-year-label { font-size: 0.6rem; }
          .key-grid { grid-template-columns: 1fr; gap: 0.4rem; }
          .key-name { font-size: 0.78rem; white-space: normal; }
          .key-text { padding: 0.9rem 1rem; }
          .key-sub  { font-size: 0.58rem; }

          /* CONTACT */
          .contact-inner { grid-template-columns: 1fr; gap: 2.5rem; }
          .color-preview { position: static; }

          /* FOOTER, stack stacked */
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
            <li><a href="#currently">Currently</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#process">Timeline</a></li>
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
              I&apos;m a CS grad student at UF who likes building software that moves
              real operations. I started in finance, wandered through NASA
              eye-tracking research and LLMs along the way, and now build
              forecasting and fulfillment systems at The Feed. The work I care
              about is the kind where the metric is something real, orders out
              the door, not story points.
            </p>
            <div className="hero-links">
              <a href="#projects" className="btn btn-primary">View Operations Work</a>
              <a href="https://linkedin.com/in/christopherjbowers" className="btn btn-outline" target="_blank">LinkedIn ↗</a>
              <a href="https://github.com/CBowers28" className="btn btn-outline" target="_blank">GitHub ↗</a>
            </div>
          </div>
        </section>

        {/* CURRENTLY MIXING, active work-in-progress, kept up top */}
        <section id="currently">
          <div className="section-label">
            <span className="mixing-kicker"><MixIcon /> On the Palette</span>
          </div>
          <div className="section-title">CURRENTLY MIXING</div>
          <p className="section-lede">
            The colors still wet on the palette, the projects I&apos;m actively
            building right now.
          </p>

          <div className="mixing-grid">
            {PUBLISHED_CURRENTLY.map((c) => {
              const inner = (
                  <>
                    <div
                        className="mixing-color"
                        style={{ background: `linear-gradient(120deg, ${c.mix.from}, ${c.mix.to})` }}
                    >
                      <span className="mixing-wet"><span className="mixing-wet-dot" />Mixing</span>
                      <span className="mixing-stage">{c.stage}</span>
                    </div>
                    <div className="mixing-label">
                      <div className="mixing-brand">Pantone® · In Progress</div>
                      <div className="mixing-name">{c.name}</div>
                      <div className="mixing-desc">{c.blurb}</div>
                      <div className="mixing-tech">
                        {c.tech.map((t) => (
                            <span key={t} className="mixing-tech-chip">{t}</span>
                        ))}
                      </div>
                      <div className="mixing-foot">
                        <span className="mixing-code">{c.code} · {c.colorName}</span>
                        {c.link && <span className="mixing-arrow"><ArrowUpRight /></span>}
                      </div>
                    </div>
                  </>
              );
              return c.link ? (
                  <Link key={c.slug} href={c.link} className="mixing-card is-link">{inner}</Link>
              ) : (
                  <div key={c.slug} className="mixing-card">{inner}</div>
              );
            })}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" style={{ background: "rgba(0,0,0,0.02)" }}>
          <div className="section-label">The 2026 Palette</div>
          <div className="section-title">COLORS OF THE YEAR</div>
          <p className="section-lede">
            My best work from 2026, kept in full color. Everything older is
            filed into the collections further down.
          </p>

          {/* HERO STAPLES, vivid, oversized chips */}
          <div className="staples-grid">
            {heroProjects.map((p, i) => (
                <Link key={p.slug} href={`/projects/${p.slug}`} className="staple">
                  <div className="staple-color" style={{ background: p.color.hex }}>
                    <span className="staple-index">{String(i + 1).padStart(2, "0")}</span>
                    <span className="staple-tag">{p.tag}</span>
                  </div>
                  <div className="staple-label">
                    <div className="staple-brand">Pantone® · 2026</div>
                    <div className="staple-name">{p.name}</div>
                    <div className="staple-desc">{p.desc}</div>
                    <div className="staple-foot">
                      <span className="staple-code">{p.color.code} · {p.color.name}</span>
                      <span className="staple-arrow"><ArrowUpRight /></span>
                    </div>
                  </div>
                </Link>
            ))}
          </div>

          {/* COLLECTIONS, deep heritage palette, expandable archives */}
          <div className="section-label" style={{ marginTop: "5rem" }}>The Heritage Palette</div>
          <div className="section-title">THE COLLECTIONS</div>
          <p className="section-lede">
            The rest, grouped by theme. Open one to read what that work is
            actually about, and see the projects inside.
          </p>

          <div className="collections-list">
            {collectionGroups.map((c) => {
              const open = openCollection === c.slug;
              return (
                  <div key={c.slug} className={`collection ${open ? "is-open" : ""}`}>
                    <button
                        className="collection-head"
                        onClick={() => setOpenCollection(open ? null : c.slug)}
                        aria-expanded={open}
                    >
                      <span className="collection-swatch">
                        {c.palette.colors.map((col, ci) => (
                            <span key={ci} className="collection-swatch-seg" style={{ background: col }} />
                        ))}
                      </span>
                      <span className="collection-meta">
                        <span className="collection-kicker">{c.kicker}</span>
                        <span className="collection-name">{c.name}</span>
                        <span className="collection-blurb">{c.blurb}</span>
                      </span>
                      <span className="collection-aside">
                        <span className="collection-count">
                          {c.projects.length} {c.projects.length === 1 ? "project" : "projects"}
                        </span>
                        <span className={`collection-chevron ${open ? "up" : ""}`}>
                          <ArrowRight />
                        </span>
                      </span>
                    </button>

                    {open && (
                        <div className="collection-body">
                          <p className="collection-intro" style={{ borderLeft: `3px solid ${c.color.hex}` }}>
                            {c.longIntro}
                          </p>
                          <div className="collection-palette">
                            <span className="collection-palette-label">Palette</span>
                            <span className="collection-palette-chips">
                              {c.palette.colors.map((col, ci) => (
                                  <span key={ci} className="collection-palette-chip" style={{ background: col }} />
                              ))}
                            </span>
                            <span className="collection-palette-name">
                              {c.palette.name} <span className="collection-palette-mood">· {c.palette.mood}</span>
                            </span>
                          </div>
                          {c.projects.map((p) => (
                              <Link key={p.slug} href={`/projects/${p.slug}`} className="collection-item">
                                <span className="collection-item-dot" style={{ background: p.color.hex }} />
                                <span className="collection-item-text">
                                  <span className="collection-item-name">{p.name}</span>
                                  <span className="collection-item-desc">{p.desc}</span>
                                </span>
                                <span className="collection-item-tag">{p.tag}</span>
                                <span className="collection-item-arrow"><ArrowRight /></span>
                              </Link>
                          ))}
                        </div>
                    )}
                  </div>
              );
            })}
          </div>
        </section>

        {/* COLORS OVER TIME, chromatic timeline of interests + milestones */}
        <section id="process">
          <div className="section-label">A Palette That Evolves</div>
          <div className="section-title">COLORS OVER TIME</div>
          <p className="section-lede">
            My focus has moved around a lot, finance, then research, then machine
            learning, now operations, and each shift shows up here as a new color.
            The major projects are pinned where they happened.
          </p>

          <div className="chrono">
            {ERAS.slice().reverse().map((era, i) => {
              const last = i === ERAS.length - 1;
              return (
                  <div key={era.focus} className="era">
                    <div className="era-rail">
                      <span
                          className={`era-node ${era.ongoing ? "era-node-ongoing" : ""}`}
                          style={{ background: era.color.hex, color: era.color.hex }}
                      />
                      <span
                          className="era-line"
                          style={{
                            background: last
                                ? `linear-gradient(${era.color.hex}, transparent)`
                                : era.color.hex,
                          }}
                      />
                    </div>
                    <div className="era-card">
                      <div className="era-head">
                        <span className="era-years">{era.years}</span>
                        <span className="era-code">{era.color.code} · {era.color.name}</span>
                      </div>
                      <div className="era-focus">{era.focus}</div>
                      <p className="era-interest">{era.interest}</p>

                      {era.roles.length > 0 && (
                          <div className="era-roles">
                            {era.roles.map((r) => (
                                <Link key={r.label} href={r.link} className="era-role">
                                  {r.label}<ArrowRight />
                                </Link>
                            ))}
                          </div>
                      )}

                      {era.milestones.length > 0 && (
                          <div className="era-milestones">
                            <span className="era-milestones-label">Milestone{era.milestones.length > 1 ? "s" : ""}</span>
                            <span className="era-milestone-chips">
                              {era.milestones.map((slug) => {
                                const p = PROJECTS.find((pr) => pr.slug === slug);
                                if (!p) return null;
                                return (
                                    <Link key={slug} href={`/projects/${p.slug}`} className="milestone-chip">
                                      <span className="milestone-dot" style={{ background: p.color.hex }} />
                                      {p.name}
                                    </Link>
                                );
                              })}
                            </span>
                          </div>
                      )}
                    </div>
                  </div>
              );
            })}
          </div>

          {/* Education, kept as clickable chips into the coursework modals */}
          <div className="edu-band">
            <div className="edu-band-label">Education</div>
            <div className="edu-band-grid">
              {EDU_TRACKS.map((t) => (
                  <button key={t.key} className="edu-band-card" onClick={() => setEduModal(t.key)}>
                    <span className="edu-band-swatch" style={{ background: t.color }} />
                    <span className="edu-band-text">
                      <span className="edu-band-degree">{t.degree}</span>
                      <span className="edu-band-sub">{t.sub}</span>
                    </span>
                    <span className="edu-band-gpa">
                      {t.gpa}<span className="edu-band-gpa-label">GPA</span>
                    </span>
                    <span className="edu-band-arrow"><ArrowUpRight /></span>
                  </button>
              ))}
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
            {/* Live color chip, driven by name hash */}
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
                  ✓ COLOR MIXED, I&apos;ll be in touch soon.
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
                            company: honeypot,              // honeypot, must stay empty
                            renderedAt: formRenderedAt.current ?? Date.now(), // bot-timing guard
                          }),
                        });
                      } catch {}
                      setSubmitted(true);
                    }}
                >
                  {/* Honeypot, hidden from humans, irresistible to bots. */}
                  <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                    <label>
                      Company (leave blank)
                      <input
                          type="text"
                          name="company"
                          tabIndex={-1}
                          autoComplete="off"
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Your Name</label>
                    <input
                        name="name"
                        className="form-input"
                        placeholder="Jane Smith"
                        value={formData.name}
                        onChange={handleInput}
                        maxLength={100}
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
                        maxLength={254}
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
                        maxLength={4000}
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