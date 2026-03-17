# Astro Migration & Redesign Plan: "Performance-First PvP"

## Objective
Migrate the BattleFlow landing page from Jekyll + Webpack to Astro. Astro is a modern, zero-JS by default static site generator that will greatly improve developer experience, compilation times, and long-term maintainability. Concurrently, we will implement the new "Performance-First PvP" UI aesthetic (inspired by sports apps like Strava) and feature the 3 new preview videos alongside screenshots.

## Architecture & Tooling
- **Framework:** Astro (Static Site Generation mode)
- **Styling:** SCSS (reusing existing styles but modernizing components) or Tailwind CSS (optional, but SCSS is easier for a direct migration). We will stick to the existing SCSS foundation and enhance it with the new deep blue color (`#505B92`) and extra-bold typography.
- **i18n:** Astro's built-in i18n routing (`src/pages/[lang]/`) mapped to a custom dictionary (`src/i18n/ui.ts`) which replaces `_data/app/*.yml`.
- **Content:** Astro Content Collections. We will migrate the blog posts from the fragmented `_posts/*.md` + `_data/posts/*/*.yml` setup into a clean structure: `src/content/blog/[lang]/[slug].md`.
- **Deployment:** Netlify (already in use, just update the build command and output directory).

## Implementation Steps

### 1. Project Initialization & Dependency Setup
- Remove legacy Jekyll/Ruby/Webpack files (`Gemfile`, `_config.yml`, `webpack.*.js`, etc.).
- Initialize Astro (`npm create astro@latest . -- --template minimal --yes`).
- Install dependencies: `@astrojs/sitemap`, `sass` (for SCSS support).

### 2. Content & Data Migration
- **i18n Strings:** Convert the `_data/app/*.yml` and `_data/strings/*.yml` files into a centralized `src/i18n/ui.ts` file holding translation objects for all 10 supported languages (`en`, `es`, `fr`, `de`, `it`, `pt`, `zh-Hans`, `zh-Hant`, `ja`, `ko`).
- **Blog Posts:** 
  - Define an Astro Content Collection for the blog (`src/content/config.ts`).
  - Migrate content from `_data/posts/` and `_posts/` into `src/content/blog/[lang]/[slug].md`. This drastically simplifies editing future posts.

### 3. Astro Layouts & Components
- **Base Layout (`src/layouts/Layout.astro`):** Global HTML structure, `<head>`, metadata, fonts (Heebo/System), and Language Switcher logic.
- **UI Components:**
  - `Hero.astro`: Include the bold typography (`h1` extra bold, tracking `-0.5px`) and the app icon with a sleek drop shadow.
  - `Features.astro`: Migrate the feature cards with the new aesthetic.
  - `Showcase.astro`: Implement a horizontal scrolling track that renders the 3 new videos (`IVChecker Preview.mp4`, `Simulator Preview.mp4`, `Team Generator Preview.mp4`) followed by the 6 screenshots.

### 4. Styling ("Performance-First PvP" UI)
- Extract `_scss/_default.scss` into `src/styles/global.scss`.
- Update the primary color variable to `#505B92` (PvP Deep Blue).
- Ensure typography emphasizes Key Performance Indicators (numbers, ranks, IV percentages) with high contrast.
- Apply subtle gradients and refined card shadows matching the Strava-like high-performance identity.

### 5. Pages & i18n Routing Setup
- Set up dynamic routing for languages in `src/pages/[lang]/index.astro` and `src/pages/[lang]/blog/index.astro`.
- Set up `src/pages/index.astro` to auto-redirect or serve the default language (`en`).

### 6. Netlify Configuration Update
- Update `netlify.toml` to:
  ```toml
  [build]
    command = "npm run build"
    publish = "dist"
  ```
- Ensure `_redirects` and `robots.txt` are moved to Astro's `public/` directory.

## Verification & Testing
- Run `npm run dev` to verify the local development server.
- Click through all language routes to ensure i18n dictionaries are working.
- Verify blog posts render properly in all languages.
- Ensure the showcase section auto-plays/displays the 3 new MP4 videos properly on mobile and desktop.
- Run a production build (`npm run build`) to confirm static output generation.
