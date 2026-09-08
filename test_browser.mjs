import puppeteer from 'puppeteer';

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER ${msg.type().toUpperCase()}]:`, msg.text());
  });

  page.on('pageerror', err => {
    console.log('PAGE EXCEPTION:', err.toString());
  });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  
  console.log('Logging in...');
  await page.type('#auth-email', 'n.tercero@pragma.com');
  await page.type('#auth-password', 'test1234');
  await page.click('button[type="submit"]');
  
  console.log('Waiting for board to load...');
  await new Promise(r => setTimeout(r, 6000));
  
  const html = await page.content();
  console.log('HTML length:', html.length);
  if (html.length < 1000) console.log(html);

  await page.screenshot({ path: 'C:/Users/NicolasTercero/.gemini/antigravity/brain/9435b335-dd68-46a3-a53c-6bbd68eccf2a/screenshot_live.png' });
  
  console.log('Closing...');
  await browser.close();
})();
