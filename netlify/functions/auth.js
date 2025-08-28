// Netlify Functions (Node 18+, CJS)
const { createHandlers } = require('netlify-cms-oauth-provider-node');

// useEnv: a csomag az env változókból olvassa a configot:
// OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, ORIGIN, COMPLETE_URL, (opcionális ADMIN_PANEL_URL)
const handlers = createHandlers({}, { useEnv: true });

exports.handler = async (event) => {
  try {
    const path = event.path || '';
    const qs = event.queryStringParameters || {};

    if (path.endsWith('/callback')) {
      const code = qs.code;
      const html = await handlers.complete(code, qs);
      return { statusCode: 200, headers: { 'Content-Type': 'text/html' }, body: html };
    }

    // begin flow
    const state = qs.state; // Decap adja
    const redirectUrl = await handlers.begin(state);
    return { statusCode: 302, headers: { Location: redirectUrl } };
  } catch (err) {
    return { statusCode: 500, body: `OAuth error: ${err?.message || String(err)}` };
  }
};