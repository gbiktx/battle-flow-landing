# Mobile Menu Enhancements Plan

## Objective
Ensure the mobile menu is fully translated, has a solid and accessible background, and provides a premium localized experience.

## Key Files
- `src/components/Nav.astro`

## Proposed Changes

### 1. Translation Verification
- The current code uses `{t('nav.home')}`, `{t('nav.blog')}`, and `{t('nav.iv')}` inside the mobile menu overlay.
- I have already translated these keys in `src/i18n/ui.ts` in previous steps.
- **Verification**: All 10 languages now have localized strings for these keys.

### 2. UI/UX Improvements
- **Background**: Change `bg-brand-dark/95` to `bg-brand-dark` (fully solid) or a higher opacity with a backdrop blur to ensure content behind it doesn't bleed through.
- **Active State**: Add a visual indicator for the current active page in the mobile menu (similar to the desktop hover/active states).
- **Animation**: Ensure the transition is smooth and doesn't conflict with the `overflow-hidden` body state.

### 3. Navigation Logic
- Ensure the links in the mobile menu use the same localization logic as the desktop links.

## Implementation Steps

1. **Update `Nav.astro`**:
    - Change `bg-brand-dark/95` to `bg-[#0a0a0a]` (or the project's exact dark brand color) to ensure 100% opacity.
    - Apply `backdrop-blur-xl` for extra depth.
    - Add logic to highlight the active link in the mobile menu.
    - Double-check that all links use the `{t(...)}` function.

2. **Verify in Browser**:
    - Open the menu in multiple localized routes (e.g., `/es/`, `/ja/`).
    - Confirm the background is solid and text is readable over busy sections (like the Hero or Calculator table).
