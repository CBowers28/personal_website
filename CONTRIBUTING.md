# Contributing

Thanks for working on this project. This repo has two parts:

| Path            | What it is                                             |
| --------------- | ------------------------------------------------------ |
| `my-portfolio/` | The Next.js portfolio site — the real application.     |
| `src/` (root)   | A small standalone TypeScript entrypoint.              |

## Local development

All app work happens in `my-portfolio/`:

```bash
cd my-portfolio
npm install
npm run dev        # start the dev server
```

## Quality checks (run before pushing)

The CI pipeline runs exactly these, so run them locally first:

```bash
cd my-portfolio
npm run lint       # ESLint (next/core-web-vitals + TypeScript)
npm run typecheck  # tsc --noEmit
npm test           # Vitest unit tests
npm run build      # next build (production build must succeed)
```

Tests live next to the code they cover as `*.test.ts` (e.g.
`src/lib/contact-validation.test.ts`). Add tests for any new pure logic —
validation, data transforms, formatting, and data-integrity invariants are
the easiest and highest-value things to cover.

## CI / CD

The pipeline is defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
and runs on every push and pull request to `main`:

1. **`quality`** — installs, then runs lint → typecheck → test → build for
   `my-portfolio/` across Node 20.x and 22.x.
2. **`root-build`** — compiles the root TypeScript entrypoint.
3. **`deploy`** — optional CLI-driven Vercel production deploy. Dormant unless
   `ENABLE_VERCEL_DEPLOY` is set and the Vercel secrets are configured.
   Production hosting is normally handled by Vercel's native Git integration;
   `quality` is the gate that must be green before that deploy is trusted.

### ⚠ Keep the pipeline in sync with major changes

**When you integrate a major change, update the pipeline in the same PR** so
the new capability is actually exercised in CI. A feature that isn't in the
pipeline is a feature CI can't protect. Use this checklist:

- **New test type** (integration, E2E, visual) → add a job/step that runs it
  (e.g. a Playwright job for browser tests).
- **New package or workspace** → add it to the matrix or give it its own job.
- **Database / migrations** → add a migration or schema check.
- **New required env vars or secrets** → wire them into the workflow and
  document them here.
- **New build or codegen step** → add it before `build` so CI catches breaks.
- **Changed supported Node versions** → update the `node-version` matrix.

The workflow file has a matching reminder banner at the top so it's hard to
miss while editing.
