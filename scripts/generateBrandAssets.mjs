import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const assetsDir = path.resolve('public', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. Standalone Emblem SVG (128x128)
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2B74C7" />
      <stop offset="100%" stop-color="#1B5291" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#0B132B" flood-opacity="0.3" />
    </filter>
  </defs>
  <rect x="8" y="8" width="112" height="112" rx="28" fill="url(#blueGrad)" filter="url(#shadow)" />
  <rect x="8.5" y="8.5" width="111" height="111" rx="27.5" fill="none" stroke="#60A5FA" stroke-width="1.5" stroke-opacity="0.4" />
  <text x="64" y="74" text-anchor="middle" dominant-baseline="central" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="64">Ω</text>
</svg>`;

// 2. Full Horizontal Brand Lockup SVG (500x120)
const logoBannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 120" width="500" height="120">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B132B" />
      <stop offset="100%" stop-color="#182338" />
    </linearGradient>
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2B74C7" />
      <stop offset="100%" stop-color="#1B5291" />
    </linearGradient>
    <filter id="badgeShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.4" />
    </filter>
  </defs>
  <!-- Background Container -->
  <rect width="500" height="120" rx="16" fill="url(#bgGrad)" />
  <rect x="0.5" y="0.5" width="499" height="119" rx="15.5" fill="none" stroke="#2468B2" stroke-width="1" stroke-opacity="0.6" />
  
  <!-- Emblem Badge -->
  <g transform="translate(24, 20)">
    <rect width="80" height="80" rx="20" fill="url(#badgeGrad)" filter="url(#badgeShadow)" />
    <rect x="0.5" y="0.5" width="79" height="79" rx="19.5" fill="none" stroke="#93C5FD" stroke-width="1.5" stroke-opacity="0.5" />
    <text x="40" y="47" text-anchor="middle" dominant-baseline="central" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="46">Ω</text>
  </g>

  <!-- Typography -->
  <g transform="translate(124, 38)">
    <rect x="0" y="-8" width="168" height="18" rx="5" fill="#2468B2" fill-opacity="0.4" />
    <text x="8" y="5" fill="#90CAF9" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="800" letter-spacing="1.4">OFFICIAL EXAMINATION PLATFORM</text>
    
    <text x="0" y="34" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" letter-spacing="-0.5">Olympiad Dashboard</text>
    
    <text x="0" y="54" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500">Digital Examination &amp; Evaluation System</text>
  </g>
</svg>`;

// Write SVGs
fs.writeFileSync(path.join(assetsDir, 'olympiad-icon.svg'), iconSvg, 'utf8');
fs.writeFileSync(path.join(assetsDir, 'olympiad-logo.svg'), logoBannerSvg, 'utf8');

console.log('Brand SVG assets created.');

// Now render PNG versions using headless Edge
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

if (fs.existsSync(edgePath)) {
  const tempHtmlIcon = path.resolve('public', 'assets', 'temp_icon.html');
  const tempHtmlLogo = path.resolve('public', 'assets', 'temp_logo.html');

  fs.writeFileSync(tempHtmlIcon, `<!DOCTYPE html><html><body style="margin:0;padding:0;background:transparent;display:inline-block;">${iconSvg}</body></html>`);
  fs.writeFileSync(tempHtmlLogo, `<!DOCTYPE html><html><body style="margin:0;padding:0;background:transparent;display:inline-block;">${logoBannerSvg}</body></html>`);

  const iconPngPath = path.resolve('public', 'assets', 'olympiad-icon.png');
  const logoPngPath = path.resolve('public', 'assets', 'olympiad-logo.png');

  try {
    execSync(`"${edgePath}" --headless --disable-gpu --screenshot="${iconPngPath}" --window-size=128,128 "file://${tempHtmlIcon}"`, { stdio: 'inherit' });
    execSync(`"${edgePath}" --headless --disable-gpu --screenshot="${logoPngPath}" --window-size=500,120 "file://${tempHtmlLogo}"`, { stdio: 'inherit' });
    console.log('Brand PNG assets generated via headless Edge.');
  } catch (err) {
    console.warn('Failed to render PNG via Edge:', err);
  } finally {
    if (fs.existsSync(tempHtmlIcon)) fs.unlinkSync(tempHtmlIcon);
    if (fs.existsSync(tempHtmlLogo)) fs.unlinkSync(tempHtmlLogo);
  }
}
