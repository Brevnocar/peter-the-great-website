const { chromium } = require('playwright');

async function testFullFlow() {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  
  console.log('Opening quiz page...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.locator('#quiz').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  
  // Wait for quiz to load
  await page.waitForSelector('#quiz', { timeout: 10000 });
  await page.waitForTimeout(500);
  
  // Go through questions 1-9 using "Далее" button
  console.log('Going through questions 1-9...');
  for (let i = 0; i < 9; i++) {
    const qNum = i + 1;
    console.log(`\n--- Question ${qNum} ---`);
    
    // Wait for question to load
    await page.waitForSelector('#quiz .glass-card', { timeout: 5000 });
    await page.waitForTimeout(500);
    
    // Get question text from quiz section only
    const qText = await page.locator('#quiz .glass-card h3').first().textContent();
    console.log(`Question: ${qText?.trim()}`);
    
    // Get options from quiz section
    const buttons = page.locator('#quiz .glass-card >> button').filter({ hasText: /./ });
    const btnCount = await buttons.count();
    console.log(`Options: ${btnCount}`);
    
    // Click first option (index 0) for testing
    const btn = buttons.nth(0);
    const optText = await btn.textContent();
    console.log(`Clicking option: ${optText?.trim()}`);
    await btn.click(); // Removed force: true - wait for actionable
    await page.waitForTimeout(300);
    
    // Check answered count
    const countText = await page.locator('#quiz >> text=/\\d+ из 10 отвечено/').textContent();
    console.log(`Answered: ${countText}`);
    
    // Click "Далее" if not last
    if (i < 8) {
      const currentQText = await page.locator('#quiz .glass-card h3').first().textContent();
      await page.click('#quiz >> button:has-text("Далее")');
      // Wait for question to change
      await page.waitForFunction(
        (oldText) => {
          const el = document.querySelector('#quiz .glass-card h3');
          const newText = el ? el.textContent : null;
          return newText && newText !== oldText;
        },
        currentQText,
        { timeout: 2000 }
      );
      await page.waitForTimeout(800); // Wait for Framer Motion animation to complete
    }
  }
  
  // Now we should be on question 9 (index 8), click "Далее" to get to question 10
  console.log('\n--- Going to Question 10 ---');
  const currentQText = await page.locator('#quiz .glass-card h3').first().textContent();
  await page.click('#quiz >> button:has-text("Далее")');
  await page.waitForFunction(
    (oldText) => {
      const el = document.querySelector('#quiz .glass-card h3');
      const newText = el ? el.textContent : null;
      return newText && newText !== oldText;
    },
    currentQText,
    { timeout: 2000 }
  );
  await page.waitForTimeout(800);
  
  // Verify question 10
  const q10Text = await page.locator('#quiz >> text=В каком году Россия была провозглашена Империей').isVisible();
  console.log('Question 10 text visible:', q10Text);
  
  if (!q10Text) {
    // Check what question is shown
    const currentQ = await page.locator('#quiz .glass-card h3').first().textContent();
    console.log('Current question:', currentQ?.trim());
  }
  
  // Get options on Q10
  const buttons = page.locator('#quiz .glass-card >> button').filter({ hasText: /./ });
  const btnCount = await buttons.count();
  console.log(`Q10 Options: ${btnCount}`);
  
  for (let opt = 0; opt < btnCount; opt++) {
    const btn = buttons.nth(opt);
    const text = await btn.textContent();
    console.log(`  Option ${opt}: ${text?.trim()}`);
  }
  
  // Test clicking each option on Q10
  console.log('\n--- Testing all options on Q10 ---');
  for (let opt = 0; opt < btnCount; opt++) {
    const btn = buttons.nth(opt);
    await btn.click(); // Removed force: true
    await page.waitForTimeout(300);
    
    const className = await btn.getAttribute('class');
    const isSelected = className.includes('border-silver-400');
    const countText = await page.locator('#quiz >> text=/\\d+ из 10 отвечено/').textContent();
    console.log(`Option ${opt}: selected=${isSelected}, counter=${countText}`);
  }
  
  // Check submit button
  console.log('\n--- Submit button ---');
  const submitBtn = page.locator('#quiz >> button:has-text("Подтвердить ответы")');
  const submitVisible = await submitBtn.isVisible();
  console.log(`Submit visible: ${submitVisible}`);
  
  if (submitVisible) {
    await submitBtn.click({ force: true });
    await page.waitForTimeout(500);
    
    const scoreText = await page.locator('#quiz >> text=/\\d+ из 10/').first().textContent();
    console.log(`Score: ${scoreText}`);
  }
  
  await browser.close();
}

testFullFlow().catch(console.error);