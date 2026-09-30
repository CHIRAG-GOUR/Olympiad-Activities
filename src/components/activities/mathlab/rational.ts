/**
 * Exact arithmetic for the maths kit. Every value a student builds is kept as a fraction
 * p/q, so 0.5 ÷ 0.05 + 0.05 ÷ 0.5 is exactly 101/10 and compares cleanly with the printed
 * option "10.1", and 7/24 compares with "7/24".
 */

export type Q = { p: number; q: number };

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

export function norm(p: number, q: number): Q {
  if (q === 0) return { p: NaN, q: 0 };
  if (q < 0) {
    p = -p;
    q = -q;
  }
  const g = gcd(Math.round(p), Math.round(q)) || 1;
  return { p: Math.round(p) / g, q: Math.round(q) / g };
}

export const add = (a: Q, b: Q) => norm(a.p * b.q + b.p * a.q, a.q * b.q);
export const sub = (a: Q, b: Q) => norm(a.p * b.q - b.p * a.q, a.q * b.q);
export const mul = (a: Q, b: Q) => norm(a.p * b.p, a.q * b.q);
export const div = (a: Q, b: Q) => (b.p === 0 ? { p: NaN, q: 0 } : norm(a.p * b.q, a.q * b.p));
export const isValid = (a: Q) => Number.isFinite(a.p) && a.q !== 0;
export const eq = (a: Q, b: Q) => isValid(a) && isValid(b) && a.p === b.p && a.q === b.q;
export const toNumber = (a: Q) => a.p / a.q;

/** Parses "12", "-3", "0.05", "3/4", "2 1/3", "1,529,184,780", "₹ 58.50", "12 m". */
export function parseQ(raw: string): Q | null {
  const t = raw.replace(/₹/g, "").replace(/(\d),(?=\d)/g, "$1").replace(/[−–]/g, "-").trim();
  const mixed = t.match(/^(-?\d+)\s+(\d+)\/(\d+)/);
  if (mixed) {
    const w = Number(mixed[1]);
    const f = norm(Number(mixed[2]), Number(mixed[3]));
    return w < 0 ? sub({ p: w, q: 1 }, f) : add({ p: w, q: 1 }, f);
  }
  const frac = t.match(/^(-?\d+)\s*\/\s*(\d+)/);
  if (frac) return norm(Number(frac[1]), Number(frac[2]));
  const dec = t.match(/^(-?)(\d*)\.(\d+)/);
  if (dec) {
    const digits = dec[3].length;
    const whole = Number(`${dec[2] || "0"}${dec[3]}`);
    return norm((dec[1] ? -1 : 1) * whole, 10 ** digits);
  }
  const int = t.match(/^-?\d+/);
  return int ? { p: Number(int[0]), q: 1 } : null;
}

/** The first number in an option text such as "₹ 1,529,184,780" or "7/24 of a day". */
export function optionQ(text: string): Q | null {
  const cleaned = text.replace(/₹\s*/g, "").replace(/(\d),(?=\d{2,3}\b)/g, "$1").replace(/[−–]/g, "-");
  const m = cleaned.match(/-?\d+\s+\d+\/\d+|-?\d+\s*\/\s*\d+|-?\d*\.\d+|-?\d+/);
  return m ? parseQ(m[0]) : null;
}

/** Shows a value the way the paper would: integers plainly, short decimals as decimals, otherwise a fraction. */
export function show(a: Q): string {
  if (!isValid(a)) return "undefined";
  if (a.q === 1) return a.p.toLocaleString("en-IN");
  let q = a.q;
  let twos = 0;
  let fives = 0;
  while (q % 2 === 0) {
    q /= 2;
    twos++;
  }
  while (q % 5 === 0) {
    q /= 5;
    fives++;
  }
  const places = Math.max(twos, fives);
  if (q === 1 && places <= 4) return (a.p / a.q).toFixed(places).replace(/\.?0+$/, "");
  return `${a.p}/${a.q}`;
}

/* ── expression evaluation (standard precedence, brackets) ──────────── */

export type Token = { t: "num"; v: string } | { t: "op"; v: "+" | "−" | "×" | "÷" } | { t: "(" } | { t: ")" };

/** Evaluates a token list. Returns null while the expression is incomplete or malformed. */
export function evaluate(tokens: Token[]): Q | null {
  let i = 0;
  const peek = () => tokens[i];
  const expr = (): Q | null => {
    let left = term();
    while (left && peek()?.t === "op" && ((peek() as { v: string }).v === "+" || (peek() as { v: string }).v === "−")) {
      const op = (tokens[i++] as { v: string }).v;
      const right = term();
      if (!right) return null;
      left = op === "+" ? add(left, right) : sub(left, right);
    }
    return left;
  };
  const term = (): Q | null => {
    let left = factor();
    while (left && peek()?.t === "op" && ((peek() as { v: string }).v === "×" || (peek() as { v: string }).v === "÷")) {
      const op = (tokens[i++] as { v: string }).v;
      const right = factor();
      if (!right) return null;
      left = op === "×" ? mul(left, right) : div(left, right);
    }
    return left;
  };
  const factor = (): Q | null => {
    const tk = tokens[i];
    if (!tk) return null;
    if (tk.t === "op" && tk.v === "−") {
      i++;
      const f = factor();
      return f ? sub({ p: 0, q: 1 }, f) : null;
    }
    if (tk.t === "num") {
      i++;
      return parseQ(tk.v);
    }
    if (tk.t === "(") {
      i++;
      const v = expr();
      if (!v || tokens[i]?.t !== ")") return null;
      i++;
      return v;
    }
    return null;
  };
  const v = expr();
  return v && i === tokens.length ? v : null;
}
