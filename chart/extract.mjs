import { readFileSync } from 'fs';

const json = JSON.parse(readFileSync('c:/projects/makhlooq-main/chart/KHALAI CHARTING.json','utf8'));
const page = json.pages[0];

console.log('Page title:', page.title);

const shapes = page.items.shapes;
const lines = page.items.lines;

// Print all shapes grouped by class
const byClass = {};
shapes.forEach(s => {
  const label = (s.textAreas || []).map(t => t.text?.trim()).filter(Boolean).join(' | ');
  if (!byClass[s.class]) byClass[s.class] = [];
  byClass[s.class].push({ id: s.id, label });
});

Object.entries(byClass).forEach(([cls, items]) => {
  console.log(`\n=== ${cls} (${items.length}) ===`);
  items.forEach(i => {
    if (i.label) console.log(`  [${i.id}] "${i.label}"`);
  });
});

// Print lines
console.log(`\n=== LINES (${lines.length}) ===`);
lines.slice(0, 30).forEach(l => {
  console.log(`  ${l.endpoint1?.connectedTo} --> ${l.endpoint2?.connectedTo}`);
});
