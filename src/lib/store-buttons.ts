// Shared presentation for the App Store / Google Play buttons.
//
// Two renderers consume this: `StoreButtons.astro` (static pages) and the
// `StoreCtaButtons` React component inside the IV calculator island. An Astro
// component can't be rendered inside a React island, so the markup exists
// twice — but the class strings and icon paths live here so the two copies
// can't drift.
//
// The per-size `hoverBorder`/`shadow` values are not a design system: they
// reproduce, byte for byte, what each placement shipped with before the
// buttons were centralized (compact = IV calculator, standard = hero/CTA,
// large = footer). Change them deliberately, not incidentally.

export type StoreButtonSize = 'compact' | 'standard' | 'large';

export interface StoreButtonStyle {
  /** Wrapper flex gap between the two buttons. */
  row: string;
  button: string;
  hoverBorder: string;
  shadow: string;
  /** Fixed-size flex box around the glyph. */
  iconBox: string;
  icon: string;
  label: string;
  prefix: string;
  prefixMargin: string;
}

export const STORE_BUTTON_SIZES: Record<StoreButtonSize, StoreButtonStyle> = {
  compact: {
    row: 'gap-4',
    button: 'sm:w-[240px] h-[72px] px-6 gap-5',
    hoverBorder: 'hover:border-white/60',
    shadow: 'shadow-xl',
    iconBox: 'w-9 h-9',
    icon: 'w-9 h-9',
    label: 'text-xl',
    prefix: 'text-[11px]',
    prefixMargin: 'mb-1',
  },
  standard: {
    row: 'gap-4',
    button: 'sm:w-[280px] h-[80px] px-7 gap-5',
    hoverBorder: 'hover:border-white/40',
    shadow: 'shadow-2xl',
    iconBox: 'w-10 h-10',
    icon: 'w-9 h-9',
    label: 'text-[22px]',
    prefix: 'text-[11px]',
    prefixMargin: 'mb-1.5',
  },
  large: {
    row: 'gap-6',
    button: 'sm:w-[320px] h-[96px] px-8 gap-6',
    hoverBorder: 'hover:border-white/60',
    shadow: 'shadow-2xl',
    iconBox: 'w-14 h-14',
    icon: 'w-12 h-12',
    label: 'text-[26px]',
    prefix: 'text-[13px]',
    prefixMargin: 'mb-1.5',
  },
};

const BUTTON_BASE =
  'w-full bg-black border border-white/20 rounded-2xl flex items-center transition-all group ' +
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent';

export function storeButtonClass(style: StoreButtonStyle): string {
  return `${BUTTON_BASE} ${style.button} ${style.hoverBorder} ${style.shadow} hover:bg-white/5`;
}

export function storeButtonRowClass(style: StoreButtonStyle, alignment: string): string {
  return `flex flex-col sm:flex-row items-center ${style.row} ${alignment}`;
}

/** Horizontal alignment of the button row. `md-start`/`lg-start` stay centered below the breakpoint. */
export type StoreButtonAlign = 'center' | 'md-start' | 'lg-start';

export const STORE_BUTTON_ALIGNMENTS: Record<StoreButtonAlign, string> = {
  center: 'justify-center',
  'md-start': 'justify-center md:justify-start',
  'lg-start': 'justify-center lg:justify-start',
};

export const APP_STORE_ICON_PATH =
  'M318.7 268.7c-.2-36.7 21.3-64.4 50.4-81.2-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-83.6-20.8-42.3 0-81.8 24.4-103.2 61.9-43.2 75.2-11.1 186.1 31 247.1 20.6 29.8 44.8 63.3 76.9 62.2 31.3-1.1 43.1-20.1 81-20.1 37.9 0 48.9 20.1 81.1 19.4 33.1-.7 54.4-30.3 74.9-59.7 23.6-34.1 33.2-67.1 33.5-68.8-.7-.3-64.9-24.9-65.5-98.4zM286.1 102c15.7-19.1 26.2-45.5 23.3-71.9-22.1 1-48.8 14.8-64.6 32.5-14.2 15.8-26.7 42.9-23.3 68.7 24.4 1.9 48.9-10.2 64.6-29.3z';

export const PLAY_STORE_ICON_PATHS = [
  { fill: '#4285F4', d: 'M12 25c-3 4-5 10-5 18v426c0 8 2 14 5 18l1 1L240 256v-2l-227-230z' },
  { fill: '#FBBC05', d: 'M316 334l-76-78v-2l76-78 1 1 90 51c26 15 26 39 0 54l-90 51z' },
  { fill: '#EA4335', d: 'M241 256l-229 231c4 3 10 4 17 0l308-175-96-56z' },
  { fill: '#34A853', d: 'M241 256l96-56L30 25c-7-4-13-3-17 0l228 231z' },
];
