# BattleFlow Landing Page (Astro)

This is the landing page and marketing site for **BattleFlow**, a high-performance PvP sports app for Pokémon GO. The site is built with **Astro**, **React**, and **Tailwind CSS**, featuring full internationalization (i18n) support and a "Performance-First PvP" aesthetic.

## Project Overview

- **Purpose**: Showcase BattleFlow app features, provide an IV calculator, and host a multilingual blog.
- **Tech Stack**:
  - **Framework**: [Astro 6.0](https://astro.build/)
  - **UI Library**: [React 19](https://react.dev/) (used for interactive components like the IV Calculator)
  - **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) with `@tailwindcss/vite`
  - **Internationalization**: Custom i18n implementation supporting 10 languages (en, es, fr, de, it, pt, zh-Hans, zh-Hant, ja, ko).
  - **Deployment**: Configured for Netlify (`netlify.toml`) and Firebase (`firebase-debug.log` suggests Firebase usage).

## Architecture & Structure

- `src/pages/`: Contains the site routes. Uses dynamic `[lang]` routing for internationalized versions of the homepage, IV calculator, and legal pages.
- `src/components/`: Astro and React components.
  - `IvCalculator.tsx`: A core React component for the PvP IV calculator.
- `src/i18n/`: Translation data (`ui.ts`, `data.ts`) and utilities (`utils.ts`).
- `src/data/`: Static game data (Pokémon base stats, CP multipliers) used by the IV calculator.
- `src/content/`: Blog posts managed via Astro Content Collections.
- `conductor/`: Contains project management documentation, migration plans, and testing results.

## Building and Running

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Astro development server. |
| `npm run build` | Builds the static site and runs route verification. |
| `npm run preview` | Previews the production build locally. |
| `npm run test:routes` | Runs a custom script (`scripts/verify-routes.js`) to validate routes. |

## Development Conventions

- **Internationalization**: 
  - All UI strings should be added to `src/i18n/ui.ts`.
  - Use the `useTranslations(lang)` hook in Astro components to retrieve localized strings.
  - Page routes are duplicated under `src/pages/[lang]/` for non-default locales.
- **Styling**: Uses Tailwind CSS. Global styles are in `src/styles/global.css`.
- **Game Data**: Update `src/data/pokemon.json` or `src/data/cpms.json` when new game masters are released.
- **Blog Content**: Blog posts are written in Markdown in `src/content/blog/[lang]/` and must follow the schema defined in `src/content.config.ts`.
- **Performance**: The site prioritizes "Performance-First PvP" aesthetic: bold typography (Heebo Extra Bold), tight spacing, and high-performance KPI treatments.
