# grow O'Clock Website

Modern marketing website for grow O'Clock built with Next.js (App Router) and Tailwind CSS. The project includes a full landing page plus all linked pages, consistent layout styling, and section-based navigation with smooth scrolling.

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS

## Project Structure

```
frontend/
	app/
		(pages)
	components/
	public/
```

## Pages and Routes

Main pages:

- / (Home)
- /about
- /services
- /resources
- /contact
- /login
- /register
- /careers
- /blog
- /press
- /privacy
- /terms
- /cookies
- /disclaimer
- /sitemap

Section anchors (used by navbar dropdowns and footer links):

- /about#our-story
- /about#mission
- /about#team
- /about#board
- /services#financial-planning
- /services#investment-strategy
- /services#risk-management
- /services#business-advisory
- /services#tax-consulting
- /services#wealth-management
- /resources#help-center
- /resources#faqs
- /resources#market-insights
- /resources#calculators

## Key Features

- Fully built multi-page site with consistent UI/UX
- Navbar dropdowns link to sections within parent pages
- Smooth scrolling for same-page anchors
- Responsive layout and reusable components
- Animated section reveals using Intersection Observer

## Components

Shared UI components live in `frontend/components/`.

Notable shared components:

- Navbar (dropdown navigation + smooth scrolling)
- Footer (site-wide links)
- PageHero (shared hero banner for inner pages)
- SectionHeading (animated section header)

## Getting Started

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Build

```bash
cd frontend
npm run build
npm run start
```

## Notes

- Social links in the footer are placeholders and can be replaced with real URLs.
- Forms currently show local alerts and are ready for backend integration.
