// ─── Currently Mixing — active work-in-progress ─────────────────────
// The projects I'm actively building right now, kept deliberately small
// and near the top of the homepage. Each one is a color still "wet on the
// palette": a two-tone mix that hasn't fully set yet.
//
// To surface a project here:
//   1. Add an entry to CURRENTLY_MIXING below (newest / most active first).
//   2. `mix.from` → `mix.to` is the gradient painted into the swatch; pick two
//      hexes that read well together. `code` / `colorName` are the Pantone-style
//      label under it.
//   3. `link` is optional — point it at a /projects/<slug> page (or leave it out
//      for something without its own page yet).

export type CurrentProject = {
    slug: string;            // stable React key / anchor
    name: string;
    blurb: string;           // one line on what it is
    /** The two colors blended in the swatch — the work is still "being mixed". */
    mix: { from: string; to: string };
    code: string;            // Pantone-style code, e.g. "18-4051 TCX"
    colorName: string;       // Pantone-style name, e.g. "Strong Blue"
    stage: string;           // short status, e.g. "Shipping" · "Prototyping" · "Researching"
    tech: string[];
    started: string;         // human period, e.g. "Jun 2026 – Present"
    link?: string;           // optional detail link, e.g. "/projects/strava-recommender"
    draft?: boolean;         // set true to keep an entry off the public list
};

// Newest / most active first. These are the real "– Present" projects.
export const CURRENTLY_MIXING: CurrentProject[] = [
    {
        slug: "product-reranker",
        name: "Product Re-ranker",
        blurb: "The product-level half of The Feed's recommender — ranking candidate products per user.",
        mix: { from: "#5A4E8C", to: "#8E7BD6" },
        code: "18-3838 TCX",
        colorName: "Deep Wisteria",
        stage: "Shipping",
        tech: ["Python", "LightGBM", "FastAPI", "ClickHouse"],
        started: "Jul 2026 – Present",
        link: "/projects/product-reranker",
    },
    {
        slug: "strava-recommender",
        name: "Strava Recommender",
        blurb: "The Feed's production recommender for cold-start and returning users alike.",
        mix: { from: "#1E63C4", to: "#37B6E8" },
        code: "18-4051 TCX",
        colorName: "Strong Blue",
        stage: "Shipping",
        tech: ["Python", "LightGBM", "FastAPI", "Railway"],
        started: "Jun 2026 – Present",
        link: "/projects/strava-recommender",
    },
    {
        slug: "llm-sentiment-analysis",
        name: "LLM Sentiment Analysis",
        blurb: "Measuring political sentiment across large text corpora with embeddings, on HiPerGator.",
        mix: { from: "#F2A81D", to: "#E5442E" },
        code: "15-1058 TCX",
        colorName: "Marigold",
        stage: "Researching",
        tech: ["Python", "Scikit-Learn", "TensorFlow", "HiPerGator"],
        started: "Dec 2025 – Present",
        link: "/projects/llm-sentiment-analysis",
    },
];

export const PUBLISHED_CURRENTLY: CurrentProject[] = CURRENTLY_MIXING.filter(
    (c) => !c.draft,
);
