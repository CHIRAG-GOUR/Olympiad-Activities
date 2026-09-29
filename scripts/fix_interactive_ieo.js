const fs = require('fs');
const path = require('path');

// 1. Update src/data/ieo_interactive_g6/index.ts
let code = fs.readFileSync('src/data/ieo_interactive_g6/index.ts', 'utf8');

code = code.replaceAll('export const IEO_G6_SETA_KEY', 'export const IEO_INTERACTIVE_G6_KEY');
code = code.replaceAll('IEO_G6_SETA_KEY', 'IEO_INTERACTIVE_G6_KEY');
code = code.replaceAll('export const IEO_G6_SETA_QUESTIONS', 'export const IEO_INTERACTIVE_G6_QUESTIONS');
code = code.replaceAll('IEO_G6_SETA_QUESTIONS', 'IEO_INTERACTIVE_G6_QUESTIONS');
code = code.replaceAll('export const IEO_G6_SETA_EXAM', 'export const IEO_INTERACTIVE_G6_EXAM');

code = code.replaceAll('id: `ieo_g6_seta_q${nn}`', 'id: `ieo_g6_interactive_q${nn}`');
code = code.replaceAll('questionId: `IEO-G6-SETA-Q${nn}`', 'questionId: `IEO-G6-INT-Q${nn}`');

code = code.replaceAll('id: "ieo-2024-25-class-6-set-a"', 'id: "ieo-class6-master-interactive"');
code = code.replaceAll('code: "IEO-2024-25-G6-SETA"', 'code: "IEO-G6-PRACTICE-2025"');
code = code.replaceAll('title: "SOF International English Olympiad 2024–25 (Class 6 - Set A)"', 'title: "IEO Class 6 — Interactive Master Edition (50 Quests)"');
code = code.replaceAll('subtitle: "Class 6 • Set A • Level 1 • 50 Bespoke Interactive English Missions"', 'subtitle: "Class 6 • Interactive Practice • 50 Bespoke 3D Quests & Grammar Lab"');
code = code.replaceAll('version: 1,', '');

fs.writeFileSync('src/data/ieo_interactive_g6/index.ts', code);
console.log('Fixed src/data/ieo_interactive_g6/index.ts');

// 2. Fix play.patch calls across all files in src/components/activities/ieo_interactive_g6-play/
const dir = 'src/components/activities/ieo_interactive_g6-play';
const files = fs.readdirSync(dir);

for (const f of files) {
  if (!f.endsWith('.tsx')) continue;
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');

  content = content.replace(/play\.patch\(\s*\(\s*prev\s*\)\s*=>\s*\(\{\s*\.\.\.prev,\s*([a-zA-Z0-9_]+:\s*[^}]+)\s*\}\)\s*\)/g, 'play.patch({ $1 })');
  content = content.replace(/play\.patch\(\s*\(\s*p\s*\)\s*=>\s*\(\{\s*\.\.\.p,\s*([a-zA-Z0-9_]+:\s*[^}]+)\s*\}\)\s*\)/g, 'play.patch({ $1 })');
  content = content.replace(/pose="surprised"/g, 'pose="standing" expression="surprised"');

  fs.writeFileSync(p, content);
}
console.log('Fixed all activity files in ieo_interactive_g6-play');

// 3. Update registry.tsx in ieo_interactive_g6-play
let reg = fs.readFileSync('src/components/activities/ieo_interactive_g6-play/registry.tsx', 'utf8');
reg = reg.replaceAll('IEO_G6_SETA_PLAY_ACTIVITY_MAP', 'IEO_INTERACTIVE_G6_PLAY_ACTIVITY_MAP');
reg = reg.replaceAll('ieo_g6_seta_q', 'ieo_g6_interactive_q');
reg = reg.replaceAll('IEO-G6-SETA-Q', 'IEO-G6-INT-Q');
fs.writeFileSync('src/components/activities/ieo_interactive_g6-play/registry.tsx', reg);
console.log('Fixed registry.tsx in ieo_interactive_g6-play');
