export const HEADER_SCROLL_THRESHOLD = 36;

export function normalizeRoutePath(location: string): string {
  return location.replace(/\/+$/, "") || "/";
}

export function isHomeTransparentHeader({
  location,
  scrollY,
  isOverlayOpen,
}: {
  location: string;
  scrollY: number;
  isOverlayOpen: boolean;
}): boolean {
  const path = normalizeRoutePath(location);
  if (path !== "/") return false;
  if (isOverlayOpen) return false;
  return scrollY <= HEADER_SCROLL_THRESHOLD;
}
