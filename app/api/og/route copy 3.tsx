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
    (() => {
      // Split title smartly: before colon → script line, after → bold lines
      const raw = DeSlugify(title).trim();
      let topLine = "";
      let rest = "";
      if (raw.includes(":")) {
        const parts = raw.split(":");
        topLine = parts[0].trim(); // e.g., "Basil Strawberry Mimosa"
        rest = parts.slice(1).join(":").trim(); // e.g., "A Refreshing Twist on a Classic Cocktail"
      } else {
        const words = raw.split(/\s+/);
        const mid = Math.ceil(words.length / 2);
        topLine = words.slice(0, mid).join(" ");
        rest = words.slice(mid).join(" ");
      }

      // Split remainder into two balanced lines
      const restWords = rest.split(/\s+/).filter(Boolean);
      const cut = Math.ceil(restWords.length / 2);
      const line1 = restWords.slice(0, cut).join(" ");
      const line2 = restWords.slice(cut).join(" ");

      return (
        <div
          key={"pin-bold-card"}
          style={{
            width: "1000px",
            height: "2000px",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Top image */}
          <img
            src={cover}
            alt="top"
            style={{
              width: "100%",
              height: 860,
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />

          {/* Center card */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              padding: "0 40px",
              marginTop: -70,
              marginBottom: -70,
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: 28,
                padding: "70px 60px 90px",
                width: "100%",
                maxWidth: 900,
                boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
                border: "8px solid #F2D8C9",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 22,
              }}
            >
              {/* Script accent line */}
              <div
                style={{
                  fontFamily: "pinScript",
                  fontSize: 120,
                  color: "#DB6E4E",
                  textAlign: "center",
                  maxWidth: "100%",
                  wordBreak: "break-word",
                  lineHeight: 1.05,
                }}
              >
                {topLine}
              </div>

              {/* Bold stacked lines */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 10,
                }}
              >
                {line1 && (
                  <div
                    style={{
                      fontFamily: "pinBlock",
                      fontSize: 150,
                      color: "#2F3441",
                      textTransform: "uppercase",
                      letterSpacing: 2,
                      lineHeight: 1.0,
                      maxWidth: "92%",
                      wordBreak: "break-word",
                    }}
                  >
                    {line1}
                  </div>
                )}
                {line2 && (
                  <div
                    style={{
                      fontFamily: "pinBlock",
                      fontSize: 150,
                      color: "#2F3441",
                      textTransform: "uppercase",
                      letterSpacing: 2,
                      lineHeight: 1.0,
                      maxWidth: "92%",
                      wordBreak: "break-word",
                    }}
                  >
                    {line2}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom image */}
          <img
            src={cover}
            alt="bottom"
            style={{
              width: "100%",
              height: 860,
              objectFit: "cover",
              objectPosition: "center bottom",
              display: "block",
            }}
          />
        </div>
      );
    })(),
    (() => {
      // --- Smart title split ---
      const raw = DeSlugify(title).trim();

      // If there's a colon: left = tagline, right = descriptor.
      // If not: make a balanced split.
      let tagline = "";
      let descriptor = "";
      if (raw.includes(":")) {
        const parts = raw.split(":");
        tagline = parts[0].trim();
        descriptor = parts.slice(1).join(":").trim();
      } else {
        const words = raw.split(/\s+/);
        const mid = Math.ceil(words.length / 2);
        tagline = words.slice(0, mid).join(" ");
        descriptor = words.slice(mid).join(" ");
      }

      // If descriptor ended up empty, push everything there
      if (!descriptor) {
        descriptor = tagline;
        tagline = "";
      }

      // --- Break descriptor into 2–3 balanced lines ---
      const words = descriptor.split(/\s+/).filter(Boolean);
      const linesCount = words.length > 10 ? 3 : 2;
      const per = Math.ceil(words.length / linesCount);
      const d1 = words.slice(0, per).join(" ");
      const d2 = words.slice(per, per * 2).join(" ");
      const d3 = words.slice(per * 2).join(" ");

      return (
        <div
          key={"pin-ribbon-long"}
          style={{
            width: "1000px",
            height: "2000px",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Top image */}
          <img
            src={cover}
            alt="top"
            style={{
              width: "100%",
              height: 840,
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />

          {/* Center ribbon band (overlaps images) */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              padding: "0 40px",
              marginTop: -80,
              marginBottom: -80,
            }}
          >
            {/* Inner ribbon */}
            <div
              style={{
                background: "#111",
                borderRadius: 28,
                padding: "56px 56px 72px",
                width: "100%",
                maxWidth: 900,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0 10px 26px rgba(0,0,0,0.25)",
              }}
            >
              {/* Tagline (script) */}
              {tagline && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "pinRibbonScript",
                      fontSize: 110,
                      color: "#F7C56D",
                      textAlign: "center",
                      maxWidth: "95%",
                      wordBreak: "break-word",
                      lineHeight: 1.05,
                    }}
                  >
                    {tagline}
                  </div>
                  {/* separator */}
                  <div
                    style={{
                      width: "60%",
                      height: 0,
                      borderTop: "6px dashed #F7C56D",
                      marginTop: 18,
                      marginBottom: 10,
                    }}
                  />
                </div>
              )}

              {/* Descriptor lines (big, uppercase) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {d1 && (
                  <div
                    style={{
                      fontFamily: "pinRibbonBlock",
                      fontSize: 136,
                      color: "#FFFFFF",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      textAlign: "center",
                      lineHeight: 1.0,
                      maxWidth: "95%",
                      wordBreak: "break-word",
                    }}
                  >
                    {d1}
                  </div>
                )}
                {d2 && (
                  <div
                    style={{
                      fontFamily: "pinRibbonBlock",
                      fontSize: 136,
                      color: "#FFFFFF",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      textAlign: "center",
                      lineHeight: 1.0,
                      maxWidth: "95%",
                      wordBreak: "break-word",
                    }}
                  >
                    {d2}
                  </div>
                )}
                {d3 && (
                  <div
                    style={{
                      fontFamily: "pinRibbonBlock",
                      fontSize: 128,
                      color: "#FFFFFF",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      textAlign: "center",
                      lineHeight: 1.0,
                      maxWidth: "95%",
                      wordBreak: "break-word",
                    }}
                  >
                    {d3}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom image */}
          <img
            src={cover}
            alt="bottom"
            style={{
              width: "100%",
              height: 840,
              objectFit: "cover",
              objectPosition: "center bottom",
              display: "block",
            }}
          />
        </div>
      );
    })(),
    (() => {
      // Smart split: before colon → accent; after colon → main
      const raw = DeSlugify(title).trim();
      let accent = "";
      let main = "";
      if (raw.includes(":")) {
        const parts = raw.split(":");
        accent = parts[0].trim();
        main = parts.slice(1).join(":").trim();
      } else {
        const words = raw.split(/\s+/);
        const mid = Math.ceil(words.length / 2);
        accent = words.slice(0, mid).join(" ");
        main = words.slice(mid).join(" ");
      }
      if (!main) {
        main = accent;
        accent = "";
      }

      // Split main into 2–3 balanced lines
      const w = main.split(/\s+/).filter(Boolean);
      const linesCount = w.length > 12 ? 3 : 2;
      const per = Math.ceil(w.length / linesCount);
      const L1 = w.slice(0, per).join(" ");
      const L2 = w.slice(per, per * 2).join(" ");
      const L3 = w.slice(per * 2).join(" ");

      return (
        <div
          key={"pin-hero-stripe"}
          style={{
            width: "1000px",
            height: "2000px",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Top image */}
          <img
            src={cover}
            alt="top"
            style={{
              width: "100%",
              height: 820,
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />

          {/* Center gradient stripe (overlaps images) */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              padding: "0 40px",
              marginTop: -70,
              marginBottom: -70,
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(135deg, #0F1C2E 0%, #1F3B4D 45%, #A65B2E 100%)",
                borderRadius: 28,
                padding: "60px 56px 84px",
                width: "100%",
                maxWidth: 900,
                boxShadow: "0 10px 26px rgba(0,0,0,0.28)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 18,
              }}
            >
              {/* Accent (script) */}
              {accent && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "heroScript",
                      fontSize: 116,
                      color: "#F7C56D",
                      textAlign: "center",
                      maxWidth: "96%",
                      wordBreak: "break-word",
                      lineHeight: 1.05,
                      transform: "rotate(-2deg)",
                    }}
                  >
                    {accent}
                  </div>
                  <div
                    style={{
                      width: "64%",
                      height: 0,
                      borderTop: "6px dashed #F7C56D",
                      marginTop: 18,
                    }}
                  />
                </div>
              )}

              {/* Main lines (bold, condensed, uppercase) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {L1 && (
                  <div
                    style={{
                      fontFamily: "heroDisplay",
                      fontSize: 148,
                      color: "#FFFFFF",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      textAlign: "center",
                      lineHeight: 1.0,
                      maxWidth: "95%",
                      wordBreak: "break-word",
                    }}
                  >
                    {L1}
                  </div>
                )}
                {L2 && (
                  <div
                    style={{
                      fontFamily: "heroDisplay",
                      fontSize: 148,
                      color: "#FFFFFF",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      textAlign: "center",
                      lineHeight: 1.0,
                      maxWidth: "95%",
                      wordBreak: "break-word",
                    }}
                  >
                    {L2}
                  </div>
                )}
                {L3 && (
                  <div
                    style={{
                      fontFamily: "heroDisplay",
                      fontSize: 136,
                      color: "#FFFFFF",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      textAlign: "center",
                      lineHeight: 1.0,
                      maxWidth: "95%",
                      wordBreak: "break-word",
                    }}
                  >
                    {L3}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom image */}
          <img
            src={cover}
            alt="bottom"
            style={{
              width: "100%",
              height: 820,
              objectFit: "cover",
              objectPosition: "center bottom",
              display: "block",
            }}
          />
        </div>
      );
    })(),
    (() => {
      // Smart split: before ":" → accent; after ":" → main
      const raw = DeSlugify(title).trim();
      let accent = "";
      let body = "";
      if (raw.includes(":")) {
        const parts = raw.split(":");
        accent = parts[0].trim();
        body = parts.slice(1).join(":").trim();
      } else {
        const words = raw.split(/\s+/);
        const mid = Math.ceil(words.length / 2);
        accent = words.slice(0, mid).join(" ");
        body = words.slice(mid).join(" ");
      }
      if (!body) {
        body = accent;
        accent = "";
      }

      // Break body into 2–3 balanced lines so nothing overflows
      const w = body.split(/\s+/).filter(Boolean);
      const linesCount = w.length > 12 ? 3 : 2;
      const per = Math.ceil(w.length / linesCount);
      const L1 = w.slice(0, per).join(" ");
      const L2 = w.slice(per, per * 2).join(" ");
      const L3 = w.slice(per * 2).join(" ");

      return (
        <div
          key={"pin-frosted-card-fixed"}
          style={{
            width: "1000px",
            height: "2000px",
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Full-bleed image */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
            }}
          >
            <img
              src={cover}
              alt="cover"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />

            {/* Warm gradient overlay to boost readability (single layer OK) */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.25) 100%)",
              }}
            />

            {/* Centered frosted card */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 44px",
              }}
            >
              <div
                style={{
                  position: "relative", // allow internal gradient overlay
                  backgroundColor: "rgba(255,255,255,0.94)", // <— no repeating gradient
                  border: "10px solid #F3C8A3",
                  borderRadius: 28,
                  width: "100%",
                  maxWidth: 880,
                  padding: "64px 56px 80px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxShadow: "0 14px 36px rgba(0,0,0,0.25)",
                  gap: 18,
                }}
              >
                {/* Subtle one-layer gradient "texture" overlay inside the card */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(180deg, rgba(243,200,163,0.10) 0%, rgba(255,255,255,0.00) 100%)",
                    pointerEvents: "none",
                    borderRadius: 18,
                  }}
                />

                {/* Accent line (script) */}
                {accent && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "pinHeroScript",
                        fontSize: 112,
                        color: "#D77A43",
                        textAlign: "center",
                        lineHeight: 1.05,
                        maxWidth: "96%",
                        wordBreak: "break-word",
                        transform: "rotate(-1.5deg)",
                      }}
                    >
                      {accent}
                    </div>
                    {/* dashed separator */}
                    <div
                      style={{
                        width: "62%",
                        height: 0,
                        borderTop: "6px dashed #D77A43",
                        marginTop: 16,
                      }}
                    />
                  </div>
                )}

                {/* Main lines (bold, condensed, uppercase) */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {L1 && (
                    <div
                      style={{
                        fontFamily: "pinHeroBold",
                        fontSize: 148,
                        color: "#2B2F3B",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        textAlign: "center",
                        lineHeight: 1.0,
                        maxWidth: "96%",
                        wordBreak: "break-word",
                      }}
                    >
                      {L1}
                    </div>
                  )}
                  {L2 && (
                    <div
                      style={{
                        fontFamily: "pinHeroBold",
                        fontSize: 148,
                        color: "#2B2F3B",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        textAlign: "center",
                        lineHeight: 1.0,
                        maxWidth: "96%",
                        wordBreak: "break-word",
                      }}
                    >
                      {L2}
                    </div>
                  )}
                  {L3 && (
                    <div
                      style={{
                        fontFamily: "pinHeroBold",
                        fontSize: 132,
                        color: "#2B2F3B",
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        textAlign: "center",
                        lineHeight: 1.0,
                        maxWidth: "96%",
                        wordBreak: "break-word",
                      }}
                    >
                      {L3}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hand-drawn arrow accent (SVG), optional */}
            <div
              style={{
                position: "absolute",
                top: 120,
                left: 80,
                display: "flex",
              }}
            >
              <svg width="180" height="120" viewBox="0 0 180 120">
                <path
                  d="M10,110 C40,60 90,40 140,30"
                  fill="none"
                  stroke="#F3C8A3"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M130,20 L155,35 L140,50"
                  fill="none"
                  stroke="#F3C8A3"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
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
        name: "pinHeroBold", // big uppercase condensed headline
        data:
          (await loadGoogleFontWithParameter("League+Spartan", 800)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "pinHeroScript", // warm script accent
        data:
          (await loadGoogleFontWithParameter("Merienda", 700)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "heroScript", // accent line
        data:
          (await loadGoogleFontWithParameter("Caveat", 700)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "heroDisplay", // big uppercase condensed lines
        data:
          (await loadGoogleFontWithParameter("Teko", 700)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "pinRibbonScript", // tagline (script accent)
        data:
          (await loadGoogleFontWithParameter("Merienda", 700)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "pinRibbonBlock", // big uppercase lines
        data:
          (await loadGoogleFontWithParameter("Oswald", 700)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "pinScript", // script accent line
        data:
          (await loadGoogleFontWithParameter("Satisfy", 400)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
      {
        name: "pinBlock", // bold uppercase lines
        data:
          (await loadGoogleFontWithParameter("Bebas+Neue", 400)) ||
          new ArrayBuffer(0),
        style: "normal",
      },
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
