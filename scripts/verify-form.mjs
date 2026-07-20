// Verifies the contact form end-to-end against a built dist/.
// Usage: node scripts/verify-form.mjs <fallback|success|error>
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import http from 'node:http';

const scenario = process.argv[2] || 'fallback';
const PORT = 4348;

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
const out = { scenario };
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });
  await page.setRequestInterception(true);

  const seen = { web3forms: false, mailto: false };
  page.on('request', (req) => {
    const url = req.url();
    if (url.startsWith('mailto:')) {
      seen.mailto = true;
      return req.abort();
    }
    if (url.includes('api.web3forms.com')) {
      seen.web3forms = true;
      if (scenario === 'success') {
        return req.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, message: 'ok' }) });
      }
      if (scenario === 'error') {
        return req.respond({ status: 400, contentType: 'application/json', body: JSON.stringify({ success: false, message: 'bad key' }) });
      }
    }
    return req.continue();
  });

  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {});
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    document.getElementById('contact').scrollIntoView();
  });
  await new Promise((r) => setTimeout(r, 800));

  // HTML5 required check: try submit with empty name first
  out.honeypotHidden = await page.evaluate(() => {
    const cb = document.querySelector('input[name=botcheck]');
    return cb ? cb.offsetParent === null : 'missing';
  });
  out.requiredOnName = await page.$eval('input[name=name]', (el) => el.required);

  await page.type('input[name=name]', 'Testperson AG');
  await page.select('select[name=betrieb]', 'Handwerk');
  await page.select('select[name=gesucht]', 'Neue Website');
  await page.type('textarea[name=nachricht]', 'Bitte um eine Offerte für eine neue Website.');

  await page.click('button[type=submit]');
  await new Promise((r) => setTimeout(r, 1200));

  out.state = await page.evaluate(() => {
    const success = [...document.querySelectorAll('p')].some((p) => p.textContent.includes('Merci'));
    const error = !!document.querySelector('[role=alert]');
    const nameInput = document.querySelector('input[name=name]');
    return { successShown: success, errorShown: error, nameRetained: nameInput ? nameInput.value : null };
  });
  out.hitWeb3forms = seen.web3forms;
  out.hitMailto = seen.mailto;

  console.log(JSON.stringify(out, null, 1));
} finally {
  await browser.close();
  server.kill();
}
