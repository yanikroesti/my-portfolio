import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import http from 'node:http';

const ROOT = 'C:/Users/yanik/Documents/claude_code/yanik-portfolio';
const OUT = 'C:/Users/yanik/AppData/Local/Temp/claude/C--Users-yanik-Documents-Obsidian-Vault/ed88e05d-e93b-4c45-a6e0-0cab5d68bc4c/scratchpad';
const PORT = 4342;

const server = spawn('python', ['-m', 'http.server', String(PORT), '--directory', `${ROOT}/dist`], { stdio: 'ignore' });
await new Promise((res, rej) => {
  const t0 = Date.now();
  const go = () => {
    const r = http.get({ host: '127.0.0.1', port: PORT, timeout: 1500 }, (x) => { x.resume(); res(); });
    r.on('error', () => (Date.now() - t0 > 20000 ? rej(new Error('timeout')) : setTimeout(go, 400)));
  };
  go();
});

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--hide-scrollbars'],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const externalHosts = new Set();
  const pageErrors = [];
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (u.hostname !== '127.0.0.1') externalHosts.add(u.hostname);
  });
  page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 150)));

  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 1500));

  const info = await page.evaluate(() => ({
    liveLinks: [...document.querySelectorAll('a')]
      .filter((a) => a.textContent.trim() === 'Zur Website')
      .map((a) => a.href),
    baldOnline: [...document.querySelectorAll('span')].filter((s) => s.textContent.trim() === 'Bald online').length,
    categories: [...document.querySelectorAll('h3')].map((h) => h.previousElementSibling?.textContent).filter(Boolean),
  }));

  await page.evaluate(() => document.getElementById('contact').scrollIntoView());
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: `${OUT}/verify-contact.png` });

  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Impressum');
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  const impressumOpen = await page.evaluate(() => document.querySelector('[role="dialog"]')?.textContent.includes('Yanik Rösti') ?? false);
  await page.screenshot({ path: `${OUT}/verify-impressum.png` });
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 400));

  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Datenschutz');
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  const dsOpen = await page.evaluate(() => document.querySelector('[role="dialog"]')?.textContent.includes('Datenschutzerklärung') ?? false);
  const dialogClosesOnEsc = await page.evaluate(() => !!document.querySelector('[role="dialog"]'));

  console.log(JSON.stringify({ ...info, impressumOpen, dsOpen, dialogWasOpen: dialogClosesOnEsc, externalHosts: [...externalHosts], pageErrors }, null, 1));
} finally {
  await browser.close();
  server.kill();
}
