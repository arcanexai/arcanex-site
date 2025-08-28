import { createHandlers } from 'netlify-cms-oauth-provider-node';

const handlers = createHandlers({}, { useEnv: true });

// Kis helper a HTML válaszhoz
const html = (body) => ({
  statusCode: 200,
  headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  body,
});

export const handler = async (event) => {
  try {
    const path = event.path || '';
    const qs = event.queryStringParameters || {};

    // CALLBACK ág – GitHub ide jön vissza ?code=...&state=...
    if (path.endsWith('/callback')) {
      const code = qs.code;
      if (!code) {
        return html('<h1>OAuth error</h1><p>Missing "code" in callback.</p>');
      }
      try {
        const page = await handlers.complete(code, qs);
        return html(page); // tartalmazza a postMessage + window.close logikát
      } catch (err) {
        return html(`<h1>OAuth error</h1><pre>${(err?.message || String(err))}</pre>`);
      }
    }

    // BEGIN ág – a Decap innen indítja az OAuth-ot
    try {
      const redirectUrl = await handlers.begin(qs.state);
      return { statusCode: 302, headers: { Location: redirectUrl, 'Cache-Control': 'no-store' } };
    } catch (err) {
      return html(`<h1>OAuth error</h1><pre>${(err?.message || String(err))}</pre>`);
    }
  } catch (err) {
    return { statusCode: 500, body: `OAuth fatal error: ${err?.message || String(err)}` };
  }
};