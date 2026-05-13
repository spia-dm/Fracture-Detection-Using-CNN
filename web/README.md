# Web · `web/`

Single-page interactive research paper for the fracture-detection CNN. Built
with Next.js 16 + Tailwind 4. Smooth scroll via Lenis, scroll-triggered
animations via GSAP, interactive charts via Recharts, animated 3D network
diagram via React Three Fiber, sliding nav pill via framer-motion.

## Run

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build && npm start
```

## Layout

```
web/
├── src/
│   ├── app/
│   │   ├── layout.tsx          Root layout, fonts, smooth-scroll provider, theme init
│   │   ├── page.tsx            Composes all sections
│   │   └── globals.css         Tailwind + light/dark theme tokens
│   ├── components/
│   │   ├── SmoothScroll.tsx    Lenis ↔ GSAP ticker bridge
│   │   ├── Reveal.tsx          Scroll-triggered fade-up wrapper
│   │   ├── Parallax.tsx        Scrub-based yPercent translate
│   │   ├── Nav.tsx             Auto-hiding section nav + sliding pill
│   │   ├── ThemeToggle.tsx     Light / dark toggle
│   │   ├── network/            3D layer diagram (React Three Fiber)
│   │   ├── charts/             AccuracyChart, MetricRadar, KFoldChart
│   │   └── sections/           Hero, Abstract, Dataset, Architecture, Results, KFold, Conclusion
│   └── lib/
│       └── data.ts             All numbers from the paper, pinned here
└── package.json
```

## Data

Every number rendered on the page comes from
[`src/lib/data.ts`](src/lib/data.ts), pinned verbatim from the paper's
Tables 2 – 7 and Figure 14. No live training happens in the web app — it's a
read-only presentation of the experiment results produced by the notebooks in
[`../dl/notebooks/`](../dl/notebooks).

## Theme

Defaults to light mode. User's choice is persisted in `localStorage`; the
no-flash init script in [`layout.tsx`](src/app/layout.tsx) applies the
attribute on first paint to avoid a dark-mode flash. Chart colors,
backgrounds, and labels all theme-react via CSS variables.
