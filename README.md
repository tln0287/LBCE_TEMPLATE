# LBCE website

Website for **Dr. Lankapalli Bullayya College of Engineering**, Visakhapatnam.
Built with Next.js 16 (App Router), React 19 and TypeScript. Animation is plain CSS plus Three.js for the 3D hero layer. Icons are Lucide.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint       # type-check
```

## Where things live

| Path | What it holds |
|---|---|
| `content/*.json` | **All site content.** Pages read it through `lib/content.ts` only. |
| `lib/content.ts` | The single data-access layer. To move to a CMS or API, change this file; components stay the same. |
| `lib/routes.ts` | Registry of every page (title + description). Drives metadata, the sitemap and search. Add new pages here. |
| `lib/search.ts` | Builds the Ctrl+K search index (pages, departments, faculty, events, news, documents, policies, reports). |
| `app/styles/tokens.css` | Design tokens: colors, type scale, radii, shadows. |
| `app/styles/*.css` | Base, shared components, header/footer, homepage, and one file per page group. |
| `components/layout` | Header, mega menus, mobile drawer, command palette, footer, page hero. |
| `components/three/HeroScene.tsx` | The 3D hero layer (wireframe lattice, gold particles, light trails, blueprint floor). |
| `components/ui` | Buttons, icons, images, counters, document cards, the placement chart. |

## Color system

| Token | Hex | Use |
|---|---|---|
| `--navy` | `#071A2B` | Navbar, footer, dark sections, mega menus, headings |
| `--blue` | `#145DA0` | Primary buttons, links, icons on light backgrounds |
| `--blue-bright` | `#1E88E5` | Hover states; icons on dark backgrounds |
| `--gold` | `#C9A227` | Accent lines, active nav, numbers on dark, premium buttons |
| `--gold-ink` | `#8A6A0A` | Gold-toned **text** on light backgrounds (plain gold fails contrast there) |
| `--ivory` | `#F7F3E8` | Alternate sections, cards |
| `--sky` | `#EEF5FA` | Academic and information panels |
| `--ink` / `--muted` | `#17212B` / `#667085` | Body text / secondary text |

Navy usage is deliberately limited to the site frame (utility bar, navbar, mega menus, mobile drawer, footer) and one contained card per page. Heroes and content sections are light (warm white, ivory, light blue). `app/styles/tone.css` remaps the dark-surface tokens, so components written for navy render correctly on light sections.

Contrast rules: gold text sits only on navy (7.3:1), never on white (2.4:1). Royal Blue text is never placed on navy (2.6:1); dark sections use Bright Blue for icons.

## Content still needed from the college

Every figure or name the college hasn't supplied is shown as an explicit placeholder (`XX`) or an empty state. Nothing is invented. To complete the site, supply:

- **Statistics**: `content/home.json` → `stats`, `research.metrics`; `content/placements.json` → `stats`, `byYear` (the placement chart appears automatically once `byYear` has data), `recruiters`.
- **Faculty directory**: `content/faculty.json` → `members`.
- **Alumni profiles** (verified, with consent): `content/alumni.json` → `profiles`.
- **Achievements**: `content/achievements.json` → `items`.
- **Events and LBC Times**: replace the sample entries in `content/events.json` and `content/news.json`.
- **Department details**: intake, labs and research areas in `content/departments.json` are drafts for each department to confirm. **Mechanical Engineering** was in the design brief but isn't listed on the current lbce.edu.in, so confirm whether the college offers it.
- **Documents** (PDF links): `content/institution.json` (IQAC, NAAC, AICTE, ISO, RTI, reports…), `content/policies.json`, `content/committees.json` (members), `content/academics.json` (calendar, regulations, syllabus).
- **Portals and social links**: `content/site.json` → `externalLinks.studentPortal`, `externalLinks.facultyPortal`, `social.*`. Social icons only appear for networks that have a URL.
- **Form submissions**: set `content/site.json` → `forms.endpoint` to the college's form API. Until then, forms say that online submission isn't connected and list the email and phone instead. They never pretend to succeed.
- **Logo**: `components/ui/BrandMark.tsx` is a placeholder monogram. Replace it with the official logo (white version for the navy header).
- **Photography**: images are Unsplash stock placeholders. Swap the URLs in `content/*.json` for real campus photos. `lib/img.ts` adds responsive sizes for Unsplash; add the college's CDN host there and to `next.config.ts` → `images.remotePatterns`.

## Existing links preserved

Gallery, alumni, committees, ISO, capacity building, placements, NIRF, LBC Times, campus glimpses, policies, BGV, skill development, grievance, the NIRF 2026 Functional Address PDF, the UGC Mandate 2025–26 PDF, and the CCAvenue online payment page are all in `content/site.json` → `externalLinks`. Pages link to them as "View on the current website" until their content moves over.

## Site search

- **Open it:** press Ctrl+K (⌘K on Mac) or `/` anywhere, use the search button in the header, or use the search panel on the homepage. `/search?q=…` is a full results page that works without JavaScript and can be shared as a link.
- **Index:** `lib/search.ts` builds it from the content files. It covers pages, every in-page section (each department's labs, research, programs and faculty; each facility; admissions steps; policies; committees; and so on), events, news, documents, contacts and quick actions (call, email, pay fees, apply, directions). It's served as a static `/search-index.json` that loads lazily, so it doesn't add weight to pages.
- **Engine:** `lib/searchEngine.ts` handles typo tolerance ("librray", "placment"), synonyms ("fees" finds online payment, "bus" finds transportation, "exam" finds examinations), field weighting, a "Top results" group and match highlighting. Add synonyms to `SYNONYMS` as people search for new things.
- **New content is indexed automatically.** A new page needs an entry in `lib/routes.ts`; a new in-page section needs one line in `lib/search.ts`.
- **Structured data:** `WebSite` structured data with a `SearchAction` lets search engines show a search box for the site.

## Accessibility and motion

- Keyboard: skip link; mega menus open on click or Enter and close with Esc; the drawer traps focus; Ctrl+K opens search.
- Carousels have previous, next, pause and slide indicators. Autoplay pauses on hover and focus.
- `prefers-reduced-motion` turns off autoplay, Ken Burns, the marquee and counters, and renders the 3D scene as a single still frame.
- Motion lives in `app/styles/motion.css`, with orchestration in `components/ui/RevealObserver.tsx`. It covers staggered scroll reveals, image wipes, the page-hero entrance, button sheen, card spotlight, floating blueprint shapes (`components/ui/Floaters.tsx`) and scroll-linked parallax.
- The 3D scene loads lazily, pauses off-screen and when the tab is hidden, and falls back to the CSS blueprint layer if WebGL is unavailable.
