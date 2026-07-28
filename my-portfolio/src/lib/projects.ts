export type CollectionSlug =
    | "the-feed-ops"
    | "ml-systems"
    | "hci-research"
    | "finance-markets"
    | "systems-coursework";

export type Project = {
    slug: string;
    name: string;
    tag: "Research" | "Publication" | "Project" | "Operations";
    color: { hex: string; code: string; name: string };
    desc: string;
    github: string;
    showGithub?: boolean;
    showInGrid?: boolean;
    /** One of the three vivid "staple" projects surfaced above the collections. */
    hero?: boolean;
    /** Themed collection this project is filed under (muted palette). */
    collection?: CollectionSlug;
    fullDescription: string;
    highlights: string[];
    tech: string[];
    period: string;
    org: string;
    pdf?: string;
};

const PANTONE = [
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
    { hex: "#5B6EAE", code: "18-3845 TCX", name: "Blue Iris" },
    { hex: "#3D7A6E", code: "17-5126 TCX", name: "Teal Green" },
];

// ─── Collections ────────────────────────────────────────────────────
// Muted / desaturated palette, deliberately quieter than the vivid hero
// staples so the eye reads the staples first and the collections as archive.
export type Collection = {
    slug: CollectionSlug;
    name: string;
    kicker: string;
    blurb: string;
    /** Longer, first-person narrative about the genre, the org, my role, my interests. */
    longIntro: string;
    /** Representative accent, legible on white; used for the spine, borders, kicker text. */
    color: { hex: string; code: string; name: string };
    /** The collection's palette theme: a name, a mood label, and the swatch set it's built from. */
    palette: { name: string; mood: string; colors: string[] };
};

// Each collection is its own named Pantone-style palette with a distinct mood,
// earthy, vibrant primaries, pastels, jewel tones, cool blueprint, so every
// collection reads as a different swatch set, all separate from the bright
// 2026 Colors of the Year up top.
export const COLLECTIONS: Collection[] = [
    {
        slug: "the-feed-ops",
        name: "The Feed · Operations",
        kicker: "Fulfillment & Forecasting",
        blurb: "The reporting, forecasting, and fulfillment software behind The Feed's growth.",
        longIntro:
            "The Feed builds, warehouses, and ships fuel for endurance athletes, and it's growing fast. I work on the operations software that lets it scale, the reporting leadership trusts, the forecasts purchasing orders against, and the fulfillment logic that keeps orders on time. I like this kind of software because the result is physical: boxes out the door, hours saved, a shelf that doesn't run empty.",
        color: { hex: "#A75F38", code: "18-1248 TCX", name: "Adobe" },
        palette: { name: "Earth & Harvest", mood: "Earthy Neutrals", colors: ["#A75F38", "#C08457", "#7C7A45", "#D9C3A0", "#5E4632"] },
    },
    {
        slug: "ml-systems",
        name: "ML & Recommender Systems",
        kicker: "Models in Production",
        blurb: "Recommendation and ranking engines, LLM pipelines, and the apps that run on them.",
        longIntro:
            "This is where models leave the notebook and have to survive contact with real users. I build recommendation and ranking systems that actually run in production: trained, backtested behind a quality gate, and served over HTTP. Plus the LLM pipelines around them. Most of the work isn't the model; it's making it reliable, reproducible, and fast enough that a product can lean on it. I don't call myself an 'AI engineer', I just want to understand these things well enough to build with them.",
        color: { hex: "#2049C7", code: "19-4053 TCX", name: "Electric Blue" },
        palette: { name: "Primary Signal", mood: "Vibrant Primaries", colors: ["#E4342B", "#2049C7", "#F5C518", "#12A150"] },
    },
    {
        slug: "hci-research",
        name: "HCI Research",
        kicker: "Ruiz HCI Lab · UF",
        blurb: "Studies on gaze, AR, and human–AI interaction, the software and the analysis behind them.",
        longIntro:
            "In the Ruiz HCI Lab at UF I build the software behind human-subjects research, eye-tracking, augmented reality, and how people trust and use AI. That runs from real-time gaze pipelines to full study apps with IRB-compliant data collection, and into the analysis afterward. I like research questions you can only really answer by building the thing a person then sits down and uses.",
        color: { hex: "#9B86C4", code: "16-3823 TCX", name: "Lavender Violet" },
        palette: { name: "Soft Study", mood: "Pastels", colors: ["#C9B6E4", "#B7E0CE", "#B4D2E8", "#EBC4CE", "#F0E4B0"] },
    },
    {
        slug: "finance-markets",
        name: "Finance & Markets",
        kicker: "Risk & Automation",
        blurb: "Risk infrastructure for a trading fund and automation for a high-net-worth desk.",
        longIntro:
            "I started out in finance, the idea of decisions driven purely by compute struck me as genuinely interesting. That turned into risk infrastructure for a student-run trading fund and automation for high-net-worth portfolio operations at Morgan Stanley. Same instinct as the rest of my work: build the guardrails and automate the busywork so people can move faster without breaking things.",
        color: { hex: "#1C5D4A", code: "18-5620 TCX", name: "Emerald Vault" },
        palette: { name: "The Vault", mood: "Jewel Tones", colors: ["#1C5D4A", "#C79A3B", "#6E2B2B", "#1E3A5F", "#4A2C4E"] },
    },
    {
        slug: "systems-coursework",
        name: "Systems & Coursework",
        kicker: "Protocols & Builds",
        blurb: "Lower-level builds, a networking protocol from scratch, and this site.",
        longIntro:
            "The lower-level things I build mostly to understand how they actually work, a BitTorrent-style protocol written straight from raw sockets, and the site you're reading right now. Less about impact numbers here, more about craft and getting down to first principles.",
        color: { hex: "#47607A", code: "18-4028 TCX", name: "Slate Blueprint" },
        palette: { name: "Blueprint", mood: "Cool Graphite", colors: ["#23262A", "#3A3F45", "#47607A", "#6B7A87", "#B8C0C6"] },
    },
];

