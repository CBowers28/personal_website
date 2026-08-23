This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Strava / cycling graph (the `/life` page)

The **On the Bike** panel on `/life` shows live cycling stats — total distance,
elevation, a 12-week mileage bar chart, and recent rides — pulled from the
Strava API. Without credentials it renders representative **sample data** and
labels itself as such, so nothing breaks locally or on preview deploys.

To wire it up to a real Strava account, set three server-side env vars (locally
in `.env.local`, and in the Vercel project settings for production):

```bash
STRAVA_CLIENT_ID=...       # from https://www.strava.com/settings/api
STRAVA_CLIENT_SECRET=...   # same page
STRAVA_REFRESH_TOKEN=...   # a refresh token with activity:read_all scope
```

Getting the refresh token once (full instructions are in
`src/lib/strava.ts`): create an API application, authorize it in the browser
with `scope=activity:read_all` to capture a `code`, then exchange that `code`
at `https://www.strava.com/oauth/token` for a `refresh_token`. The refresh
token is long-lived; the app mints short-lived access tokens on demand.

Data is cached server-side (~15 min) to stay well inside Strava's rate limits,
and the client re-polls every 5 minutes so the graph stays current.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
