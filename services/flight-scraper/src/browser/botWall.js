'use strict';

function urlIsCaptchaHardWall(url) {
  return /captcha-v2|sttc\/px\/captcha|\/perimeterx\//i.test(String(url || ''));
}

function urlLooksLikeSkyResults(url) {
  return /skyscanner\.[^/]+\/transport\/vols?\//i.test(String(url || '')) && !urlIsCaptchaHardWall(url);
}

async function pageChallengeText(page) {
  try {
    return await page.evaluate(() => {
      const t = (document.body?.innerText || '').slice(0, 5000);
      return t;
    });
  } catch {
    return '';
  }
}

function textLooksLikePxChallenge(text) {
  return /person or a robot|remarkably lifelike|press & hold|access banned|verify you are human|Bot or Not|personne ou un robot|maintenir appuy[eé]|appuyer et maintenir|êtes-vous une personne|press and hold/i.test(
    String(text || ''),
  );
}

/**
 * Hard wall: dedicated captcha URL / banned page.
 * Soft overlay: results (or other) page with PX challenge copy still visible.
 */
async function getBlockState(page) {
  try {
    const url = page.url();
    if (urlIsCaptchaHardWall(url)) {
      return { blocked: true, hard: true, soft: false, url };
    }
    const text = await pageChallengeText(page);
    const soft = textLooksLikePxChallenge(text);
    return { blocked: soft, hard: false, soft, url };
  } catch {
    return { blocked: false, hard: false, soft: false, url: '' };
  }
}

async function pageLooksBlocked(page) {
  const state = await getBlockState(page);
  return state.blocked;
}

/** Results search URL that is not the dedicated captcha-v2 page. */
async function skyPageHasResultsUrl(page) {
  try {
    return urlLooksLikeSkyResults(page.url());
  } catch {
    return false;
  }
}

module.exports = {
  pageLooksBlocked,
  getBlockState,
  urlIsCaptchaHardWall,
  urlLooksLikeSkyResults,
  skyPageHasResultsUrl,
  textLooksLikePxChallenge,
};
