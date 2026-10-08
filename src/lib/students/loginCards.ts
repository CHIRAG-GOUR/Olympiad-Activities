"use client";

/**
 * Printable login cards: eight per A4 page, cut along the dashed lines and hand one to
 * each student. Built as a standalone page in a new window so printing it prints only
 * the cards.
 */

export interface LoginCard {
  name: string;
  email: string;
  password: string;
  grade: number;
  section: string;
  studentCode: string;
  schoolName?: string;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export function loginCardsHtml(cards: LoginCard[], portalUrl: string): string {
  const items = cards
    .map(
      (c) => `
    <div class="card">
      <div class="head">
        <img src="${esc(portalUrl.replace(/\/login$/, ""))}/assets/olympiad-icon.png" alt="" />
        <div><div class="brand">Olympiad Dashboard</div><div class="sub">Student login card</div></div>
        <div class="cls">Class ${c.grade}${c.section ? `-${esc(c.section)}` : ""}</div>
      </div>
      <div class="name">${esc(c.name)}</div>
      ${c.schoolName ? `<div class="school">${esc(c.schoolName)}</div>` : ""}
      <table>
        <tr><td>Student ID</td><td class="mono">${esc(c.studentCode)}</td></tr>
        <tr><td>Email</td><td class="mono">${esc(c.email)}</td></tr>
        <tr><td>Password</td><td class="mono pw">${esc(c.password)}</td></tr>
      </table>
      <div class="foot">Sign in at <b>${esc(portalUrl)}</b> as Student. Keep this card private.</div>
    </div>`
    )
    .join("");

  return `<!doctype html><html><head><meta charset="utf-8"><title>Student login cards</title>
<style>
  @page { size: A4; margin: 10mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #182338; }
  .bar { padding: 12px 16px; background: #EAF2FC; border-bottom: 1px solid #C9DCF3; font-size: 13px; display: flex; gap: 12px; align-items: center; }
  .bar button { background: #2468B2; color: #fff; border: 0; border-radius: 8px; padding: 8px 14px; font-weight: 700; cursor: pointer; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; padding: 8px; }
  .card { border: 1.5px dashed #98A2B3; padding: 12px 14px; height: 66mm; overflow: hidden; break-inside: avoid; }
  .head { display: flex; align-items: center; gap: 8px; border-bottom: 2px solid #2468B2; padding-bottom: 6px; }
  .head img { width: 26px; height: 26px; border-radius: 7px; }
  .brand { font-weight: 900; font-size: 13px; }
  .sub { font-size: 9.5px; color: #667085; text-transform: uppercase; letter-spacing: .6px; font-weight: 700; }
  .cls { margin-left: auto; font-weight: 900; font-size: 12px; color: #2468B2; background: #EAF2FC; border-radius: 6px; padding: 2px 8px; }
  .name { font-size: 15px; font-weight: 800; margin-top: 8px; }
  .school { font-size: 10.5px; color: #667085; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 11.5px; }
  td { padding: 3px 0; vertical-align: top; }
  td:first-child { color: #667085; width: 74px; font-weight: 600; }
  .mono { font-family: Consolas, "Courier New", monospace; font-weight: 700; word-break: break-all; }
  .pw { font-size: 14px; letter-spacing: .5px; }
  .foot { font-size: 9.5px; color: #667085; margin-top: 6px; }
  @media print { .bar { display: none; } .grid { padding: 0; } }
</style></head><body>
<div class="bar"><button onclick="window.print()">Print cards</button><span>${cards.length} card${cards.length === 1 ? "" : "s"}. Passwords are shown only here and are not stored, so print or save this page now.</span></div>
<div class="grid">${items}</div>
</body></html>`;
}

/** Opens the cards in a new tab ready to print. Returns false if the browser blocked the tab. */
export function openLoginCards(cards: LoginCard[], portalUrl: string): boolean {
  const w = window.open("", "_blank");
  if (!w) return false;
  w.document.open();
  w.document.write(loginCardsHtml(cards, portalUrl));
  w.document.close();
  return true;
}
