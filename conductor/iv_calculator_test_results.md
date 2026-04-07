# IV Calculator Test Results - April 7, 2026

## Summary
The IV Calculator feature has been successfully tested on the local development environment (`http://localhost:4321/iv-calculator/`). All core functional, localization, and responsive requirements have been met.

## Environment
- **Browser:** Chrome (Headless via MCP)
- **URL:** `http://localhost:4321/iv-calculator/`
- **Device:** Desktop (1920x1080) and Mobile (390x844)

## Test Executed & Results

### 1. Navigation & Initial Render
- **URL Check:** `http://localhost:4321/iv-calculator` redirects correctly or is accessible at `http://localhost:4321/iv-calculator/` (Astro trailing slash configuration).
- **Initial Pokémon:** "Azumarill" loads as the default species.
- **Visuals:** Sprite, types (Water/Fairy), and stats table are rendered correctly.
- **Status:** **PASS**

### 2. Pokémon Search
- **Action:** Searched for "Pikachu".
- **Interaction:** Dropdown results appeared correctly.
- **Selection:** Selecting "Pikachu" updated the header, sprite, and stats table (Rank #1: 15/15/15 for Master League).
- **Status:** **PASS**

### 3. League & Level Cap Selection
- **League Toggle:** Successfully switched between "SUPER" (Great) and "PEQUEÑA" (Little) in Spanish locale.
- **Table Update:** Table length correctly toggled from 10 to 100 rows using "MOSTRAR TOP 100".
- **Level Cap:** Buttons for 40, 41, 50, 51 are present and functional.
- **Status:** **PASS**

### 4. Localization (Spanish)
- **Navigation:** Tested at `/es/iv-calculator/`.
- **UI Labels:** "CALCULADORA DE IV", "LIGA", "SET DE IVS", "PC", "PERFECCIÓN" are correctly translated.
- **Pokémon Names:** "Azumarill" and "Pikachu" translated correctly (where applicable).
- **Types:** "AGUA", "HADA", "ELÉCTRICO" are localized.
- **Status:** **PASS**

### 5. IV Entry & Tracking (Auto-focus)
- **Initial Values:** Defaulted to 0/15/15.
- **Logic:** Rank calculations update based on input changes.
- **Status:** **PASS**

### 6. Responsive Design
- **Mobile View:** Tested at 390x844.
- **Table Scrolling:** Verified horizontal scrollability (`scrollAmount: 500` on 950px wide table).
- **Layout:** UI remains usable and aesthetically consistent.
- **Screenshot:** Captured at `docs/iv-calculator-mobile.png`.
- **Status:** **PASS**

### 7. Console & Runtime Errors
- **Console:** No fatal errors. Minor A11y warnings regarding missing labels for form fields (inputs).
- **Status:** **PASS (with minor warnings)**

## Conclusion
The IV Calculator is ready for production. Recommendation: Address the missing `<label>` associations for the IV input fields to improve accessibility (msgid 9 in console logs).
