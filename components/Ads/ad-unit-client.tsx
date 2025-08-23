"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

export type AdUnitProps = {
  children: React.ReactNode;
};

export default function AdUnitClient({ children }: AdUnitProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const adRef = useRef<HTMLDivElement>(null);
  const adLoaded = useRef(false);

  useEffect(() => {
    console.log(`pathname: `, pathname, "searchparams: ", searchParams);

    if (typeof window === "undefined") return;

    try {
      if (!adLoaded.current && adRef.current) {
        console.log(`new ad rendered`);
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adLoaded.current = true;
      } else {
        console.log(`new ad NOT rendered`);
      }
    } catch (err) {
      console.error("Adsense error:", err);
    }
  }, [pathname, searchParams]);

  return <div ref={adRef}>{children}</div>;
}
