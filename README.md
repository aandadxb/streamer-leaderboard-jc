# JC Leaderboard

JustCasino streamer wager-race leaderboard, built from the "JC Leaderboard" Figma (gold theme, Inter).
Same codebase as `justcasino-leaderboard` / `streamer-leaderboard-deployed`; only the design tokens, font, and Node base image differ.

- Accent: `#FFC000` (Figma `Casino Yellow/500`), soft gold `#FBE3A3`
- Backgrounds: page `#121212`, mobile/footer `#181818`
- Font: Inter (variable, self-hosted in `src/app/fonts`, OFL)
- Node: `>=22.23.4` (Dockerfile pinned to `node:22.23.4-alpine`, security release of 2026-10-21)

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
