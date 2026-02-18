# grow O'Clock Website

Modern marketing website for grow O'Clock built with Next.js (App Router) and Tailwind CSS. The project includes a full landing page plus all linked pages, consistent layout styling, and section-based navigation with smooth scrolling with integrated Dark Mode.

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
- /blog (Public blog listing)
- /blog/[slug] (Individual blog posts)
- /dashboard (Protected - User dashboard)
- /dashboard/blog (Protected - Blog management for admins/advisors)
- /dashboard/blog/new (Protected - Create new blog post)
- /dashboard/blog/edit/[slug] (Protected - Edit blog post)
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
- **Blog Management Dashboard** - Full CRUD interface for admins and advisors to create, edit, and publish blog posts
- User authentication with role-based access (USER, ADVISOR, ADMIN)
- Public blog listing and detailed post pages with categories and tags
- Integrated Dark Mode

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

## Blog Management

Admins and advisors can manage blog posts through the dashboard:

1. **Login as Admin/Advisor** - See backend README for creating admin accounts
2. **Navigate to Dashboard** - Click "Blog Management" in the sidebar
3. **Create Posts** - Full editor with title, excerpt, content, categories, tags, and status
4. **Edit/Delete** - Manage existing posts with view tracking
5. **Publish** - Set status to PUBLISHED and optionally schedule publish date

### User Roles:

- **USER**: Regular clients (default)
- **ADVISOR**: Can create and manage blog posts
- **ADMIN**: Full access including Django admin panel

## Notes

- Social links in the footer are placeholders and can be replaced with real URLs.
- Backend integration is complete for blog, authentication, and dashboard features.
- Create a superuser account using `python manage.py createsuperuser` to access blog management.
