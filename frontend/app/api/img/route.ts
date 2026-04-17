export const runtime = "edge";

/**
 * Image proxy for Pollinations.ai — serves generated images through our own domain.
 *
 * Why: Pollinations.ai URLs can fail in certain browsers/regions due to DNS or firewall
 * restrictions. Proxying through our edge function fixes this: the browser always loads
 * images from our domain, and the server-side fetch to Pollinations always succeeds.
 *
 * Caching: 1-year immutable Cache-Control so browsers and CDN (Cloudflare) never
 * re-fetch the same image URL twice — zero latency on every visit after the first.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response("Missing url parameter", { status: 400 });
  }

  // Security: only proxy Pollinations images — not an open proxy.
  // Must parse the URL and check hostname exactly; startsWith() can be
  // bypassed with https://image.pollinations.ai.attacker.com/...
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new Response("Invalid URL", { status: 400 });
  }
  if (parsed.protocol !== "https:" || parsed.hostname !== "image.pollinations.ai") {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const upstream = await fetch(url);
    if (!upstream.ok) {
      return new Response("Upstream error", { status: 502 });
    }

    const blob = await upstream.blob();
    return new Response(blob, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new Response("Failed to fetch image", { status: 502 });
  }
}
