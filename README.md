# SaveMy Reel - Social Media Downloader (Next.js 14)

SEO-focused multi-platform downloader for public social media media links (Instagram, TikTok, Twitter/X, Pinterest, YouTube Shorts).

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Lucide React
- axios
- next-intl
- @upstash/ratelimit + Redis
- yt-dlp (server-side subprocess) with optional RapidAPI switch
- next-sitemap

## Local setup

1. Install dependencies:
   npm install
2. Copy env template:
   cp .env.example .env.local
3. Install yt-dlp on machine/server:
   - macOS: brew install yt-dlp
   - Ubuntu: sudo apt-get install yt-dlp
4. Install ffmpeg (required for merging separate video/audio streams):
   - macOS: brew install ffmpeg
   - Ubuntu: sudo apt-get install -y ffmpeg
5. Verify dependencies:
   - ffmpeg -version
   - yt-dlp --version
6. Start dev server:
   npm run dev

## API routes

- `POST /api/download`
  - Body: `{ "url": "https://www.instagram.com/p/XXXXX/" }`
  - Validates platform URL, rate-limits, extracts media with yt-dlp or RapidAPI.
- `GET /api/proxy?url=ENCODED_URL`
  - Streams media through server with host allowlist checks.

## Configure yt-dlp vs RapidAPI

Set `USE_RAPID_API=false` to use yt-dlp locally.
Set `USE_RAPID_API=true` and configure:

- `RAPID_API_KEY`
- `RAPID_API_HOST`

RapidAPI logic is in `lib/extractMedia.ts` (`extractWithRapidApi`). Replace endpoint path based on your provider.

## Docker deployment (recommended for production)

To avoid missing ffmpeg/yt-dlp in production, use the included `Dockerfile`.

It pre-installs:

- ffmpeg
- yt-dlp
- instaloader

Build and run example:

```bash
docker build -t savemyreel .
docker run -p 3000:3000 --env-file .env.local savemyreel
```

Set `DOCKERFILE=true` in env to mark Docker-based deployment in your config management.

## Vercel deployment

This project is configured to work on Vercel serverless functions:

- `vercel-build` runs `scripts/install-ytdlp.js` so yt-dlp is downloaded on each deploy.
- `ffmpeg-static` is bundled from npm so ffmpeg is available without apt/apk.
- Output tracing includes both `bin/**` and `node_modules/ffmpeg-static/**` for `/api/download` and `/api/proxy`.

Optional environment overrides:

- `YTDLP_BINARY_PATH` (absolute path to yt-dlp binary)
- `FFMPEG_BINARY_PATH` (absolute path to ffmpeg binary)

## Download restricted Instagram stories (cookie auth)

Some story URLs require a logged-in Instagram session. Configure one of the following in `.env.local`:

- `YTDLP_COOKIES_FILE=/absolute/path/to/cookies.txt`
- `YTDLP_COOKIES_FROM_BROWSER=chrome` (or `chrome:Default`, `firefox`, etc.)

Notes:

- `YTDLP_COOKIES_FILE` takes precedence if both are set.
- Keep cookie files private and never commit them.
- If stories still fail, refresh your cookies/session and retry.
- If neither value is configured, the server now auto-tries common local browser profiles (`chrome`, `firefox`, `safari`, `edge`) for story extraction.

## Add AdSense IDs

Current ad slots are placeholders rendered client-side via `components/AdSlot.tsx`.
Replace placeholder markup with official AdSense script/slot rendering and map slot IDs used in pages:

- home-top-1
- home-bottom-1
- hero-inline-1
- faq-inline-1
- result-sidebar-1
- result-sidebar-2

## i18n

Message files are in `messages/`:

- en.json
- hi.json
- es.json
- id.json
- pt.json

Language selection is handled by cookie `NEXT_LOCALE` and path-preserving client navigation.

## SEO

Implemented:

- Metadata API title/description/canonical/OG on every page
- JSON-LD FAQPage + HowTo schemas on content pages
- JSON-LD WebSite + SearchAction on homepage
- Sitemap config via `next-sitemap.config.js`
- Robots file in `public/robots.txt`

Generate sitemap after build:

npm run build && npx next-sitemap

## Add a new supported platform

1. Add URL regex in `lib/detectPlatform.ts`
2. Extend `SupportedPlatform` in `lib/types.ts`
3. Update extraction behavior in `lib/extractMedia.ts`
4. Add platform badge in `components/PlatformBadges.tsx`
5. Update docs and FAQs if needed

## Important compliance notes

- This app only supports public URLs.
- Do not store user URLs or downloaded files permanently.
- Show personal-use copyright disclaimer on every page.
