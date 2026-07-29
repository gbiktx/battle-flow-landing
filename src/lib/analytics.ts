declare global {
  interface Window {
    mixpanel?: {
      track: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.mixpanel?.track === 'function') {
    window.mixpanel.track(event, properties);
  }
}
