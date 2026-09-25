/**
 * Client (screen) coordinates → the SVG's own viewBox units.
 *
 * Uses the element's screen transform, so it stays right when the SVG is letterboxed —
 * e.g. a square viewBox inside a wide box capped by `max-h-*`, where the drawing is
 * centred and scaled to the height, not stretched to the box.
 */
export function clientToSvg(svg: SVGSVGElement | null | undefined, clientX: number, clientY: number): { x: number; y: number } | null {
  const m = svg?.getScreenCTM();
  if (!m) return null;
  const p = new DOMPoint(clientX, clientY).matrixTransform(m.inverse());
  return { x: p.x, y: p.y };
}
