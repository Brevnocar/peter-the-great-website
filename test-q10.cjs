const { chromium } = require('playwright');

async function testQ10Only() {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  
  console.log('Opening quiz page...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.locator('#quiz').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.waitForSelector('text=Проверь свои знания о Петре I', { timeout: 10000 });
  
  // Navigate directly to question 10 by clicking the dot (motion.div with number 10)
  console.log('Navigating to question 10...');
  await page.click('text=10'); // Click the dot with "10"
  await page.waitForTimeout(500);
  
  // Verify we're on question 10
  const q10Text = await page.locator('text=В каком году Россия была провозглашена Империей').isVisible();
  console.log('On question 10:', q10Text);
  
  // Get initial answered count
  const initialCount = await page.locator('text=/\\d+ из 10 отвечено/').textContent();
  console.log('Initial answered count:', initialCount);
  
  // Test each option on Q10
  const buttons = page.locator('.glass-card >> button').filter({ hasText: /./ });
  const btnCount = await buttons.count();
  console.log(`Total buttons: ${btnCount}`);
  
  for (let opt = 0; opt < btnCount; opt++) {
    const btn = buttons.nth(opt);
    const text = await btn.textContent();
    console.log(`\n--- Testing option ${opt}: "${text.trim()}" ---`);
    
    // Click with mouse
    await btn.click({ force: true });
    await page.waitForTimeout(400);
    
    // Check if selected visually
    const className = await btn.getAttribute('class');
    const isSelected = className.includes('border-silver-400');
    console.log(`  Classes: ${className}`);
    console.log(`  Visually selected: ${isSelected}`);
    
    // Check answered count
    const countText = await page.locator('text=/\\d+ из 10 отвечено/').textContent();
    console.log(`  Answered counter: ${countText}`);
  }
  
  // Try clicking submit
  console.log('\n--- Testing Submit ---');
  const submitBtn = page.locator('button:has-text("Подтвердить ответы")');
  const submitVisible = await submitBtn.isVisible();
  const submitEnabled = await submitBtn.isEnabled();
  console.log(`Submit visible: ${submitVisible}, enabled: ${submitEnabled}`);
  
  await submitBtn.click({ force: true });
  await page.waitForTimeout(500);
  
  // Check results
  const scoreText = await page.locator('text=/\\d+ из 10/').first().textContent();
  console.log(`Score: ${scoreText}`);
  
  await browser.close();
}

testQ10Only().catch(console.error);