'use strict';

/** Injected before any page script — reduces obvious automation signals. */
function stealthInitScript() {
  Object.defineProperty(navigator, 'webdriver', { get: () => undefined });

  if (!window.chrome) {
    window.chrome = { runtime: {} };
  }

  Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
  Object.defineProperty(navigator, 'platform', { get: () => 'Win32' });

  const originalQuery = window.navigator.permissions.query;
  if (originalQuery) {
    window.navigator.permissions.query = (parameters) =>
      parameters.name === 'notifications'
        ? Promise.resolve({ state: Notification.permission })
        : originalQuery(parameters);
  }

  const getParameter = WebGLRenderingContext.prototype.getParameter;
  WebGLRenderingContext.prototype.getParameter = function patchedGetParameter(parameter) {
    if (parameter === 37445) return 'Intel Inc.';
    if (parameter === 37446) return 'Intel Iris OpenGL Engine';
    return getParameter.call(this, parameter);
  };
}

module.exports = { stealthInitScript };
