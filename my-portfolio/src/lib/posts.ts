// ─── Beyond the Colors — writing / opinion pieces ───────────────────
// Pieces are normally LaTeX-exported PDFs.
//
// To publish one:
//   1. Drop the PDF in `public/writing/`  (e.g. public/writing/my-essay.pdf)
//   2. Add an entry to POSTS below with `pdf: "/writing/my-essay.pdf"`.
// The card on the homepage opens that PDF. Newest-first ordering is by `date`.

export type Post = {
    slug: string;            // used only as a stable React key / anchor
    title: string;
    kicker: string;          // short category, e.g. "Opinion" · "Essay" · "Field Notes"
    date: string;            // ISO yyyy-mm-dd
    excerpt: string;
    color: { hex: string; code: string; name: string };
    pdf: string;             // path under /public, e.g. "/writing/my-essay.pdf"
    pages?: number;
    draft?: boolean;         // set true to keep a piece out of the public list
};

// Intentionally empty — pieces get added here as they're written.
export const POSTS: Post[] = [];

export const PUBLISHED_POSTS: Post[] = POSTS
    .filter((p) => !p.draft)
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));

export function formatPostDate(iso: string): string {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
