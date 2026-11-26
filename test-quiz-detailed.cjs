const { chromium } = require('playwright');

async function testQuizDetailed() {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  console.log('Opening quiz page...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  
  // Scroll to quiz section
  await page.locator('#quiz').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  
  // Wait for quiz to render
  await page.waitForSelector('text=Проверь свои знания о Петре I', { timeout: 10000 });
  
  // Take initial screenshot
  await page.screenshot({ path: 'quiz-initial.png', fullPage: true });
  console.log('Initial screenshot saved');
  
  const questions = [
    { q: 'В каком году родился Пётр I?', correct: 0 },
    { q: 'Какое событие положило начало Великому посольству?', correct: 0 },
    { q: 'Какой битвой считается переломный момент Северной войны?', correct: 1 },
    { q: 'Когда была заложена Петропавловская крепость — начало Санкт-Петербурга?', correct: 1 },
    { q: 'Какой реформой Пётр I заменил патриархат на Святейший Синод?', correct: 2 },
    { q: 'Для чего был введён Табель о рангах в 1722 году?', correct: 2 },
    { q: 'Какое море стало доступным для России после Ништадтского мира 1721 года?', correct: 2 },
    { q: 'Какое учебное заведение было основано первым у Петра I?', correct: 1 },
    { q: 'Как называлась первая русская печатная газета, основанная Петром I?', correct: 1 },
    { q: 'В каком году Россия была провозглашена Империей, а Пётр I — Императором?', correct: 2 },
  ];
  
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    console.log(`\n--- Question ${i + 1}: ${q.q} ---`);
    
    // Wait for question to appear
    await page.waitForSelector(`text=${q.q}`, { timeout: 5000 });
    await page.waitForTimeout(300);
    
    // Get all answer buttons
    const buttons = page.locator('.glass-card >> button').filter({ hasText: /./ });
    const count = await buttons.count();
    console.log(`Found ${count} answer buttons`);
    
    // Click the correct answer using actual mouse click
    const correctBtn = buttons.nth(q.correct);
    
    // Get bounding box before click
    const box = await correctBtn.boundingBox();
    console.log(`Button ${q.correct} box:`, box);
    
    // Move mouse and click
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(50);
      await page.mouse.up();
      console.log(`Clicked answer ${q.correct} via mouse`);
    } else {
      await correctBtn.click();
      console.log(`Clicked answer ${q.correct} via click()`);
    }
    
    await page.waitForTimeout(300);
    
    // Verify it's visually selected
    const className = await correctBtn.getAttribute('class');
    console.log(`Button classes: ${className}`);
    const isSelected = className.includes('border-silver-400');
    console.log(`Visually selected: ${isSelected}`);
    
    // Check answered count
    const answeredText = await page.locator('text=/\\d+ из 10 отвечено/').textContent();
    console.log(`Answered counter: ${answeredText}`);
    
    // Take screenshot of each question
    await page.screenshot({ path: `quiz-q${i+1}.png`, fullPage: true });
    
    // Navigate to next question if not last
    if (i < 9) {
      await page.click('button:has-text("Далее")');
      await page.waitForTimeout(400);
    }
  }
  
  // Now on question 10, test ALL options with detailed checks
  console.log('\n=== Testing all 4 options on Question 10 ===');
  
  // Check for overlapping elements
  const allButtons = page.locator('.glass-card >> button').filter({ hasText: /./ });
  const btnCount = await allButtons.count();
  console.log(`Total buttons on Q10: ${btnCount}`);
  
  for (let opt = 0; opt < btnCount; opt++) {
    const btn = allButtons.nth(opt);
    
    // Check if button is visible and enabled
    const isVisible = await btn.isVisible();
    const isEnabled = await btn.isEnabled();
    const box = await btn.boundingBox();
    console.log(`Option ${opt}: visible=${isVisible}, enabled=${isEnabled}, box=${JSON.stringify(box)}`);
    
    // Check for elements overlapping this button
    if (box) {
      const overlapping = await page.evaluate((x, y) => {
        const el = document.elementFromPoint(x, y);
        return el ? el.tagName + (el.className ? '.' + el.className.split(' ')[0] : '') : 'none';
      }, box.x + box.width / 2, box.y + box.height / 2);
      console.log(`  Element at center: ${overlapping}`);
    }
    
    // Click with mouse
    await btn.click({ force: true });
    await page.waitForTimeout(300);
    
    const className = await btn.getAttribute('class');
    const isSelected = className.includes('border-silver-400');
    console.log(`  Option ${opt} clicked, selected: ${isSelected}`);
    
    // Screenshot after each click
    await page.screenshot({ path: `quiz-q10-opt${opt}.png`, fullPage: true });
  }
  
  // Verify final answered count
  const finalCount = await page.locator('text=/\\d+ из 10 отвечено/').textContent();
  console.log(`\nFinal answered count: ${finalCount}`);
  
  // Check Submit button
  const submitBtn = page.locator('button:has-text("Подтвердить ответы")');
  const submitVisible = await submitBtn.isVisible();
  const submitEnabled = await submitBtn.isEnabled();
  const submitBox = await submitBtn.boundingBox();
  console.log(`Submit button: visible=${submitVisible}, enabled=${submitEnabled}, box=${JSON.stringify(submitBox)}`);
  
  // Click submit
  await submitBtn.click({ force: true });
  await page.waitForTimeout(500);
  
  // Check results
  const scoreText = await page.locator('text=/\\d+ из 10/').first().textContent();
  console.log(`\nScore displayed: ${scoreText}`);
  
  const correctText = await page.locator('text=/Правильно: \\d+/').textContent();
  const wrongText = await page.locator('text=/Ошибок: \\d+/').textContent();
  console.log(`Correct: ${correctText}, Wrong: ${wrongText}`);
  
  // Check explanations visible
  const explanations = await page.locator('text=Пётр I родился').count();
  console.log(`Explanations visible: ${explanations > 0}`);
  
  // Test restart
  await page.click('button:has-text("Пройти ещё раз")');
  await page.waitForTimeout(500);
  
  const resetCount = await page.locator('text=/\\d+ из 10 отвечено/').textContent();
  console.log(`\nAfter restart, answered count: ${resetCount}`);
  
  const firstQ = await page.locator('text=В каком году родился Пётр I?').isVisible();
  console.log(`First question visible after restart: ${firstQ}`);
  
  // Final screenshot
  await page.screenshot({ path: 'quiz-final.png', fullPage: true });
  
  console.log('\n=== TEST COMPLETE ===');
  await browser.close();
}

testQuizDetailed().catch(console.error);