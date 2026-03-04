# Vibe Status

A real-time status dashboard for developer essentials. Monitor 23+ services in one place with live updates, dark mode, and per-user customization.

## Features

- **Real-time monitoring** — Auto-polls every 60 seconds with live pulse indicator
- **23 services** — Claude, GitHub, Vercel, Netlify, npm, Linear, Figma, OpenAI, Stripe, Cloudflare, and more
- **Customizable dashboard** — Sign in with GitHub to pick your 7 services
- **Dark mode** — Full light/dark theme support
- **Expandable cards** — Click any service to see detailed component status
- **Status sorting** — Worst status services float to the top

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) 4
- [Auth.js](https://authjs.dev) v5 (GitHub OAuth)
- [Prisma](https://prisma.io) (database ORM)
- [Vercel Analytics](https://vercel.com/analytics)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env` file with:

```
DATABASE_URL=
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```

## License

[MIT](LICENSE)
