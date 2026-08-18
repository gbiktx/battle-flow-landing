import React from 'react';
import {
  APP_STORE_ICON_PATH,
  PLAY_STORE_ICON_PATHS,
  STORE_BUTTON_ALIGNMENTS,
  STORE_BUTTON_SIZES,
  storeButtonClass,
  storeButtonRowClass,
  type StoreButtonSize,
} from '../lib/store-buttons';
import { getAppStoreUrl, getPlayStoreUrl } from '../lib/store-links';

export interface StoreCtaButtonsProps {
  /** Mixpanel `Placement` dimension; also the store campaign token. */
  placement: string;
  iosPrefix: string;
  androidPrefix: string;
  size?: StoreButtonSize;
}

/**
 * React twin of StoreButtons.astro — an Astro component can't render inside a
 * hydrated island. Styling and icons come from lib/store-buttons so the two
 * renderers can't drift apart.
 *
 * The `data-placement` attribute is what the inline Mixpanel bootstrap in
 * Layout.astro reads when it tags the `Store Click`; a button rendered without
 * it reports `Placement: unknown`.
 */
export default function StoreCtaButtons({
  placement,
  iosPrefix,
  androidPrefix,
  size = 'compact',
}: StoreCtaButtonsProps) {
  const style = STORE_BUTTON_SIZES[size];
  const buttonClass = storeButtonClass(style);
  const stores = [
    {
      label: 'App Store',
      prefix: iosPrefix,
      href: getAppStoreUrl(placement),
      icon: (
        <svg viewBox="0 0 384 512" className={`${style.icon} fill-white transition-transform group-hover:scale-110`} aria-hidden="true">
          <path d={APP_STORE_ICON_PATH} />
        </svg>
      ),
    },
    {
      label: 'Google Play',
      prefix: androidPrefix,
      href: getPlayStoreUrl(placement),
      icon: (
        <svg viewBox="0 0 512 512" className={`${style.icon} transition-transform group-hover:scale-110`} aria-hidden="true">
          {PLAY_STORE_ICON_PATHS.map((p) => (
            <path key={p.fill} fill={p.fill} d={p.d} />
          ))}
        </svg>
      ),
    },
  ];

  return (
    <div className={storeButtonRowClass(style, STORE_BUTTON_ALIGNMENTS.center)}>
      {stores.map((store) => (
        <a key={store.label} href={store.href} data-placement={placement} target="_blank" rel="noopener" className={buttonClass}>
          <div className={`${style.iconBox} flex-shrink-0 flex items-center justify-center`}>{store.icon}</div>
          <div className="flex flex-col items-start leading-none text-left">
            <span className={`${style.prefix} ${style.prefixMargin} font-bold text-gray-400 uppercase tracking-wider`}>{store.prefix}</span>
            <span className={`${style.label} font-black text-white tracking-tight uppercase whitespace-nowrap`}>{store.label}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
