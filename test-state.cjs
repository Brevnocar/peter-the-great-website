const { chromium } = require('playwright');

async function testStateDirect() {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  
  console.log('Opening quiz page...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.locator('#quiz').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.waitForSelector('#quiz', { timeout: 10000 });
  
  // Answer question 1
  console.log('\n--- Answering Question 1 ---');
  await page.waitForSelector('#quiz .glass-card', { timeout: 5000 });
  await page.waitForTimeout(300);
  
  const btn1 = page.locator('#quiz .glass-card >> button').filter({ hasText: /./ }).nth(0);
  await btn1.click({ force: true });
  await page.waitForTimeout(300);
  
  // Check answers state via React DevTools / evaluate
  const stateAfterQ1 = await page.evaluate(() => {
    // Find React fiber
    const root = document.querySelector('#root');
    if (!root) return 'no root';
    // Try to find the Quiz component fiber
    const fibers = Object.keys(root).filter(k => k.startsWith('__reactFiber'));
    return fibers.length;
  });
  console.log('Fibers found:', stateAfterQ1);
  
  // Get answered count from DOM
  const count1 = await page.locator('#quiz >> text=/\\d+ из 10 отвечено/').textContent();
  console.log('DOM Counter after Q1:', count1);
  
  // Click "Далее"
  await page.click('#quiz >> button:has-text("Далее")');
  await page.waitForTimeout(500);
  
  // Answer question 2
  console.log('\n--- Answering Question 2 ---');
  await page.waitForSelector('#quiz .glass-card', { timeout: 5000 });
  await page.waitForTimeout(300);
  
  const q2Text = await page.locator('#quiz .glass-card h3').first().textContent();
  console.log('Q2 Text:', q2Text?.trim());
  
  const btn2 = page.locator('#quiz .glass-card >> button').filter({ hasText: /./ }).nth(0);
  const btn2Text = await btn2.textContent();
  console.log('Clicking:', btn2Text?.trim());
  await btn2.click({ force: true });
  await page.waitForTimeout(300);
  
  const count2 = await page.locator('#quiz >> text=/\\d+ из 10 отвечено/').textContent();
  console.log('DOM Counter after Q2:', count2);
  
  // Check actual answers object by finding React state
  const answersState = await page.evaluate(() => {
    // Walk the fiber tree to find Quiz component state
    const root = document.querySelector('#root');
    if (!root) return null;
    
    function findFiber(node) {
      if (!node) return null;
      if (node.memoizedState && node.memoizedState.answers !== undefined) {
        return node.memoizedState;
      }
      if (node.child) {
        const found = findFiber(node.child);
        if (found) return found;
      }
      if (node.sibling) {
        const found = findFiber(node.sibling);
        if (found) return found;
      }
      return null;
    }
    
    const fiberKey = Object.keys(root).find(k => k.startsWith('__reactFiber'));
    if (fiberKey) {
      const fiber = root[fiberKey];
      return findFiber(fiber);
    }
    return null;
  });
  console.log('React state found:', answersState ? 'yes' : 'no');
  if (answersState) {
    console.log('Answers:', JSON.stringify(answersState.answers));
    console.log('CurrentQuestion:', answersState.currentQuestion);
    console.log('Submitted:', answersState.submitted);
  }
  
  await browser.close();
}

testStateDirect().catch(console.error);