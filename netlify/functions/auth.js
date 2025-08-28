// netlify/functions/auth.ts
import type { Handler } from '@netlify/functions';
import { createHandlers } from 'netlify-cms-oauth-provider-node';

// a lib a process.env-ből olvas (ORIGIN, COMPLETE_URL, OAUTH_CLIENT_ID, stb.)
const handlers = createHandlers({}, { useEnv: true });

export const handler: Handler = async (event) => {
  try {
    const url = new URL(event.rawUrl || `https://${process.env.URL}${event.path}${event.rawQuery ? '?' + event.rawQuery : ''}`);

    if (url.pathname.endsWith('/callback')) {
      // GitHub visszahívás → adjuk vissza a popupnak az oldalt, ami postMessage-eli a tokent
      const code = url.searchParams.get('code') || '';
      const html = await handlers.complete(code, Object.fromEntries(url.searchParams));
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
        body: html,
      };
    }

    // kezdő lépés → átirányítás a GitHub auth-ra
    const redirectUrl = await handlers.begin();
    return {
      statusCode: 302,
      headers: { Location: redirectUrl, 'Cache-Control': 'no-store' },
      body: '',
    };
  } catch (err: any) {
    return { statusCode: 500, body: `OAuth error: ${err?.message || err}` };
  }
};