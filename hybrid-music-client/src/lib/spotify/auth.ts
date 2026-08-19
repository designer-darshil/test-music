export const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || 'your_spotify_client_id';
export const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/callback` : '';
const SCOPES = 'user-read-private user-read-email user-library-read user-top-read playlist-read-private playlist-modify-public playlist-modify-private';

function generateRandomString(length: number) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  function base64encode(string: Uint8Array) {
    return btoa(String.fromCharCode.apply(null, Array.from(string)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return base64encode(new Uint8Array(digest));
}

export async function authorizeWithSpotify() {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  window.localStorage.setItem('code_verifier', codeVerifier);

  const args = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge
  });

  window.location.href = `https://accounts.spotify.com/authorize?${args}`;
}

export async function requestAccessToken(code: string) {
  const codeVerifier = window.localStorage.getItem('code_verifier');
  if (!codeVerifier) throw new Error('Code verifier missing');

  const body = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  if (!response.ok) {
    throw new Error('HTTP status ' + response.status);
  }
  
  const data = await response.json();
  window.localStorage.setItem('spotify_access_token', data.access_token);
  window.localStorage.setItem('spotify_refresh_token', data.refresh_token);
  
  // Set expiration
  const expiry = new Date().getTime() + data.expires_in * 1000;
  window.localStorage.setItem('spotify_token_expiry', expiry.toString());
  
  return data;
}

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  const expiry = window.localStorage.getItem('spotify_token_expiry');
  if (expiry && new Date().getTime() > parseInt(expiry)) {
    // Needs refresh (simplification for MVP: just return null to re-auth)
    return null; 
  }
  return window.localStorage.getItem('spotify_access_token');
}
