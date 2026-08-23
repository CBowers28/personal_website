import { describe, it, expect } from "vitest";
import {
    COLLECTIONS,
    COLLECTION_BY_SLUG,
    PROJECTS,
    EXPERIENCE,
} from "./projects";

const HEX = /^#[0-9a-fA-F]{3,8}$/;

describe("COLLECTIONS", () => {
    it("has unique slugs", () => {
        const slugs = COLLECTIONS.map((c) => c.slug);
        expect(new Set(slugs).size).toBe(slugs.length);
    });

    it("uses valid hex accent colors", () => {
        for (const c of COLLECTIONS) {
            expect(c.color.hex, `${c.slug} accent`).toMatch(HEX);
            for (const swatch of c.palette.colors) {
                expect(swatch, `${c.slug} palette`).toMatch(HEX);
            }
        }
    });
});

describe("COLLECTION_BY_SLUG", () => {
    it("maps every collection by its slug", () => {
        expect(Object.keys(COLLECTION_BY_SLUG).sort()).toEqual(
            COLLECTIONS.map((c) => c.slug).sort(),
        );
        for (const c of COLLECTIONS) {
            expect(COLLECTION_BY_SLUG[c.slug]).toBe(c);
        }
    });
});

describe("PROJECTS", () => {
    it("has unique slugs", () => {
        const slugs = PROJECTS.map((p) => p.slug);
        expect(new Set(slugs).size).toBe(slugs.length);
    });

    it("only references collections that exist", () => {
        for (const p of PROJECTS) {
            if (p.collection) {
                expect(COLLECTION_BY_SLUG[p.collection], p.slug).toBeDefined();
            }
        }
    });

    it("uses valid hex colors and a known tag", () => {
        const tags = new Set(["Research", "Publication", "Project", "Operations"]);
        for (const p of PROJECTS) {
            expect(p.color.hex, p.slug).toMatch(HEX);
            expect(tags.has(p.tag), `${p.slug} tag ${p.tag}`).toBe(true);
        }
    });
});

describe("EXPERIENCE", () => {
    it("has unique slugs", () => {
        const slugs = EXPERIENCE.map((e) => e.slug);
        expect(new Set(slugs).size).toBe(slugs.length);
    });

    it("only links related projects that exist", () => {
        const projectSlugs = new Set(PROJECTS.map((p) => p.slug));
        for (const e of EXPERIENCE) {
            for (const ref of e.relatedProjects) {
                expect(projectSlugs.has(ref), `${e.slug} → ${ref}`).toBe(true);
            }
        }
    });
});
