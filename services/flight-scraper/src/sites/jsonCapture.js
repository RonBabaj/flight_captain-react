'use strict';

function attachJsonCapture(page, urlPattern) {
  const captured = [];
  page.on('response', async (resp) => {
    try {
      const u = resp.url();
      if (urlPattern && !urlPattern.test(u)) return;
      const ct = (resp.headers()['content-type'] || '').toLowerCase();
      if (!ct.includes('json') && !ct.includes('graphql')) return;
      if (resp.status() < 200 || resp.status() >= 300) return;
      const buf = await resp.body();
      if (!buf || buf.length < 20) return;
      const text = buf.toString('utf8');
      if (text[0] !== '{' && text[0] !== '[') return;
      captured.push(JSON.parse(text));
    } catch {
      /* ignore */
    }
  });
  return captured;
}

module.exports = { attachJsonCapture };
