// app/api/ollama/[...path]/route.ts
// Edge proxy to forward /api/ollama/* to your remote Ollama server.
// Why: avoids mixed-content & CORS; streams NDJSON responses intact.

export const runtime = 'edge';

const upstream = (path: string) => {
  const base = (process.env.OLLAMA_BASE_URL || '').replace(/\/$/, '');
  return `${base}/${path}`;
};

const hopHeaders = new Set([
  'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization',
  'te', 'trailer', 'transfer-encoding', 'upgrade'
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

async function passthrough(req: Request, params: { path?: string[] }) {
  const segments = (params.path || []).join('/');
  const url = upstream(segments);

  const init: RequestInit = {
    method: req.method,
    headers: buildHeaders(req),
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req.body,
    // Keep streaming behavior for NDJSON
    redirect: 'manual',
  };

  const res = await fetch(url, init);

  // Pass through streaming body & relevant headers
  const outHeaders = new Headers();
  res.headers.forEach((v, k) => {
    if (!hopHeaders.has(k.toLowerCase())) outHeaders.set(k, v);
  });

  return new Response(res.body, { status: res.status, headers: outHeaders });
}

export async function GET(req: Request, { params }: { params: { path?: string[] } }) {
  return passthrough(req, params);
}
export async function POST(req: Request, { params }: { params: { path?: string[] } }) {
  return passthrough(req, params);
}
export async function OPTIONS(req: Request, { params }: { params: { path?: string[] } }) {
  return passthrough(req, params);
}