import { useEffect } from "react";
import { useTheme } from "@/components/theme-provider";

const SVG_NS = "http://www.w3.org/2000/svg";

// Only Chromium renders SVG filters inside `backdrop-filter`. Safari and Firefox
// accept the syntax but draw nothing, so they keep the plain frosted glass.
const canRefract = () =>
  !!(navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands.some(
    (b) => b.brand === "Chromium"
  );

/**
 * A displacement map for a rounded rect. The red channel ramps left to right and
 * blue top to bottom; a blurred mid-grey rect covers the middle so only a band
 * along the edges moves. That band is what bends the content behind the glass,
 * like the thick rim of a lens.
 */
const displacementMap = (w: number, h: number, r: number, edge: number) => {
  const svg = `<svg xmlns="${SVG_NS}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
<linearGradient id="x" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#f00"/></linearGradient>
<linearGradient id="y" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#00f"/></linearGradient>
<filter id="b"><feGaussianBlur stdDeviation="${edge / 2}"/></filter>
</defs>
<rect width="${w}" height="${h}" fill="#000"/>
<rect width="${w}" height="${h}" rx="${r}" fill="url(#x)"/>
<rect width="${w}" height="${h}" rx="${r}" fill="url(#y)" style="mix-blend-mode:screen"/>
<rect x="${edge}" y="${edge}" width="${w - edge * 2}" height="${h - edge * 2}" rx="${Math.max(r - edge, 0)}" fill="#808080" filter="url(#b)"/>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const buildFilter = (filter: SVGFilterElement, el: HTMLElement) => {
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  if (!w || !h) return;

  const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
  const edge = Math.min(22, Math.max(6, Math.min(w, h) * 0.2));

  for (const [k, v] of Object.entries({ x: 0, y: 0, width: w, height: h })) filter.setAttribute(k, String(v));

  const map = document.createElementNS(SVG_NS, "feImage");
  map.setAttribute("href", displacementMap(w, h, radius, edge));
  map.setAttribute("x", "0");
  map.setAttribute("y", "0");
  map.setAttribute("width", String(w));
  map.setAttribute("height", String(h));
  map.setAttribute("preserveAspectRatio", "none");
  map.setAttribute("result", "map");

  // A negative scale pulls from inside the glass toward the rim, so the edge
  // magnifies what is under it instead of sampling past the element's bounds.
  const displace = document.createElementNS(SVG_NS, "feDisplacementMap");
  displace.setAttribute("in", "SourceGraphic");
  displace.setAttribute("in2", "map");
  displace.setAttribute("scale", String(-edge * 1.4));
  displace.setAttribute("xChannelSelector", "R");
  displace.setAttribute("yChannelSelector", "B");

  filter.replaceChildren(map, displace);
};

/** Adds edge refraction to every `.liquid-glass` surface while the fun theme is on. */
export function LiquidGlass() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme !== "fun" || !canRefract()) return;
    if (window.matchMedia("(prefers-reduced-transparency: reduce)").matches) return;

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText = "position:absolute;width:0;height:0;pointer-events:none";
    document.body.appendChild(svg);

    const tracked = new Map<HTMLElement, { filter: SVGFilterElement; observer: ResizeObserver }>();
    let count = 0;

    const attach = (el: HTMLElement) => {
      const id = `liquid-glass-${count++}`;
      const filter = document.createElementNS(SVG_NS, "filter");
      filter.id = id;
      filter.setAttribute("filterUnits", "userSpaceOnUse");
      filter.setAttribute("primitiveUnits", "userSpaceOnUse");
      filter.setAttribute("color-interpolation-filters", "sRGB");
      svg.appendChild(filter);

      const observer = new ResizeObserver(() => buildFilter(filter, el));
      observer.observe(el);

      const frost = getComputedStyle(el).getPropertyValue("--lg-frost").trim() || "2px";
      el.style.backdropFilter = `url(#${id}) blur(${frost}) saturate(180%) brightness(1.05)`;
      tracked.set(el, { filter, observer });
    };

    const detach = (el: HTMLElement) => {
      const entry = tracked.get(el);
      if (!entry) return;
      entry.observer.disconnect();
      entry.filter.remove();
      el.style.backdropFilter = "";
      tracked.delete(el);
    };

    // Menus and dialogs mount into portals, so watch the whole body for glass
    // coming and going. Batched to one scan per frame.
    let frame = 0;
    const scan = () => {
      frame = 0;
      for (const el of tracked.keys()) if (!el.isConnected) detach(el);
      document.querySelectorAll<HTMLElement>(".liquid-glass").forEach((el) => {
        if (!tracked.has(el)) attach(el);
      });
    };
    scan();

    const mutations = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(scan);
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      cancelAnimationFrame(frame);
      for (const el of [...tracked.keys()]) detach(el);
      svg.remove();
    };
  }, [resolvedTheme]);

  return null;
}
