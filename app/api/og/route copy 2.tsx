// /////OLD
import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "@vercel/og";
import { url } from "inspector";
import DeSlugify from "@/libs/DeSlugify";
// import sharp from "sharp";

export const runtime = "experimental-edge";

async function loadGoogleFont() {
  const url = "https://fonts.googleapis.com/css2?family=Anton+SC&display=swap";

  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

async function loadFonts() {
  const regularFontData = await fetch(
    new URL("./SoinSansPro-Bold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const boldFontData = await fetch(
    new URL("./source-sans-pro.black.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());
  const lightFontData = await fetch(
    new URL("./source-sans-pro.extralight.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return { regularFontData, boldFontData, lightFontData };
}

async function loadGoogleFontWithParameter(font: string, weight = 400) {
  // keep it small by limiting glyphs you need (optional)
  const cssUrl = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&display=swap`;

  const css = await (await fetch(cssUrl)).text();

  // Prefer woff2; fallback to first url(...) if format isn’t present
  const woff2 = css.match(/src:\s*url\((https:[^)]+)\)\s*format\('woff2'\)/);
  const anyUrl = css.match(/url\((https:[^)]+)\)/);

  const fileUrl = woff2?.[1] ?? anyUrl?.[1];
  if (!fileUrl) throw new Error(`Could not find font file for ${font}`);

  const res = await fetch(fileUrl);
  if (!res.ok) throw new Error(`Failed to fetch font file: ${fileUrl}`);

  return await res.arrayBuffer();
}

const phrases = [
  "The Most Amazing",
  "The Best",
  "Easy & Simple",
  "The Ultimate",
  "Simple & Easy",
  "Quick & Easy",
  "Super Delicious",
  "Really Good",
  "Tried & Tested",
  "Fast & Easy",
  "So Tasty",
  "The Greatest",
  "Top Rated",
  "Most Loved",
  "All-Time Favorite",
  "Easy & Tasty",
  "Highly Recommended",
  "Best Ever",
  "The Classic",
  "Go-To Recipe",
];

export async function GET(req: NextRequest) {
  const { regularFontData, boldFontData, lightFontData } = await loadFonts();

  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Default Title";
  const cover = searchParams.get("cover") || "";
  const num = searchParams.get("num") || "3";
  const isWhiteText = Math.random() < 0.5;

  const theme = {
    background: isWhiteText ? "black" : "white",
    text: isWhiteText ? "white" : "black",
  };

  const templates = [
    (() => {
      const site = (
        searchParams.get("website") || "LOWCARBAFRICA.COM"
      ).toUpperCase();

      // Split title: before colon → headline, after colon → subtitle.
      // If no colon, split roughly in half.
      let rawTitle = DeSlugify(title).trim();
      let headline = "";
      let subtitle = "";
      if (rawTitle.includes(":")) {
        const parts = rawTitle.split(":");
        headline = parts[0].trim();
        subtitle = parts.slice(1).join(":").trim();
      } else {
        const words = rawTitle.split(/\s+/);
        const mid = Math.ceil(words.length / 2);
        headline = words.slice(0, mid).join(" ");
        subtitle = words.slice(mid).join(" ");
      }

      return (
        <div
          key={"long-title-layout"}
          style={{
            width: "1000px",
            height: "2000px",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top image */}
          <img
            src={cover}
            alt="top"
            style={{
              width: "100%",
              height: "860px",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />

          {/* Center card for headline/subtitle */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              padding: "0 40px",
              marginTop: "-80px",
              marginBottom: "-80px",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.95)",
                borderRadius: "28px",
                padding: "80px 70px 100px",
                width: "100%",
                maxWidth: "900px",
                boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Headline (before colon or first half) */}
              <div
                style={{
                  fontFamily: "newBig",
                  fontSize: 150,
                  color: "#2C2E43",
                  letterSpacing: "2px",
                  lineHeight: 1.0,
                  textTransform: "uppercase",
                  maxWidth: "100%",
                  wordBreak: "break-word",
                }}
              >
                {headline}
              </div>

              {/* Subtitle (after colon or second half), optional */}
              {subtitle && (
                <div
                  style={{
                    fontFamily: "newSmall",
                    fontSize: 90,
                    color: "#55556A",
                    letterSpacing: "1.5px",
                    lineHeight: 1.1,
                    textTransform: "uppercase",
                    maxWidth: "100%",
                    wordBreak: "break-word",
                    marginTop: 24,
                  }}
                >
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          {/* Bottom image */}
          <img
            src={cover}
            alt="bottom"
            style={{
              width: "100%",
              height: "860px",
              objectFit: "cover",
              objectPosition: "center bottom",
              display: "block",
            }}
          />

          {/* Website pill */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 120,
              display: "flex",
              justifyContent: "center",
              zIndex: 100,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#ffffff",
                height: 80,
                paddingLeft: 44,
                paddingRight: 44,
                borderRadius: 40,
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                overflow: "hidden",
                maxWidth: "90%",
              }}
            >
              <span
                style={{
                  fontFamily: "siteSans",
                  fontSize: 40,
                  color: "#000000",
                  letterSpacing: 1,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {site}
              </span>
            </div>
          </div>
        </div>
      );
    })(),
    (() => {
      const site = (
        searchParams.get("website") || "LOWCARBAFRICA.COM"
      ).toUpperCase();

      // Split title: before colon → headline, after colon → subtitle.
      // If no colon, split roughly in half.
      const rawTitle = DeSlugify(title).trim();
      let headline = "";
      let subtitle = "";
      if (rawTitle.includes(":")) {
        const parts = rawTitle.split(":");
        headline = parts[0].trim();
        subtitle = parts.slice(1).join(":").trim();
      } else {
        const words = rawTitle.split(/\s+/);
        const mid = Math.ceil(words.length / 2);
        headline = words.slice(0, mid).join(" ");
        subtitle = words.slice(mid).join(" ");
      }

      return (
        <div
          key={"cocktail-card"}
          style={{
            width: "1000px",
            height: "2000px",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top image */}
          <img
            src={cover}
            alt="top"
            style={{
              width: "100%",
              height: "860px",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />

          {/* Center card for headline and subtitle */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              padding: "0 40px",
              marginTop: "-80px",
              marginBottom: "-80px",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.95)",
                borderRadius: "32px",
                padding: "80px 70px 100px",
                width: "100%",
                maxWidth: "900px",
                boxShadow: "0 8px 26px rgba(0,0,0,0.18)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Headline */}
              <div
                style={{
                  fontFamily: "cocktailHead",
                  fontSize: 140,
                  color: "#322B38",
                  letterSpacing: "2px",
                  lineHeight: 1.1,
                  textTransform: "uppercase",
                  maxWidth: "100%",
                  wordBreak: "break-word",
                }}
              >
                {headline}
              </div>

              {/* Subtitle */}
              {subtitle && (
                <div
                  style={{
                    fontFamily: "cocktailSub",
                    fontSize: 90,
                    color: "#565768",
                    letterSpacing: "1.5px",
                    lineHeight: 1.2,
                    textTransform: "uppercase",
                    maxWidth: "100%",
                    wordBreak: "break-word",
                    marginTop: 24,
                  }}
                >
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          {/* Bottom image */}
          <img
            src={cover}
            alt="bottom"
            style={{
              width: "100%",
              height: "860px",
              objectFit: "cover",
              objectPosition: "center bottom",
              display: "block",
            }}
          />

          {/* Website pill */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 120,
              display: "flex",
              justifyContent: "center",
              zIndex: 100,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#ffffff",
                height: 80,
                paddingLeft: 44,
                paddingRight: 44,
                borderRadius: 40,
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                overflow: "hidden",
                maxWidth: "90%",
              }}
            >
              <span
                style={{
                  fontFamily: "siteSans",
                  fontSize: 40,
                  color: "#000000",
                  letterSpacing: 1,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {site}
              </span>
            </div>
          </div>
        </div>
      );
    })(),
    (() => {
      const site = (
        searchParams.get("website") || "LOWCARBAFRICA.COM"
      ).toUpperCase();

      // Split title at colon or roughly in half
      const raw = DeSlugify(title).trim();
      let tagline = "";
      let descriptor = "";
      if (raw.includes(":")) {
        const parts = raw.split(":");
        tagline = parts[0].trim();
        descriptor = parts.slice(1).join(":").trim();
      } else {
        const words = raw.split(/\s+/);
        const mid = Math.min(2, Math.ceil(words.length / 2));
        tagline = words.slice(0, mid).join(" ");
        descriptor = words.slice(mid).join(" ");
      }
      const descWords = descriptor.split(/\s+/);
      const splitIndex = Math.ceil(descWords.length / 2);
      const line1 = descWords.slice(0, splitIndex).join(" ");
      const line2 = descWords.slice(splitIndex).join(" ");

      return (
        <div
          key={"cocktail-shakshuka-style"}
          style={{
            width: "1000px",
            height: "2000px",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top image */}
          <img
            src={cover}
            alt="top"
            style={{
              width: "100%",
              height: "860px",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />

          {/* Central card wrapper */}
          <div
            style={{
              width: "100%",
              display: "flex", // explicit
              justifyContent: "center",
              padding: "0 40px",
              marginTop: "-70px",
              marginBottom: "-70px",
            }}
          >
            {/* Card container */}
            <div
              style={{
                background: "#ffffff",
                border: "8px solid #A26336",
                borderRadius: "32px",
                padding: "60px 50px 80px",
                width: "100%",
                maxWidth: "900px",
                boxShadow: "0 8px 26px rgba(0,0,0,0.18)",
                display: "flex", // explicit
                flexDirection: "column",
                alignItems: "center",
                gap: "24px",
              }}
            >
              {/* Tagline with border */}
              <div
                style={{
                  border: "4px solid #A26336",
                  borderRadius: "12px",
                  padding: "16px 32px",
                  display: "flex", // explicit
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "mimosaTag",
                    fontSize: 110,
                    color: "#A26336",
                    lineHeight: 1.1,
                    textTransform: "capitalize",
                    textAlign: "center",
                    wordBreak: "break-word",
                  }}
                >
                  {tagline}
                </span>
              </div>

              {/* Descriptor split across two colored lines */}
              <div
                style={{
                  display: "flex", // explicit
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  lineHeight: 1.0,
                }}
              >
                {line1 && (
                  <div
                    style={{
                      fontFamily: "mimosaLine",
                      fontSize: 160,
                      color: "#A26336",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      maxWidth: "100%",
                      wordBreak: "break-word",
                    }}
                  >
                    {line1}
                  </div>
                )}
                {line2 && (
                  <div
                    style={{
                      fontFamily: "mimosaLine",
                      fontSize: 160,
                      color: "#3B8E46",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      maxWidth: "100%",
                      wordBreak: "break-word",
                    }}
                  >
                    {line2}
                  </div>
                )}
              </div>

              {/* Website bar */}
              <div
                style={{
                  background: "#A26336",
                  borderRadius: "24px",
                  padding: "14px 44px",
                  display: "flex", // explicit
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "siteSans",
                    fontSize: 42,
                    color: "#ffffff",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {site}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom image */}
          <img
            src={cover}
            alt="bottom"
            style={{
              width: "100%",
              height: "860px",
              objectFit: "cover",
              objectPosition: "center bottom",
              display: "block",
            }}
          />
        </div>
      );
    })(),
    (() => {
      const site = (
        searchParams.get("website") || "LOWCARBAFRICA.COM"
      ).toUpperCase();

      // Parse title: before colon → tagline, after colon → descriptor.
      // If no colon, split roughly after the first two words.
      const raw = DeSlugify(title).trim();
      let taglinePart = "";
      let descriptorPart = "";
      if (raw.includes(":")) {
        const parts = raw.split(":");
        taglinePart = parts[0].trim();
        descriptorPart = parts.slice(1).join(":").trim();
      } else {
        const words = raw.split(/\s+/);
        const mid = Math.min(2, Math.ceil(words.length / 2));
        taglinePart = words.slice(0, mid).join(" ");
        descriptorPart = words.slice(mid).join(" ");
      }

      // Split the descriptor into two balanced lines.
      const descWords = descriptorPart.split(/\s+/);
      const midIndex = Math.ceil(descWords.length / 2);
      const line1 = descWords.slice(0, midIndex).join(" ");
      const line2 = descWords.slice(midIndex).join(" ");

      return (
        <div
          key={"cucumber-style"}
          style={{
            width: "1000px",
            height: "2000px",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top image */}
          <img
            src={cover}
            alt="top"
            style={{
              width: "100%",
              height: "840px",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />

          {/* Central black banner */}
          <div
            style={{
              width: "100%",
              background: "#0E0E0E",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "60px 40px",
              gap: "36px",
            }}
          >
            {/* Tagline row with white lines and oval */}
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "4px",
                  backgroundColor: "#FFFFFF",
                }}
              />
              <div
                style={{
                  background: "#000000",
                  borderRadius: "40px",
                  padding: "12px 60px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "cucumberTag",
                    fontSize: 100,
                    color: "#FFFFFF",
                    letterSpacing: "1px",
                    textTransform: "capitalize",
                    wordBreak: "break-word",
                  }}
                >
                  {taglinePart}
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  height: "4px",
                  backgroundColor: "#FFFFFF",
                }}
              />
            </div>

            {/* Descriptor lines with two colors */}
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {line1 && (
                <div
                  style={{
                    fontFamily: "cucumberLine",
                    fontSize: 130,
                    color: "#A2D958",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    wordBreak: "break-word",
                    textAlign: "center",
                    maxWidth: "90%",
                  }}
                >
                  {line1}
                </div>
              )}
              {line2 && (
                <div
                  style={{
                    fontFamily: "cucumberLine",
                    fontSize: 130,
                    color: "#F7D36A",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    wordBreak: "break-word",
                    textAlign: "center",
                    maxWidth: "90%",
                  }}
                >
                  {line2}
                </div>
              )}
            </div>
          </div>

          {/* Bottom image */}
          <img
            src={cover}
            alt="bottom"
            style={{
              width: "100%",
              height: "840px",
              objectFit: "cover",
              objectPosition: "center bottom",
              display: "block",
            }}
          />

          {/* Website pill */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 120,
              display: "flex",
              justifyContent: "center",
              zIndex: 100,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#ffffff",
                height: 80,
                paddingLeft: 44,
                paddingRight: 44,
                borderRadius: 40,
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                overflow: "hidden",
                maxWidth: "90%",
              }}
            >
              <span
                style={{
                  fontFamily: "siteSans",
                  fontSize: 40,
                  color: "#000000",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {site}
              </span>
            </div>
          </div>
        </div>
      );
    })(),
    (() => {
      const site = (
        searchParams.get("website") || "Recipecakes.com"
      ).toUpperCase();

      // Split title: part before colon → tagline; remainder → descriptor.
      // If no colon, split approximately in half.
      const rawTitle = DeSlugify(title).trim();
      let tagline = "";
      let descriptor = "";
      if (rawTitle.includes(":")) {
        const parts = rawTitle.split(":");
        tagline = parts[0].trim();
        descriptor = parts.slice(1).join(":").trim();
      } else {
        const words = rawTitle.split(/\s+/);
        const mid = Math.min(2, Math.ceil(words.length / 2));
        tagline = words.slice(0, mid).join(" ");
        descriptor = words.slice(mid).join(" ");
      }

      // Break descriptor into two balanced lines.
      const descWords = descriptor.split(/\s+/);
      const midIndex = Math.ceil(descWords.length / 2);
      const line1 = descWords.slice(0, midIndex).join(" ");
      const line2 = descWords.slice(midIndex).join(" ");

      return (
        <div
          key={"lo-mein-long-title"}
          style={{
            width: "1000px",
            height: "2000px",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top image */}
          <img
            src={cover}
            alt="top"
            style={{
              width: "100%",
              height: "860px",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />

          {/* Pastel banner with text and site */}
          <div
            style={{
              width: "100%",
              background: "#F9E8DE", // pastel backdrop
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "60px 50px 90px",
              borderTop: "8px solid #F9E8DE",
              borderBottom: "8px solid #F9E8DE",
              gap: "20px",
            }}
          >
            {/* Script tagline */}
            {tagline && (
              <div
                style={{
                  fontFamily: "loMeinScript",
                  fontSize: 140,
                  color: "#5B5148",
                  textAlign: "center",
                  maxWidth: "90%",
                  wordBreak: "break-word",
                }}
              >
                {tagline}
              </div>
            )}

            {/* Descriptor lines */}
            {line1 && (
              <div
                style={{
                  fontFamily: "loMeinMain",
                  fontSize: 140,
                  color: "#292E39",
                  textAlign: "center",
                  textTransform: "capitalize",
                  maxWidth: "90%",
                  wordBreak: "break-word",
                  lineHeight: 1.1,
                }}
              >
                {line1}
              </div>
            )}

            {line2 && (
              <div
                style={{
                  fontFamily: "loMeinMain",
                  fontSize: 140,
                  color: "#292E39",
                  textAlign: "center",
                  textTransform: "capitalize",
                  maxWidth: "90%",
                  wordBreak: "break-word",
                  lineHeight: 1.1,
                  marginTop: "10px",
                }}
              >
                {line2}
              </div>
            )}

            {/* Site within panel */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                padding: "16px 44px",
                marginTop: "28px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "siteSans",
                  fontSize: 48,
                  color: "#292E39",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {site}
              </span>
            </div>
          </div>

          {/* Bottom image */}
          <img
            src={cover}
            alt="bottom"
            style={{
              width: "100%",
              height: "860px",
              objectFit: "cover",
              objectPosition: "center bottom",
              display: "block",
            }}
          />
        </div>
      );
    })(),
    (() => {
      const site = (
        searchParams.get("website") || "Recipecakes.com"
      ).toUpperCase();

      // Split title: before colon → tagline; after colon → descriptor.
      // If no colon, first two words become the tagline; rest is descriptor.
      const rawTitle = DeSlugify(title).trim();
      let tagline = "";
      let descriptor = "";
      if (rawTitle.includes(":")) {
        const parts = rawTitle.split(":");
        tagline = parts[0].trim();
        descriptor = parts.slice(1).join(":").trim();
      } else {
        const words = rawTitle.split(/\s+/);
        const mid = Math.min(2, Math.ceil(words.length / 2));
        tagline = words.slice(0, mid).join(" ");
        descriptor = words.slice(mid).join(" ");
      }

      // Split descriptor into two balanced lines
      const descWords = descriptor.split(/\s+/);
      const midIdx = Math.ceil(descWords.length / 2);
      const line1 = descWords.slice(0, midIdx).join(" ");
      const line2 = descWords.slice(midIdx).join(" ");

      // Circle text = first word of tagline
      const circleText = tagline.split(/\s+/)[0] || "";

      return (
        <div
          key={"takeout-style-long-title"}
          style={{
            width: "1000px",
            height: "2000px",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top collage (two halves) */}
          <div
            style={{
              width: "100%",
              height: "540px",
              display: "flex",
              position: "relative",
            }}
          >
            <div
              style={{
                flex: 1,
                backgroundImage: `url(${cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
              }}
            />
            <div
              style={{
                flex: 1,
                backgroundImage: `url(${cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center bottom",
              }}
            />

            {/* Circle overlay with first word of tagline */}
            {circleText && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 240,
                  height: 240,
                  background: "#E2A14A",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "circleFont",
                    fontSize: 130,
                    color: "#FFFFFF",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    lineHeight: 1.0,
                  }}
                >
                  {circleText}
                </span>
              </div>
            )}
          </div>

          {/* Central pastel band with tagline, main lines, and site bar */}
          <div
            style={{
              width: "100%",
              background: "#F9E8DE",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "70px 50px 90px",
              borderTop: "8px solid #F9E8DE",
              borderBottom: "8px solid #F9E8DE",
            }}
          >
            {/* Full tagline */}
            {tagline && (
              <div
                style={{
                  fontFamily: "taglineFont",
                  fontSize: 120,
                  color: "#784A31",
                  textAlign: "center",
                  maxWidth: "90%",
                  wordBreak: "break-word",
                }}
              >
                {tagline}
              </div>
            )}

            {/* First line of descriptor */}
            {line1 && (
              <div
                style={{
                  fontFamily: "mainFont",
                  fontSize: 140,
                  color: "#A55330",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  textAlign: "center",
                  lineHeight: 1.0,
                  maxWidth: "90%",
                  wordBreak: "break-word",
                  marginTop: 20,
                }}
              >
                {line1}
              </div>
            )}

            {/* Second line of descriptor */}
            {line2 && (
              <div
                style={{
                  fontFamily: "mainFont",
                  fontSize: 140,
                  color: "#A55330",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  textAlign: "center",
                  lineHeight: 1.0,
                  maxWidth: "90%",
                  wordBreak: "break-word",
                  marginTop: 10,
                }}
              >
                {line2}
              </div>
            )}

            {/* Website bar inside pastel band */}
            <div
              style={{
                background: "#A55330",
                borderRadius: "24px",
                padding: "14px 60px",
                marginTop: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "siteFont",
                  fontSize: 48,
                  color: "#FFFFFF",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {site}
              </span>
            </div>
          </div>

          {/* Bottom collage (two halves) */}
          <div
            style={{
              width: "100%",
              height: "540px",
              display: "flex",
            }}
          >
            <div
              style={{
                flex: 1,
                backgroundImage: `url(${cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center left",
              }}
            />
            <div
              style={{
                flex: 1,
                backgroundImage: `url(${cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center right",
              }}
            />
          </div>
        </div>
      );
    })(),
  ];

  const randomTemplate =
    templates[Math.floor(Math.random() * templates.length)];

  return new ImageResponse(randomTemplate, {
    width: 1000,
    height: 2000,

    fonts: [
      {
        name: "circleFont", // Circle text (first word of the tagline)
        data:
          (await loadGoogleFontWithParameter("Bebas+Neue", 400)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "taglineFont", // Script tagline (“Basil Strawberry Mimosa” part)
        data:
          (await loadGoogleFontWithParameter("Great+Vibes", 400)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "mainFont", // Main descriptor lines (“A Refreshing Twist on...”)
        data:
          (await loadGoogleFontWithParameter("Archivo+Black", 400)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "siteFont", // Website bar
        data:
          (await loadGoogleFontWithParameter("Montserrat", 700)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "loMeinScript", // Script tagline (e.g., “Basil Strawberry Mimosa”)
        data:
          (await loadGoogleFontWithParameter("Satisfy", 400)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "loMeinMain", // Main body text
        data:
          (await loadGoogleFontWithParameter("Poppins", 700)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "siteSans", // Website panel text
        data:
          (await loadGoogleFontWithParameter("Montserrat", 700)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "cucumberTag", // Oval tagline (“Basil Strawberry Mimosa” part)
        data:
          (await loadGoogleFontWithParameter("Cinzel", 700)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "cucumberLine", // Large colored lines (“A Refreshing Twist on a Classic Cocktail” split)
        data:
          (await loadGoogleFontWithParameter("League+Spartan", 700)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "siteSans", // Website pill
        data:
          (await loadGoogleFontWithParameter("Montserrat", 700)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "mimosaTag", // Tagline
        data:
          (await loadGoogleFontWithParameter("Playfair+Display", 700)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "mimosaLine", // Large colored lines
        data:
          (await loadGoogleFontWithParameter("Bebas+Neue", 400)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "siteSans", // Website bar
        data:
          (await loadGoogleFontWithParameter("Montserrat", 700)) ||
          new ArrayBuffer(0),
        style: "normal",
      },

      {
        name: "cocktailHead", // Headline (before colon or first half)
        data:
          (await loadGoogleFontWithParameter("Abril+Fatface", 400)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "cocktailSub", // Subtitle (after colon or second half)
        data:
          (await loadGoogleFontWithParameter("Nunito", 700)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "siteSans", // Website pill
        data:
          (await loadGoogleFontWithParameter("Montserrat", 700)) ||
          new ArrayBuffer(0),
        style: "normal",
      },

      {
        name: "newBig", // headline (before the colon or first half)
        data:
          (await loadGoogleFontWithParameter("Patua+One", 400)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "newSmall", // subtitle (after the colon or second half)
        data:
          (await loadGoogleFontWithParameter("Lato", 700)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "siteSans", // website pill
        data:
          (await loadGoogleFontWithParameter("Montserrat", 700)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
    ],
  });
}
