// Captures fresh screenshots of Yanik's real projects for the portfolio cards.
// Rerun any time a project changes: node scripts/capture-projects.mjs
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'projects');
mkdirSync(OUT_DIR, { recursive: true });

const VITALCARE_DIR = 'C:/Users/yanik/Documents/Claude_code/swiss-vitalcare';

const SERVERS = [
  {
    name: 'beauty',
    port: 4323,
    cmd: 'python',
    args: ['-m', 'http.server', '4323', '--directory', 'C:/Users/yanik/Documents/Obsidian Vault/claudecode/beauty_&_co/website'],
  },
  {
    name: 'cham',
    port: 4327,
    cmd: 'python',
    args: ['-m', 'http.server', '4327', '--directory', 'C:/Users/yanik/Documents/Obsidian Vault/claudecode/Cham-Cafe/walkthrough-site'],
  },
  {
    name: 'vitalcare',
    port: 4330,
    cmd: process.execPath,
    args: [join(VITALCARE_DIR, 'node_modules/astro/astro.js'), 'dev', '--port', '4330', '--host', '127.0.0.1'],
    cwd: VITALCARE_DIR,
  },
];

const DESKTOP = { width: 1280, height: 800 };
const MOBILE = { width: 430, height: 900, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

const SHOTS = [
  {
    url: 'http://localhost:4323/',
    tiles: [
      { file: 'beauty-1.jpg', vp: DESKTOP, scroll: 0 },
      { file: 'beauty-2.jpg', vp: DESKTOP, scroll: 0.45 },
      { file: 'beauty-3.jpg', vp: MOBILE, scroll: 0 },
    ],
  },
  {
    url: 'http://localhost:4330/',
    reducedMotion: true,
    tiles: [
      { file: 'vitalcare-1.jpg', vp: DESKTOP, scroll: 0 },
      { file: 'vitalcare-2.jpg', vp: DESKTOP, scroll: 0.4 },
      { file: 'vitalcare-3.jpg', vp: MOBILE, scroll: 0 },
    ],
  },
  {
    url: 'http://localhost:4327/',
    tiles: [
      { file: 'cham-1.jpg', vp: DESKTOP, scroll: 0.35 },
      { file: 'cham-2.jpg', vp: DESKTOP, scroll: 0.65 },
      { file: 'cham-3.jpg', vp: MOBILE, scroll: 0, settle: 4000 },
    ],
  },
];

function waitForPort(port, timeoutMs = 90000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const req = http.get({ host: '127.0.0.1', port, timeout: 2000 }, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', retry);
      req.on('timeout', () => { req.destroy(); retry(); });
    };
    const retry = () => {
      if (Date.now() - started > timeoutMs) return reject(new Error(`port ${port} never came up`));
      setTimeout(tryOnce, 700);
    };
    tryOnce();
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const procs = [];
try {
  for (const s of SERVERS) {
    const p = spawn(s.cmd, s.args, { cwd: s.cwd, stdio: 'ignore' });
    procs.push(p);
    console.log(`started ${s.name} (pid ${p.pid})`);
  }
  await Promise.all(SERVERS.map((s) => waitForPort(s.port)));
  console.log('all servers up');

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--hide-scrollbars', '--mute-audio'],
  });

  for (const site of SHOTS) {
    for (const tile of site.tiles) {
      const page = await browser.newPage();
      if (site.reducedMotion) {
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      }
      await page.setViewport(tile.vp);
      try {
        await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 30000 });
      } catch {
        console.log(`networkidle timeout on ${site.url} — continuing`);
      }
      await sleep(1200);
      if (tile.scroll > 0) {
        await page.evaluate((f) => {
          window.scrollTo(0, (document.documentElement.scrollHeight - window.innerHeight) * f);
        }, tile.scroll);
        await sleep(1800);
      }
      await sleep(tile.settle ?? 0);
      await page.screenshot({ path: join(OUT_DIR, tile.file), type: 'jpeg', quality: 85 });
      console.log(`captured ${tile.file}`);
      await page.close();
    }
  }
  await browser.close();
  console.log('ALL CAPTURES DONE');
} finally {
  for (const p of procs) {
    try { p.kill(); } catch { /* already dead */ }
  }
}