export const COLLECTION_BY_SLUG: Record<CollectionSlug, Collection> = COLLECTIONS.reduce(
    (acc, c) => ({ ...acc, [c.slug]: c }),
    {} as Record<CollectionSlug, Collection>,
);

export const PROJECTS: Project[] = [
    // ─── HERO STAPLES ────────────────────────────────────────────────
    {
        slug: "feed-warehouse-expansion",
        showGithub: false,
        hero: true,
        collection: "the-feed-ops",
        name: "Warehouse Capacity Expansion",
        tag: "Operations",
        color: { hex: "#E5442E", code: "18-1550 TCX", name: "Molten Lava" },
        desc: "Helped double our warehouse capacity and cut fulfillment times by 30%",
        github: "",
        period: "May 2026 – Present",
        org: "The Feed",
        fullDescription:
            "I worked on a warehouse expansion at The Feed that doubled how much we could physically ship and cut order fulfillment times by 30%. My part touched a few areas: CAD layout planning, wiring in the new automation (Brightpick and CMC), and changing the fulfillment software so it could actually use the extra capacity instead of leaving it idle. What I liked about this one is that the win was physical, you could watch orders leave faster.",
        highlights: [
            "Supported a +100% expansion in warehouse fulfillment capacity, enabling regional growth without sacrificing SLA",
            "Reduced average order fulfillment time by 30% through workflow re-design and software changes downstream of new automation hardware",
            "Coordinated with operations engineers on CAD layouts and integration with Brightpick robotics and CMC packaging automation",
            "Validated throughput gains against the new metrics reporting system to confirm sustained post-launch performance",
        ],
        tech: ["CAD", "Brightpick", "CMC", "Python", "SQL", "Ruby on Rails"],
    },
    {
        slug: "nasa-eye-tracking",
        collection: "hci-research",
        name: "NASA Eye-Tracking",
        tag: "Research",
        color: PANTONE[2],
        desc: "Eye-tracking software to catch fighter-pilot fatigue, for a NASA study",
        github: "https://github.com/CBowers28/Senior_Project",
        showGithub: true,
        period: "Oct 2024 – Present",
        org: "Ruiz HCI Lab · University of Florida",
        fullDescription:
            "I wrote the eye-tracking software for a NASA-funded study on how fighter pilots get fatigued during high-stress flight simulations. It pairs a Pupil Labs Core headset with ArUco marker detection to work out exactly where a pilot is looking on a physical cockpit display, in real time, so we can tell when their attention starts to slip. Getting gaze to map cleanly onto real hardware was the part I found genuinely interesting.",
        highlights: [
            "Built a real-time gaze mapping pipeline using OpenCV and ArUco markers to correlate eye position with specific cockpit instrument panels",
            "Integrated Pupil Labs Core hardware via ZMQ for low-latency gaze data streaming",
            "Implemented fatigue classification heuristics based on blink rate, fixation duration, and saccade velocity",
            "Developed a data collection pipeline compliant with university RISK/IRB protocols for human subject research",
        ],
        tech: ["Python", "OpenCV", "ArUco", "Pupil Labs", "ZMQ", "NumPy", "CUDA"],
    },
    {
        slug: "llm-finetuning",
        collection: "ml-systems",
        name: "LLM Fine-Tuning",
        tag: "Project",
        color: PANTONE[12],
        desc: "Fine-tuned Mistral-7B into a tutor for my LLMs course with LoRA/QLoRA",
        github: "https://github.com/CBowers28/CIS6930-Final-Project",
        showGithub: true,
        period: "Fall 2025",
        org: "CIS6930 · University of Florida",
        fullDescription:
            "For my graduate LLMs course (CIS6930) I helped turn Mistral-7B-Instruct into a tutor that actually knows the class material. I led the data side, blending UltraChat 200k, Infinity-Instruct, and Symbolic IT into one clean corpus, then built the training pipeline with LoRA/QLoRA so the whole thing fit on a single L4 GPU on UF's HiPerGator. After a general instruction pass and a second pass on the lecture slides, it scored about 10% higher token-level F1 than the base model and reached low perplexity on the course content. I mostly took this on because I wanted to understand how these models actually learn, by pulling one apart and retraining it myself.",
        highlights: [
            "Led dataset integration combining UltraChat 200k, Infinity-Instruct, and Symbolic IT into a unified JSONL corpus with format standardization and deduplication",
            "Implemented core training pipelines using Hugging Face Transformers, PEFT, and TRL with LoRA rank r=64 across all attention and MLP projection layers",
            "Achieved ~10% relative improvement in mean token-level F1 (0.31 → 0.34) on a 400-example held-out instruction set",
            "Performed two-stage fine-tuning: general instruction tuning followed by CIS6930 lecture slide specialization, achieving perplexity of 4–8 on course material",
            "Trained on a single NVIDIA L4 GPU via UF's HiPerGator cluster using 4-bit NF4 quantization to fit within 24 GB VRAM",
        ],
        tech: ["Python", "PyTorch", "Hugging Face Transformers", "PEFT", "LoRA/QLoRA", "TRL", "BitsAndBytes", "Mistral-7B", "HiPerGator"],
    },

    // ─── THE FEED · OPERATIONS ───────────────────────────────────────
    {
        slug: "feed-metrics-reporting",
        showGithub: false,
        collection: "the-feed-ops",
        name: "Business Metrics Reporting System",
        tag: "Operations",
        color: { hex: "#2A6E3F", code: "18-6320 TCX", name: "Jolly Green" },
        desc: "The reporting leadership used to green-light East Coast expansion",
        github: "",
        period: "May 2026 – Present",
        org: "The Feed",
        fullDescription:
            "I built The Feed's company-wide metrics reporting system, the thing that finally gave leadership one honest view of operations instead of a pile of separate spreadsheets. It pulls the KPIs that were scattered across fulfillment, inventory, and demand (throughput, fill rate, regional demand, inventory turnover) into a single source of truth in Python and SQL. Those numbers are what leadership actually used to decide the East Coast expansion was a go, and it's now the data the weekly leadership reviews run on.",
        highlights: [
            "Standardized cross-functional KPIs (order throughput, fill rate, regional demand, inventory turnover) into a unified reporting layer built on Python and SQL",
            "Built leadership-facing dashboards that informed the go/no-go for East Coast warehouse expansion",
            "Partnered with operations, fulfillment, and engineering to align metric definitions across teams previously using ad-hoc spreadsheets",
            "Reporting layer is now the canonical operational data source used in weekly leadership reviews",
        ],
        tech: ["Python", "SQL", "PostgreSQL", "Ruby on Rails", "Pandas"],
    },
    {
        slug: "feed-ai-forecasting",
        showGithub: false,
        collection: "the-feed-ops",
        name: "AI Demand & Inventory Forecasting",
        tag: "Operations",
        color: { hex: "#1A6B7A", code: "18-4528 TCX", name: "Mosaic Blue" },
        desc: "A forecasting pipeline that predicts demand and closes inventory gaps",
        github: "",
        period: "May 2026 – Present",
        org: "The Feed",
        fullDescription:
            "I deployed a forecasting pipeline at The Feed that predicts stock and demand across every SKU. It reads historical orders, current on-hand inventory, and regional demand, and hands the operations and purchasing teams a forecast they can actually order against, so reorders reflect where demand is heading instead of a trailing average. Surfacing forecast-vs-actual right inside the reporting layer is what pulled the inventory discrepancies down.",
        highlights: [
            "Productionized a Python + SQL forecasting pipeline predicting demand and stock levels across the full SKU catalog",
            "Reduced inventory discrepancies by surfacing forecast vs actual deltas directly inside the new metrics reporting layer",
            "Integrated forecasts into purchasing workflows so reorder decisions reflect projected demand rather than trailing averages",
            "Coordinated with data, ops, and engineering to define accuracy targets and monitoring on forecast drift",
        ],
        tech: ["Python", "SQL", "Pandas", "Scikit-Learn", "PostgreSQL"],
    },
    {
        slug: "fuel-planner",
        showGithub: false,
        collection: "the-feed-ops",
        name: "Fuel Planner",
        tag: "Project",
        color: { hex: "#C24E3A", code: "17-1449 TCX", name: "Tigerlily" },
        desc: "A React app that turns your workout into an hourly fueling plan",
        github: "",
        period: "2026",
        org: "The Feed",
        fullDescription:
            "Fuel Planner is a small React app I built for The Feed that takes an athlete's session, sport, intensity, duration, body weight, conditions, and gives back a real fueling plan: per-hour carb, fluid, and sodium targets, an hour-by-hour breakdown, and a shopping list based on the fuel formats they actually use. It runs entirely in the browser with no backend, and it's meant to sit on top of the recommender and re-ranker as the part an athlete actually touches.",
        highlights: [
            "Built a fully client-side React 18 + Vite application requiring no backend, all fueling math runs in the browser",
            "Translated sport, intensity, duration, weight, and environmental conditions into evidence-based per-hour carb / fluid / sodium targets",
            "Generated an hour-by-hour fueling breakdown plus a format-aware shopping list (gels, drink mix, chews) from the athlete's stated preferences",
            "Designed to sit downstream of the Strava recommender and product re-ranker as the athlete-facing surface of the personalization stack",
        ],
        tech: ["React 18", "Vite", "TypeScript", "CSS", "Vercel"],
    },
    {
        slug: "late-order-detection",
        showGithub: false,
        collection: "the-feed-ops",
        name: "Late-Order Detection",
        tag: "Operations",
        color: { hex: "#A8571E", code: "18-1154 TCX", name: "Rust Orange" },
        desc: "Flags late shipments against the promised date, what 'late' actually means",
        github: "",
        period: "2026",
        org: "The Feed",
        fullDescription:
            "This flags orders running late against their promised delivery date, which is the only date 'late' really means. I first tried a model on transit-time percentiles, but p95-of-transit barely correlated with promise-date lateness, about 5.8% precision, so I threw it out and measured against the promise directly instead. It works in two tiers: one for orders already past their promise and not delivered, and one for packages so overdue they're probably lost and need a human. Sometimes the simpler, non-ML answer is just the right one.",
        highlights: [
            "Replaced a low-precision transit-percentile model with a deterministic promise-date comparison, lifting precision to ~100% on the factual tier",
            "Defined two tiers, PAST_PROMISE (promise date passed, not yet delivered) and SEVERELY_OVERDUE (likely lost, warrants support escalation)",
            "Validated the lost-package tier against live data: of 882 packages 5+ days overdue, zero had a hidden delivered event, confirming status does not lag",
            "Added a stale-record guard so abandoned in-transit rows dating back years don't pollute the live flagged set",
        ],
        tech: ["Python", "SQL", "PostgreSQL", "ClickHouse", "Pandas"],
    },

    // ─── ML & RECOMMENDER SYSTEMS ────────────────────────────────────
    {
        slug: "strava-recommender",
        showGithub: false,
        hero: true,
        collection: "ml-systems",
        name: "Strava Recommender",
        tag: "Project",
        color: { hex: "#1E63C4", code: "18-4051 TCX", name: "Strong Blue" },
        desc: "The Feed's production recommender for cold-start and returning users alike",
        github: "",
        period: "Jun 2026 – Present",
        org: "The Feed",
        fullDescription:
            "I built and shipped the recommendation service The Feed runs in production. It looks at what we know about a user: their Strava training profile, stated preferences, and past orders if they have them. From that it returns a ranked list of product categories and brands. It covers the whole user base: brand-new Strava-only users, which is the hard cold-start case, and returning customers where I can lean on their history. The storefront, onboarding, and email all call it over HTTP.",
        highlights: [
            "Trained a LightGBM LambdaRank model over user × category and user × brand pairs, with fully decoupled training and serving that communicate only through a versioned model bundle",
            "Solved cold-start by ranking on Strava sport/geo and stated-preference features, then blending in recency-weighted purchase-history (RFM + category/brand affinity) once a customer has orders",
            "Deployed as a containerized FastAPI service on Railway with a mounted model volume, a weekly retrain cron, a backtest quality gate, and ~60s hot-reload of new bundles with zero downtime",
            "Achieved Hit@5 ≈ 0.88 on the production backtest, with per-request latency of ~40–80ms after warmup",
            "Fetches optional live purchase history from the ClickHouse CDP at request time, degrading gracefully to cold-start on any data-source error",
        ],
        tech: ["Python", "LightGBM", "FastAPI", "Scikit-Learn", "ClickHouse", "PostgreSQL", "Docker", "Railway"],
    },
    {
        slug: "product-reranker",
        showGithub: false,
        collection: "ml-systems",
        name: "Product Re-ranker",
        tag: "Project",
        color: { hex: "#5A4E8C", code: "18-3838 TCX", name: "Deep Wisteria" },
        desc: "Ranks a given product list for a user, the second half of the recommender",
        github: "",
        period: "Jul 2026 – Present",
        org: "The Feed",
        fullDescription:
            "This is the product-level half of the recommender. Give it a set of candidate products and it returns the top ones in order, scored for a specific user from their Strava profile, stated preferences, and, the strongest signal by far, what they actually rebuy. The category/brand recommender answers 'what should this person see'; this answers 'given these products, which ones, in what order,' so the two chain together. The piece I'm proudest of is a leakage-safe repurchase signal that was worth about 13 points of hit@1 in backtest.",
        highlights: [
            "Trained a LightGBM LambdaRank re-ranker over user × product pairs, mirroring the recommender's structure as a separate, independently deployed service",
            "Engineered a leakage-safe two-window repurchase feature (feature window strictly before the label window) worth +12.7pts Hit@1 in backtest",
            "Composed with the category/brand recommender into a two-stage pipeline: stage one picks the category/brand, stage two fills it with ranked products",
            "Reused the recommender's operational backbone, ClickHouse-backed history features, backtest quality gate, and ~60s bundle hot-reload, for a consistent deployment story",
        ],
        tech: ["Python", "LightGBM", "FastAPI", "ClickHouse", "Docker", "Railway"],
    },
    {
        slug: "llm-sentiment-analysis",
        hero: true,
        collection: "ml-systems",
        name: "LLM Sentiment Analysis",
        tag: "Research",
        color: { hex: "#F2A81D", code: "15-1058 TCX", name: "Marigold" },
        desc: "Measuring political sentiment in large text with embeddings, on HiPerGator",
        github: "",
        showGithub: false,
        period: "Dec 2025 – Present",
        org: "Digital Markets Initiative · University of Florida",
        fullDescription:
            "I built an LLM pipeline to measure political sentiment across large text corpora, part of the Digital Markets Initiative's work on the economic and political footprint of foundation models. It runs on UF's HiPerGator supercomputer, generates sentence embeddings, and uses cosine similarity to cluster and classify sentiment at a scale you couldn't do by hand. I was less interested in the noise around LLMs than in what they actually let you measure once you point them at real text.",
        highlights: [
            "Built an LLM inference pipeline using API calls to UF's HiPerGator supercomputer for large-scale text processing",
            "Implemented cosine similarity analysis on sentence embeddings to cluster and classify political sentiment",
            "Applied Scikit-Learn, NumPy, and TensorFlow for model training and embedding generation",
            "Research contributing to ongoing work on the economic impact of foundational AI models",
        ],
        tech: ["Python", "Scikit-Learn", "NumPy", "TensorFlow", "Keras", "Pandas", "HiPerGator"],
    },

    // ─── HCI RESEARCH ────────────────────────────────────────────────
    {
        slug: "self-gaze-ar",
        collection: "hci-research",
        name: "Self-Gaze in AR",
        tag: "Publication",
        color: PANTONE[3],
        desc: "IEEE paper: does seeing your own gaze help when collaborating in AR?",
        github: "",
        showGithub: false,
        pdf: "/papers/self-gaze-ar.pdf",
        period: "Oct 2024 – Present",
        org: "Ruiz HCI Lab · University of Florida",
        fullDescription:
            "This is an IEEE paper I co-authored around a fairly specific question: when two people work together in augmented reality, does showing someone their own gaze, on top of their partner's, actually help? We built a collocated sorting task in Unity for pairs of HoloLens 2 users and compared showing just the partner's gaze against showing both. I built the task and ran it as a proper user study under IRB approval. The short answer is that self-gaze isn't always needed, but it made people more confident in some collocated settings.",
        highlights: [
            "Designed and developed a collocated AR collaborative sorting task using HoloLens 2 and Unity",
            "Implemented both uni- and bi-directional shared-gaze visualization modes for within-subjects comparison",
            "Conducted a user study with human participants under IRB-approved protocols",
            "Results suggest self-gaze is not always necessary but improves task confidence in certain collocated settings",
        ],
        tech: ["Unity", "C#", "HoloLens 2", "Microsoft AR Toolkit", "Python", "R", "LaTeX"],
    },
    {
        slug: "companion-agent-study",
        collection: "hci-research",
        name: "Companion Agent Study",
        tag: "Publication",
        color: PANTONE[9],
        desc: "How much an AI companion 'opens up' changes how people trust it",
        github: "",
        showGithub: false,
        pdf: "/papers/companion-agent.pdf",
        period: "Oct 2024 – Present",
        org: "Ruiz HCI Lab · University of Florida",
        fullDescription:
            "A paper I co-authored on how much an AI companion agent should disclose about itself, and what that does to how people perceive, trust, and engage with it. I built the full-stack web app that ran the study and logged the interactions, on a data pipeline that met the university's research protocol; then we measured perception across a few disclosure levels with validated surveys and analyzed the results in R. It turns out how much an agent 'opens up' really does move trust and likability.",
        highlights: [
            "Built a full-stack web application for deploying and logging structured user interactions with AI companion agents",
            "Designed a secure data pipeline and server compliant with university RISK protocol",
            "Measured user perception across multiple self-disclosure conditions using validated survey instruments",
            "Analyzed results using statistical methods in R to identify significant disclosure-level effects on trust and likability",
        ],
        tech: ["Python", "React", "TypeScript", "Flask", "R", "LaTeX", "PostgreSQL"],
    },
    {
        slug: "genai-student-perception",
        collection: "hci-research",
        name: "GenAI Student Perception",
        tag: "Research",
        color: PANTONE[11],
        desc: "How university students actually perceive and use generative AI",
        github: "",
        showGithub: false,
        period: "Oct 2024 – Present",
        org: "Ruiz HCI Lab · University of Florida",
        fullDescription:
            "Ongoing research on how university students actually perceive and use generative AI in their coursework, where they trust it, where they lean on it too much, and where the ethical lines start to feel real to them. I built and deployed the full-stack web app that runs the studies, with an IRB-compliant pipeline for collecting the data, and we're analyzing it across trust, usefulness, and concern. I care about this one partly because I'm one of those students too.",
        highlights: [
            "Designed and deployed a full-stack web application for structured user interactions with generative AI systems",
            "Developed secure data collection pipeline compliant with IRB human subjects protocol",
            "Analyzing results across dimensions of trust, perceived usefulness, and ethical concern",
            "Contributing to a growing body of HCI research on human-AI interaction in educational contexts",
        ],
        tech: ["Python", "React", "TypeScript", "Flask", "R", "LaTeX"],
    },

    // ─── FINANCE & MARKETS ───────────────────────────────────────────
    {
        slug: "algogators-risk-framework",
        showGithub: false,
        collection: "finance-markets",
        name: "AlgoGators Risk Framework",
        tag: "Operations",
        color: PANTONE[1],
        desc: "Risk guardrails, stop-losses and alerts, for a student trading fund",
        github: "",
        period: "Jan 2024 – Oct 2024",
        org: "AlgoGators Investment Fund · University of Florida",
        fullDescription:
            "I led the risk framework for AlgoGators, UF's student-run algorithmic trading fund. I got into finance in the first place because the idea of decisions driven purely by compute struck me as interesting, and this was that idea in practice: stop-loss thresholds and drawdown limits in pandas and NumPy that let the fund react to a bad market in real time instead of after the fact. I also led five analysts and put code review and testing in place, so we shipped fewer broken changes into the live system.",
        highlights: [
            "Designed and implemented stop-loss thresholds and drawdown limits using pandas and NumPy to protect fund capital",
            "Built automated performance alert systems that notified the team of risk events via threshold-based triggers",
            "Led a team of five analysts, reviewing and validating software before system integration",
            "Reduced integration defects and accelerated deployment by introducing code review and testing workflows",
        ],
        tech: ["Python", "pandas", "NumPy", "Matplotlib", "Git", "SQL", "R", "C++"],
    },
    {
        slug: "morgan-stanley-automation",
        showGithub: false,
        collection: "finance-markets",
        name: "Morgan Stanley Automation",
        tag: "Operations",
        color: PANTONE[4],
        desc: "Automated client outreach for a $750M+ desk, over twice as fast",
        github: "",
        period: "May 2024 – Aug 2024",
        org: "Morgan Stanley",
        fullDescription:
            "I supported portfolio operations for high-net-worth clients, around $750M+ in assets, and spent most of my time automating the tedious parts. I built Python and Excel tooling that took the manual work out of prepping client data and reporting, and automated the segmented outreach so it ran more than twice as fast. I also used the desk's internal C++ software to churn through quarterly and annual reviews, which cut that manual work roughly in half.",
        highlights: [
            "Automated segmented client outreach workflows, improving communication efficiency by over 200%",
            "Built Python scripts and Excel automation to streamline data preparation for portfolio reporting",
            "Leveraged proprietary C++ software to process quarterly and annual client performance reviews, cutting manual processing time by 50%",
            "Supported reporting for high-net-worth clients managing $750M+ in combined assets",
        ],
        tech: ["Python", "C++", "Excel", "LaTeX", "Proprietary Internal Tools"],
    },
    {
        slug: "client-review-system",
        showGithub: false,
        collection: "finance-markets",
        name: "Client Review System",
        tag: "Operations",
        color: { hex: "#D2362B", code: "18-1662 TCX", name: "Flame Scarlet" },
        desc: "A C++ pipeline that generated Morgan Stanley's quarterly & annual client reviews",
        github: "",
        period: "May 2024 – Aug 2024",
        org: "Morgan Stanley",
        fullDescription:
            "At Morgan Stanley I built a system on the desk's internal C++ software that generated the quarterly and annual performance reviews for high-net-worth clients. It automated the data pulling and formatting people were doing by hand, which cut the processing time about in half and left less room for mistakes on client-facing reports. It plugged into the existing portfolio infrastructure behind roughly $750M+ in assets.",
        highlights: [
            "Leveraged proprietary C++ software to build an automated pipeline for quarterly and annual client performance reviews",
            "Reduced manual report processing time by 50% through automation of data extraction and formatting",
            "Integrated with existing portfolio management infrastructure supporting $750M+ in assets",
            "Ensured accuracy and compliance across all client-facing deliverables for high-net-worth accounts",
        ],
        tech: ["C++", "Python", "Proprietary Internal Tools", "Excel", "LaTeX"],
    },

    // ─── SYSTEMS & COURSEWORK ────────────────────────────────────────
    {
        slug: "p2p-file-sharing",
        collection: "systems-coursework",
        name: "P2P File Sharing",
        tag: "Project",
        color: PANTONE[13],
        desc: "A BitTorrent-style P2P file-sharing protocol, written from scratch in Python",
        github: "https://github.com/CBowers28/CNT5106C-Final-Project",
        showGithub: true,
        period: "Fall 2025",
        org: "CNT5106C · University of Florida",
        fullDescription:
            "For my computer networks course I wrote a full BitTorrent-style file-sharing system from scratch in Python, nothing doing the hard part for me. It implements the whole protocol over raw TCP: handshakes, bitfields to track who has which pieces, choke/unchoke scheduling, and optimistic unchoking so no peer starves. I tested it across a simulated six-node network and checked every peer's copy against the original with MD5. I took this one on because I wanted to actually understand how BitTorrent works, not just use it.",
        highlights: [
            "Implemented the full P2P message protocol (CHOKE, UNCHOKE, INTERESTED, HAVE, BITFIELD, REQUEST, PIECE) over raw TCP sockets with framed length-prefixed messages",
            "Built a bitfield module tracking per-peer piece ownership; broadcasts HAVE to all active connections on piece completion",
            "Designed a preferred-neighbor scheduler that ranks peers by download rate and unchokes the top-k neighbors on a configurable interval",
            "Implemented optimistic unchoking to give randomly selected choked-but-interested peers a chance to receive data, preventing starvation",
            "Validated correctness via MD5 hash verification across all 5 downloading peers against a 20 MB reference file",
        ],
        tech: ["Python", "TCP Sockets", "Threading", "Bitfield Protocol", "P2P Networking"],
    },
    {
        slug: "portfolio-website",
        collection: "systems-coursework",
        name: "Portfolio Website",
        tag: "Project",
        color: { hex: "#C9A84C", code: "16-0946 TCX", name: "Harvest Gold" },
        desc: "This site, a Pantone-themed portfolio in Next.js and TypeScript",
        github: "https://github.com/CBowers28",
        showGithub: true,
        period: "Feb 2026",
        org: "Personal Project",
        fullDescription:
            "This is the site you're on. I built it from scratch in Next.js and TypeScript around a Pantone swatch theme, the cycling hero chip, the colors-over-time timeline, the project collections, and a contact form that mixes a unique Pantone color out of whatever name you type. It's the one project here that's really just for the craft of it.",
        highlights: [
            "Designed a Pantone-inspired aesthetic with custom typography (Bebas Neue, Cormorant Garamond, Space Mono) and a cycling hero color chip that transitions through 12 vivid colors every 30 seconds",
            "Built a horizontal transit map timeline using percentage-based positioning so tracks scale fluidly to any screen width",
            "Implemented a hash-based color generation function that derives a unique HSL Pantone swatch and color name from any visitor's name in real time",
            "Created dynamic project and experience detail pages using Next.js 15 App Router with typed data from a shared projects.ts library",
            "Integrated a contact form with Nodemailer/Gmail SMTP that sends a styled HTML email including the visitor's generated Pantone color chip",
        ],
        tech: ["Next.js 15", "TypeScript", "React", "Tailwind CSS", "Nodemailer", "Vercel"],
    },
];

