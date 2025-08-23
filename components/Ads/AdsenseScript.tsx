"use client";

import Script from "next/script";

export default function AdsenseScript() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5012580427673167"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
