import { describe, it, expect } from "vitest";
import { POSTS, PUBLISHED_POSTS, formatPostDate } from "./posts";

describe("formatPostDate", () => {
    it("formats an ISO date as a long US date", () => {
        expect(formatPostDate("2026-01-05")).toBe("January 5, 2026");
    });

    it("does not shift the day across timezones", () => {
        // Parsed at local midnight, so the calendar day must be preserved.
        expect(formatPostDate("2026-12-31")).toBe("December 31, 2026");
    });
});

describe("PUBLISHED_POSTS", () => {
    it("never exposes a draft", () => {
        expect(PUBLISHED_POSTS.every((p) => !p.draft)).toBe(true);
    });

    it("is sorted newest-first by date", () => {
        for (let i = 1; i < PUBLISHED_POSTS.length; i++) {
            expect(PUBLISHED_POSTS[i - 1].date >= PUBLISHED_POSTS[i].date).toBe(true);
        }
    });

    it("only contains posts that exist in POSTS", () => {
        const slugs = new Set(POSTS.map((p) => p.slug));
        expect(PUBLISHED_POSTS.every((p) => slugs.has(p.slug))).toBe(true);
    });

    it("has unique slugs", () => {
        const slugs = POSTS.map((p) => p.slug);
        expect(new Set(slugs).size).toBe(slugs.length);
    });
});
