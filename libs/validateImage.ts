// lib/validateImage.ts
export async function validateProxiedImage(proxiedUrl: string) {
  const res = await fetch(proxiedUrl, {
    method: "GET",
    headers: { Range: "bytes=0-1" }, // tiny probe
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Proxy fetch failed: ${res.status} ${body}`);
  }

  const ctype = (res.headers.get("content-type") || "").toLowerCase();
  if (!ctype.startsWith("image/")) {
    throw new Error(`Unsupported content-type from proxy: ${ctype}`);
  }

  return true; // valid
}
