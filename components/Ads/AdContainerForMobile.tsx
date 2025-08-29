"use client";

import { useEffect, useState } from "react";
import { MediumRectangleAdUnit } from "./ad-unit";

export default function AdContainerForMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth < 1024); // Adjust breakpoint as needed
    };

    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  if (!isMobile) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: 300, height: 250, maxWidth: "100%" }}>
        <MediumRectangleAdUnit />
      </div>
    </div>
  );
}
