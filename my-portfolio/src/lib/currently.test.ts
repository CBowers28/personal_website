import { describe, it, expect } from "vitest";
import { CURRENTLY_MIXING, PUBLISHED_CURRENTLY } from "./currently";

describe("CURRENTLY_MIXING", () => {
    it("has unique slugs", () => {
        const slugs = CURRENTLY_MIXING.map((c) => c.slug);
        expect(new Set(slugs).size).toBe(slugs.length);
    });

    it("gives every entry a two-tone mix and a Pantone-style label", () => {
        for (const c of CURRENTLY_MIXING) {
            expect(c.mix.from).toMatch(/^#[0-9A-Fa-f]{6}$/);
            expect(c.mix.to).toMatch(/^#[0-9A-Fa-f]{6}$/);
            expect(c.code.trim().length).toBeGreaterThan(0);
            expect(c.colorName.trim().length).toBeGreaterThan(0);
        }
    });

    it("uses absolute internal links when a link is present", () => {
        for (const c of CURRENTLY_MIXING) {
            if (c.link) expect(c.link.startsWith("/")).toBe(true);
        }
    });
});

describe("PUBLISHED_CURRENTLY", () => {
    it("never exposes a draft", () => {
        expect(PUBLISHED_CURRENTLY.every((c) => !c.draft)).toBe(true);
    });

    it("only contains entries that exist in CURRENTLY_MIXING", () => {
        const slugs = new Set(CURRENTLY_MIXING.map((c) => c.slug));
        expect(PUBLISHED_CURRENTLY.every((c) => slugs.has(c.slug))).toBe(true);
    });
});
