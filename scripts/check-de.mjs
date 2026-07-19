// Quick German-version smoke check: serves dist/, measures heading overflow
// at three viewports, dumps visible texts and hero screenshots.
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.argv[2] ?? root;
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 4339;

const server = spawn('python', ['-m', 'http.server', String(PORT), '--directory', join(root, 'dist')], { stdio: 'ignore' });

await new Promise((resolve, reject) => {
  const started = Date.now();
  const tryOnce = () => {
    const req = http.get({ host: '127.0.0.1', port: PORT, timeout: 1500 }, (res) => { res.resume(); resolve(); });
    req.on('error', retry);
    req.on('timeout', () => { req.destroy(); retry(); });
  };
  const retry = () => Date.now() - started > 30000 ? reject(new Error('server timeout')) : setTimeout(tryOnce, 500);
  tryOnce();
});

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars'] });
try {
  const results = [];
  for (const vp of [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 },
  ]) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 120)));
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 1500));
    const info = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return {
        heading: h1?.textContent,
        overflowPx: h1 ? Math.round(h1.scrollWidth - document.documentElement.clientWidth) : null,
        title: document.title,
        lang: document.documentElement.lang,
        nav: [...document.querySelectorAll('nav a')].map((a) => a.textContent).join(' | '),
        h2s: [...document.querySelectorAll('h2')].map((h) => h.textContent).join(' | '),
      };
    });
    results.push({ vp: `${vp.name} ${vp.width}px`, ...info, pageErrors: errors });
    if (vp.name !== 'tablet') {
      await page.screenshot({ path: join(OUT, `check-${vp.name}.png`) });
    }
    await page.close();
  }
  console.log(JSON.stringify(results, null, 1));
} finally {
  await browser.close();
  server.kill();
}
