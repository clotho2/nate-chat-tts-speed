// app/api/ollama/[...path]/route.ts
// Edge proxy to forward /api/ollama/* to your remote Ollama server.
// Why: avoids mixed-content & CORS; streams NDJSON responses intact.

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// RequestInit and related types are available globally in Edge Runtime

const upstream = (path: string) => {
  const base = (process.env.OLLAMA_PROXY_URL || process.env.OLLAMA_BASE_URL || '').replace(/\/$/, '');
  return `${base}/${path}`;
};

const hopHeaders = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

function buildHeaders(req: Request) {
  const h = new Headers();
  req.headers.forEach((v, k) => {
    if (!hopHeaders.has(k.toLowerCase())) h.set(k, v);
  });
  // Ensure JSON default; callers may override per request
  if (!h.has('content-type')) h.set('content-type', 'application/json');
  return h;
}

async function passthrough(req: Request, params: Promise<{ path?: string[] }>) {
  const resolvedParams = await params;
  const segments = (resolvedParams.path || []).join('/');
  const url = upstream(segments);

  const init: globalThis.RequestInit = {
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req.body,
    headers: buildHeaders(req),
    method: req.method,
    // Keep streaming behavior for NDJSON
    redirect: 'manual',
  };

  // Basic CORS support if upstream blocks cross-origin (browser preflight)
  // Allow all origins in proxy response; upstream still enforces its own policy
  const addCors = (headers: Headers) => {
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Headers', headers.get('Access-Control-Request-Headers') || '*');
    headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    return headers;
  };

  const res = await fetch(url, init);

  // Pass through streaming body & relevant headers
  const outHeaders = new Headers();
  res.headers.forEach((v, k) => {
    if (!hopHeaders.has(k.toLowerCase())) outHeaders.set(k, v);
  });

  addCors(outHeaders);
  return new Response(res.body, { headers: outHeaders, status: res.status });
}

export async function GET(req: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  return passthrough(req, params);
}
export async function POST(req: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  return passthrough(req, params);
}
export async function OPTIONS(req: Request) {
  const h = new Headers();
  h.set('Access-Control-Allow-Origin', '*');
  h.set('Access-Control-Allow-Headers', req.headers.get('Access-Control-Request-Headers') || '*');
  h.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  return new Response(null, { headers: h, status: 204 });
}
