/**
 * Shared layout breakpoints.
 *
 * Keep these in sync with the matching media queries in
 * assets/css/components.css and assets/css/toc.css.
 */
export const SIDE_DOCK_QUERY =
  "(min-aspect-ratio: 4/3) and (min-width: 75rem), (horizontal-viewport-segments: 2)";

export const TOC_PIN_QUERY =
  "(min-width: 105rem) and (min-aspect-ratio: 4/3), (horizontal-viewport-segments: 2) and (min-width: 105rem)";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