export type Experience = {
    slug: string;
    company: string;
    role: string;
    period: string;
    location: string;
    color: { hex: string; code: string; name: string };
    summary: string;
    bullets: string[];
    tech: string[];
    relatedProjects: string[];
};

export const EXPERIENCE: Experience[] = [
    {
        slug: "the-feed",
        company: "The Feed",
        role: "Software Engineering Intern",
        period: "May 2026 – Present",
        location: "Boulder, CO",
        color: { hex: "#2A6E3F", code: "18-6320 TCX", name: "Jolly Green" },
        summary:
            "I build operational software at The Feed, a fast-growing performance-nutrition company. Most of the work is about giving leadership the metrics, forecasts, and capacity to scale fulfillment into new East Coast regions, plus the recommendation stack the storefront runs on.",
        bullets: [
            "Created and standardized a company-wide business metrics reporting system that enabled a smoother East Coast expansion, giving leadership the operational visibility to scale fulfillment into new regions",
            "Assisted in expanding warehouse capacity by +100%, improving overall fulfillment throughput and reducing order fulfillment times by 30%",
            "Led deployment of an AI forecasting pipeline using Python and SQL to predict stock and demand levels, reducing inventory discrepancies",
            "Built a production LightGBM recommendation stack (category/brand recommender + product re-ranker) and the athlete-facing Fuel Planner that consumes it",
            "Worked across software, operations, and warehouse engineering, bridging Python/SQL/Rails systems with Brightpick and CMC automation",
        ],
        tech: ["Python", "Ruby on Rails", "SQL", "PostgreSQL", "LightGBM", "FastAPI", "CAD", "Brightpick", "CMC"],
        relatedProjects: ["feed-metrics-reporting", "feed-warehouse-expansion", "feed-ai-forecasting", "strava-recommender", "product-reranker", "fuel-planner", "late-order-detection"],
    },
    {
        slug: "morgan-stanley",
        company: "Morgan Stanley",
        role: "Software Engineering Intern",
        period: "May 2024 – Aug 2024",
        location: "Atlanta, GA",
        color: { hex: "#D2362B", code: "18-1662 TCX", name: "Flame Scarlet" },
        summary:
            "I supported portfolio operations for high-net-worth clients, around $750M+ in assets, and built the automation that took the manual work out of reporting and client outreach.",
        bullets: [
            "Automated segmented client outreach workflows, improving communication efficiency by over 200%",
            "Built Python scripts and Excel automation to streamline data preparation for portfolio reporting",
            "Leveraged proprietary C++ software to process quarterly and annual client performance reviews, cutting manual processing time by 50%",
            "Supported reporting for high-net-worth clients managing $750M+ in combined assets",
        ],
        tech: ["Python", "C++", "Excel", "LaTeX", "Proprietary Internal Tools"],
        relatedProjects: ["morgan-stanley-automation", "client-review-system"],
    },
    {
        slug: "algogators",
        company: "AlgoGators Investment Fund",
        role: "Lead Developer, Risk & Attribution",
        period: "Jan 2024 – Oct 2024",
        location: "Gainesville, FL",
        color: { hex: "#E8A820", code: "14-1064 TCX", name: "Saffron" },
        summary:
            "I led the risk framework for UF's student-run algorithmic trading fund, the stop-loss and alerting systems, and led a team of five analysts building it.",
        bullets: [
            "Designed stop-loss thresholds and drawdown limits using pandas and NumPy to protect fund capital",
            "Built automated performance alert systems that notified the team of risk events in real time",
            "Led a team of five analysts, reviewing and validating software before system integration",
            "Reduced integration defects and accelerated deployment by introducing code review workflows",
        ],
        tech: ["Python", "pandas", "NumPy", "Matplotlib", "Git", "SQL", "R", "C++"],
        relatedProjects: ["algogators-risk-framework"],
    },
    {
        slug: "ruiz-hci-lab",
        company: "Ruiz HCI Lab",
        role: "Undergraduate Researcher & Software Developer",
        period: "Oct 2024 – Present",
        location: "University of Florida",
        color: { hex: "#E07B39", code: "16-1359 TCX", name: "Orange Peel" },
        summary:
            "I do HCI research on eye-tracking, augmented reality, and how people perceive AI, and lead the software for several active studies, including a NASA-funded one on pilot fatigue.",
        bullets: [
            "Developed eye-tracking software for a NASA project using OpenCV and ArUco markers to detect fighter pilot fatigue",
            "Led research on student perceptions of AI, building a full-stack web application with a secure IRB-compliant data pipeline",
            "Co-authored IEEE paper on uni- vs bi-directional gaze visualization in collocated AR using HoloLens 2",
            "Co-authored paper on companion agent self-disclosure levels and user perception",
        ],
        tech: ["Python", "OpenCV", "Unity", "HoloLens 2", "React", "Flask", "R", "LaTeX", "Pupil Labs"],
        relatedProjects: ["nasa-eye-tracking", "self-gaze-ar", "companion-agent-study", "genai-student-perception"],
    },
    {
        slug: "digital-markets-initiative",
        company: "Digital Markets Initiative",
        role: "Undergraduate Researcher & Software Developer",
        period: "Dec 2025 – Present",
        location: "University of Florida",
        color: { hex: "#1A6B7A", code: "18-4528 TCX", name: "Mosaic Blue" },
        summary:
            "I research the economic and political footprint of foundation models, building LLM pipelines on UF's HiPerGator to measure political sentiment at scale.",
        bullets: [
            "Built an LLM inference pipeline using API calls to UF's HiPerGator supercomputer for large-scale text analysis",
            "Implemented cosine similarity on sentence embeddings to cluster and classify political sentiment",
            "Contributing to ongoing research on the economic impact of foundational AI models",
        ],
        tech: ["Python", "Scikit-Learn", "TensorFlow", "Keras", "NumPy", "Pandas", "HiPerGator"],
        relatedProjects: ["llm-sentiment-analysis"],
    },
];
