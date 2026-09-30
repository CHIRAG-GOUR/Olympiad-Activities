import * as THREE from "three";

/* Canvas-drawn textures for the English worlds: no image downloads, cached per key. */

const cache = new Map<string, THREE.CanvasTexture>();

function make(key: string, w: number, h: number, draw: (x: CanvasRenderingContext2D, w: number, h: number) => void, repeat?: [number, number]) {
  if (typeof document === "undefined") return null;
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  cache.set(key, t);
  return t;
}

const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function shade(hex: string, k: number) {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, Math.min(1, Math.max(0, hsl.l + k)));
  return `#${c.getHexString()}`;
}

/** Wooden floorboards. */
export function planks(color = "#C9955E") {
  return make(`planks-${color}`, 512, 512, (x, w, h) => {
    const rows = 8;
    for (let r = 0; r < rows; r++) {
      const y = (r * h) / rows;
      let xo = (r % 2) * 128;
      for (let k = -1; k < 4; k++) {
        const xs = xo + k * 256;
        x.fillStyle = shade(color, (rnd(r * 9 + k) - 0.5) * 0.1);
        x.fillRect(xs, y, 256, h / rows);
        x.strokeStyle = shade(color, -0.12);
        x.lineWidth = 3;
        x.strokeRect(xs, y, 256, h / rows);
        for (let g = 0; g < 5; g++) {
          x.strokeStyle = `rgba(90,55,25,${0.06 + rnd(r * 31 + k * 7 + g) * 0.08})`;
          x.lineWidth = 1.5;
          x.beginPath();
          const gy = y + 8 + rnd(r + g * 3 + k) * (h / rows - 16);
          x.moveTo(xs, gy);
          x.bezierCurveTo(xs + 80, gy + 4, xs + 170, gy - 4, xs + 256, gy);
          x.stroke();
        }
      }
      xo += 0;
    }
  }, [3, 3]);
}

/** Soft speckled ground (grass, sand, stone) tinted from a base colour. */
export function speckle(color: string) {
  return make(`speck-${color}`, 512, 512, (x, w, h) => {
    x.fillStyle = color;
    x.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) {
      x.fillStyle = shade(color, (rnd(i) - 0.5) * 0.12);
      const s = 2 + rnd(i + 5) * 5;
      x.fillRect(rnd(i + 1) * w, rnd(i + 2) * h, s, s);
    }
  }, [24, 24]);
}

/** A vertical sky gradient for the dome. */
export function skyGradient(color: string) {
  return make(`sky-${color}`, 8, 256, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#4F9BE3");
    g.addColorStop(0.28, "#8EC3F2");
    g.addColorStop(0.47, color);
    g.addColorStop(1, color);
    x.fillStyle = g;
    x.fillRect(0, 0, w, h);
  });
}

/** A gently patterned wall (fine vertical texture). */
export function wallpaper(color: string) {
  return make(`wall-${color}`, 256, 256, (x, w, h) => {
    x.fillStyle = color;
    x.fillRect(0, 0, w, h);
    for (let i = 0; i < 16; i++) {
      x.fillStyle = shade(color, i % 2 ? -0.018 : 0.012);
      x.fillRect((i * w) / 16, 0, w / 16, h);
    }
  }, [10, 2]);
}
