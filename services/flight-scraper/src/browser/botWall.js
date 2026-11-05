'use strict';

async function pageLooksBlocked(page) {
  try {
    const url = page.url();
    if (/captcha-v2|sttc\/px|perimeterx|datadome/i.test(url)) return true;
    const text = await page.evaluate(() => (document.body?.innerText || '').slice(0, 4000));
    return /person or a robot|remarkably lifelike|press & hold|access banned|verify you are human|AppError/i.test(
      text,
    );
  } catch {
    return false;
  }
}

module.exports = { pageLooksBlocked };
