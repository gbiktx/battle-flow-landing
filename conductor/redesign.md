# Redesign Plan: "Performance-First PvP" Aesthetic

## Objective
Update the BattleFlow landing page to match the new app's "Performance-First PvP" design aesthetic, inspired by high-performance sports apps. Update styling to use the new color palette, bold typography, and integrate the three new preview videos alongside the screenshots.

## Key Files & Context
- `_scss/_default.scss`: Central stylesheet containing color variables, typography, and layout.
- `_layouts/home.html`: Homepage layout to be updated to render multiple videos.
- `_data/appconfig.yml`: Configuration file to declare the new video assets.

## Implementation Steps
1. **Update Configuration (`_data/appconfig.yml`)**:
   - Replace the single `video` key with a `videos` list containing:
     - `IVChecker Preview.mp4`
     - `Simulator Preview.mp4`
     - `Team Generator Preview.mp4`

2. **Update Styling (`_scss/_default.scss`)**:
   - **Colors**: Change `$primary-color` to `#505B92` (PvP Deep Blue). Update `$secondary-color` to a high-contrast dark neutral (e.g., `#1A2035`). Update `$accent-color` and gradients to complement the new primary brand color.
   - **Typography**: 
     - Set heading (`h1`, `h2`, `.app__name`, `.app__section-title`) font-weight to `800` (Extra Bold) and `letter-spacing` to `-0.5px`.
     - Define styles for small, all-caps, bold data labels.
     - Ensure numbers have a high-contrast KPI treatment.
   - **Layout**: Slightly tweak button shadows and screenshot/video cards to match the new bold app identity. Make sure videos display properly in the scrollable track.

3. **Update Layout (`_layouts/home.html`)**:
   - Modify the `.app__screenshots-list` section. Instead of checking for a single `app_config.video`, iterate over `app_config.videos` and render a `<video>` tag for each one before the screenshots. 
   - Apply specific classes to video items so they display consistently with the image screenshots.

4. **Verify Asset Usage**:
   - Reference `assets/images/` for the new videos directly, and make sure `url-encoding` is handled if needed for spaces in file names.
   - Use the screenshots provided in `assets/images/screenshots/` (1.png through 6.png).

## Verification & Testing
- Start the Jekyll server locally (`npm run dev` or `bundle exec jekyll serve`).
- Verify the new "PvP Deep Blue" color palette is active.
- Verify typography is extra bold with tight spacing.
- Scroll through the screenshot carousel to ensure all 3 new preview videos play correctly and are sized appropriately.
