export const runtime = "nodejs";
import sharp from "sharp";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const u = url.searchParams.get("url");
  console.log(`Proxying image from: ${u}`);
  if (!u) return new Response("Missing url", { status: 400 });

  // const r = await fetch(u, { redirect: "follow" });
  const r = await fetch(u, {
    redirect: "follow",
    headers: {
      Accept: "image/avif,image/webp,image/apng,image/*;q=0.8,*/*;q=0.5",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Referer: "https://savorytouch.com/",
      Connection: "keep-alive",
    },
  });

  if (!r.ok) return new Response(`Fetch failed: ${r.status}`, { status: 502 });

  const buf = Buffer.from(await r.arrayBuffer());
  try {
    const out = await sharp(buf).png().toBuffer(); // or .jpeg()
    //@ts-ignore
    return new Response(out, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e: any) {
    return new Response(`Transcode failed: ${e.message}`, { status: 415 });
  }
}
