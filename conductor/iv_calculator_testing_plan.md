# IV Calculator Testing Plan

## Objective
Verify that the newly added IV Calculator feature on the Battle Flow landing page is fully functional, responsive, and localized.

## Key Files & Context
- **Page:** `src/pages/iv-calculator.astro`
- **Main Component:** `src/components/IvCalculator.tsx` (React)
- **Wrapper:** `src/components/IvCalculatorWrapper.astro`
- **Data:** `src/data/pokemon.json`, `src/data/translations.json`
- **Logic:** `src/lib/pvp-calculator.ts`

## Implementation Steps (Testing Workflow)

### 1. Environment Setup
- **Action:** Start the development server (`npm run dev`).
- **Verification:** Ensure the server is running on `http://localhost:4321`.

### 2. Functional Testing (Chrome DevTools)

#### A. Navigation & Rendering
- **Action:** Navigate to `http://localhost:4321/iv-calculator`.
- **Verification:** 
  - Page loads without console errors.
  - Navbar, Hero, Calculator, and Footer are visible.
  - Initial Pokémon (Azumarill) is correctly displayed with its sprite and types.

#### B. Pokémon Search
- **Action:** Type "Pikachu" in the search box.
- **Verification:** 
  - Search results dropdown appears.
  - Selecting "Pikachu" updates the UI (sprite, name, types, and stats table).

#### C. League & Level Cap Selection
- **Action:** Switch between "Little", "Great", "Ultra", and "Master" leagues.
- **Verification:** Stats table updates immediately with correct CP caps (500, 1500, 2500, 10000).
- **Action:** Switch level caps (40, 41, 50, 51).
- **Verification:** Stats table updates to reflect the new level ceiling.

#### D. IV Entry & Tracking
- **Action:** Enter custom IVs (e.g., Atk: 0, Def: 15, Hp: 15).
- **Verification:** 
  - Auto-focus moves the cursor to the next field correctly.
  - "Track IVs" button adds the IV set to the table with a highlighted background.
- **Action:** Click "Clear Tracked".
- **Verification:** Custom IV sets are removed from the table.

#### E. Table Expansion
- **Action:** Toggle between "Show Top 10" and "Show Top 100".
- **Verification:** Table length updates accordingly.

### 3. Localization Testing
- **Action:** Navigate to `http://localhost:4321/fr/iv-calculator` (or any other supported language).
- **Verification:** 
  - Pokémon names, types, and UI labels (Rank, IV Set, etc.) are translated.

### 4. Visual & Responsive Testing
- **Action:** Use Chrome Device Mode to test on mobile (iPhone SE/12 Pro) and tablet (iPad).
- **Verification:** 
  - The calculator layout remains usable.
  - Table is scrollable horizontally on small screens.

## Verification & Testing
- Use `mcp_chrome-devtools_navigate_page` to access the site.
- Use `mcp_chrome-devtools_take_snapshot` and `mcp_chrome-devtools_evaluate_script` to inspect state.
- Use `mcp_chrome-devtools_list_console_messages` to check for runtime errors.
