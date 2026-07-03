// Full extractor: match SVG box positions to JSON labels via spatial proximity
// The SVG has a page offset translate(9962 137), so real coords = svgX + 9962, svgY + 137
// The JSON shapes list is in the same order as they appear in the SVG

import { readFileSync } from 'fs';

const svg = readFileSync('c:/projects/makhlooq-main/chart/KHALAI CHARTING.svg', 'utf8');
const json = JSON.parse(readFileSync('c:/projects/makhlooq-main/chart/KHALAI CHARTING.json', 'utf8'));

// ─── All boxes with absolute canvas coords ──────────────────────────────────
// Page translate: (9962, 137)
const TX = 9962, TY = 137;

const boxRe = /d="M([-\d.]+) ([-\d.]+)a6 6[^"]*h([\d.]+)a6 6[^"]*v([\d.]+)[^"]*" stroke="[^"]*" stroke-width="2" fill="([^"]+)"/g;
const boxes = [];
let m;
while ((m = boxRe.exec(svg)) !== null) {
  const svgX = parseFloat(m[1]), svgY = parseFloat(m[2]);
  const w = parseFloat(m[3]) + 12, h = parseFloat(m[4]) + 12;
  boxes.push({
    svgX, svgY,
    absX: svgX + TX, absY: svgY + TY,
    cx: svgX + TX + w/2, cy: svgY + TY + h/2,
    w, h,
    fill: m[5]
  });
}

// ─── JSON shapes in order (same order as SVG boxes) ─────────────────────────
// The SVG and JSON shapes are in the SAME ORDER (Lucidchart exports them that way)
const shapes = json.pages[0].items.shapes.filter(s => 
  ['ProcessBlock','DecisionBlock'].includes(s.class)
);
const lines = json.pages[0].items.lines;

// ─── Match boxes to shapes by index (they should align 1:1) ────────────────
// First verify count
console.log('SVG boxes:', boxes.length);
console.log('JSON ProcessBlock/DecisionBlock shapes:', shapes.length);

// Try matching by index
// Sort boxes by (y, x) - same order Lucidchart renders
const sortedBoxes = [...boxes].sort((a, b) => a.svgY - b.svgY || a.svgX - b.svgX);

// Filter shapes that actually have visible text (skip MinimalTextBlock etc.)
// From JSON we only want ProcessBlock and DecisionBlock shapes
// Let's match by order of appearance in JSON shapes list:

const allShapes = json.pages[0].items.shapes;
const processShapes = allShapes.filter(s => 
  ['ProcessBlock','DecisionBlock'].includes(s.class)
);

// Both should be 84 items
console.log('\nMatching by index:');
const result = [];
for (let i = 0; i < Math.min(sortedBoxes.length, processShapes.length); i++) {
  const box = sortedBoxes[i];
  const shape = processShapes[i];
  const label = shape.textAreas?.[0]?.text?.trim() || '';
  result.push({
    id: shape.id,
    label,
    x: Math.round(box.cx),
    y: Math.round(box.cy),
    w: Math.round(box.w),
    h: Math.round(box.h),
    fill: box.fill,
    svgX: Math.round(box.svgX),
    svgY: Math.round(box.svgY),
  });
}

// Print all for verification
result.forEach(r => {
  console.log(`  [${r.fill}] (${r.x}, ${r.y}) "${r.label.replace(/\n/g,'|')}"`);
});

// ─── Build edge connections ─────────────────────────────────────────────────
console.log('\nEdges (from JSON lines):');
const idToNode = {};
result.forEach(r => { idToNode[r.id] = r; });

// Note: JSON shapes may not perfectly align positionally with SVG boxes
// Let's also try direct JSON shape ordering match differently
// Actually, let's get ALL shapes (including MinimalText) to see if count matches SVG

const allNonDivider = allShapes.filter(s => s.class !== 'DividerBlock');
console.log('\nAll non-divider shapes:', allNonDivider.length);
console.log('Just ProcessBlock:', allShapes.filter(s => s.class === 'ProcessBlock').length);
console.log('SparkRectangle:', allShapes.filter(s => s.class === 'SparkRectangleBlock').length);
console.log('MinimalText:', allShapes.filter(s => s.class === 'MinimalTextBlock').length);
console.log('DecisionBlock:', allShapes.filter(s => s.class === 'DecisionBlock').length);
console.log('DefaultSquare:', allShapes.filter(s => s.class === 'DefaultSquareBlock').length);

// 84 SVG boxes = ProcessBlock (most) + SparkRectangleBlock + DecisionBlock
const svgShapes = allShapes.filter(s => !['DividerBlock','MinimalTextBlock'].includes(s.class));
console.log('\nSVG-visible shapes (no divider/minimal):', svgShapes.length);

// Try matching: sort svgShapes by appearance order in SVG
// The SVG renders shapes in the order they appear in JSON page items
// So match boxes (in SVG document order) to shapes (in JSON order)

// Get SVG document-order boxes (not sorted by position)
const boxesInDocOrder = [];
const boxRe2 = /d="M([-\d.]+) ([-\d.]+)a6 6[^"]*h([\d.]+)a6 6[^"]*v([\d.]+)[^"]*" stroke="[^"]*" stroke-width="2" fill="([^"]+)"/g;
let m2;
while ((m2 = boxRe2.exec(svg)) !== null) {
  const svgX = parseFloat(m2[1]), svgY = parseFloat(m2[2]);
  const w = parseFloat(m2[3]) + 12, h = parseFloat(m2[4]) + 12;
  boxesInDocOrder.push({
    absX: svgX + TX, absY: svgY + TY,
    cx: Math.round(svgX + TX + w/2), cy: Math.round(svgY + TY + h/2),
    w: Math.round(w), h: Math.round(h), fill: m2[5]
  });
}
console.log('\nDoc-order boxes:', boxesInDocOrder.length);
console.log('\nFinal match (doc order):');
const final = [];
for (let i = 0; i < Math.min(boxesInDocOrder.length, svgShapes.length); i++) {
  const box = boxesInDocOrder[i];
  const shape = svgShapes[i];
  const label = (shape.textAreas?.[0]?.text || '').trim().replace(/\n/g, '|');
  final.push({ id: shape.id, label, ...box, fill: box.fill });
  console.log(`  [${box.fill}] (${box.cx}, ${box.cy}) => "${label}"`);
}
