// Prüft, ob das Porträt auf gängigen Viewports die Headline überdeckt.
// Usage: node scripts/verify-hero.mjs
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import http from 'node:http';

const PORT = 4349;
const VIEWPORTS = [
  [1920, 1080, 'Desktop FHD'],
  [1600, 900, 'Laptop 16:9'],
  [1440, 900, 'MacBook Air'],
  [1366, 768, 'Laptop HD (häufigste)'],
  [1280, 720, 'Kleiner Laptop'],
  [1024, 768, 'iPad quer'],
  [834, 1112, 'iPad hoch'],
  [430, 932, 'iPhone Pro Max'],
  [390, 844, 'iPhone'],
  [375, 667, 'iPhone SE'],
];

const server = spawn('python', ['-m', 'http.server', String(PORT), '--directory', 'dist'], { stdio: 'ignore' });
await new Promise((res, rej) => {
  const t0 = Date.now();
  const go = () => {
    const r = http.get({ host: '127.0.0.1', port: PORT, timeout: 1500 }, (x) => { x.resume(); res(); });
    r.on('error', () => (Date.now() - t0 > 20000 ? rej(new Error('server timeout')) : setTimeout(go, 400)));
  };
  go();
});

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--hide-scrollbars'],
});
const rows = [];
try {
  for (const [w, h, label] of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h });
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1400));
    const m = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const img = [...document.images].find((i) => i.src.includes('portrait'));
      const hb = h1.getBoundingClientRect();
      const b = img.getBoundingClientRect();
      // object-contain + object-bottom: gezeichnetes Bild unten-zentriert im Kasten
      const scale = Math.min(b.width / img.naturalWidth, b.height / img.naturalHeight);
      const drawnH = img.naturalHeight * scale;
      const drawnW = img.naturalWidth * scale;
      const drawnTop = b.bottom - drawnH;
      // oberste ~9% des Bildes sind transparenter Rand (Crop-Script padTop)
      const visibleTop = drawnTop + drawnH * 0.09;
      return {
        headlineTop: Math.round(hb.top),
        headlineBottom: Math.round(hb.bottom),
        drawnTop: Math.round(drawnTop),
        drawnW: Math.round(drawnW),
        drawnH: Math.round(drawnH),
        visibleTop: Math.round(visibleTop),
        rawOverlap: Math.round(Math.max(0, hb.bottom - drawnTop)),
        visibleOverlap: Math.round(Math.max(0, hb.bottom - visibleTop)),
        headlineH: Math.round(hb.height),
        belowFold: Math.round(b.bottom - window.innerHeight),
      };
    });
    const pct = Math.round((m.visibleOverlap / m.headlineH) * 100);
    rows.push({ viewport: `${w}x${h}`, label, headSize: `${m.drawnW}x${m.drawnH}`, visibleOverlapPx: m.visibleOverlap, pctOfHeadline: pct, verdict: pct > 25 ? 'PROBLEM' : pct > 0 ? 'leicht' : 'ok' });
    await page.close();
  }
  console.table(rows);
  const bad = rows.filter((r) => r.verdict === 'PROBLEM');
  console.log(bad.length ? `FAIL: ${bad.length} Viewport(s) mit Überdeckung` : 'PASS: Headline überall lesbar');
} finally {
  await browser.close();
  server.kill();
}
