// Run with: node prerender.js
// Copies the project cards from index.html's script into the static HTML so search engines can read them.
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/)[1];
let cards = '';
const mk = id => ({
  set innerHTML(v) { if (id === 'cards') cards = v; },
  get innerHTML() { return ''; },
  hidden: false,
  querySelector: () => ({ focus() {} }),
  scrollIntoView() {}
});
new Function('document', 'location', 'addEventListener', 'scrollTo', script)(
  { getElementById: mk, title: '' }, { hash: '' }, () => {}, () => {}
);
const out = html.replace(/<!--cards:start-->[\s\S]*?<!--cards:end-->/, () => `<!--cards:start-->\n${cards}\n<!--cards:end-->`);
fs.writeFileSync('index.html', out);
console.log('Pre-rendered', (cards.match(/<article/g) || []).length, 'cards');
