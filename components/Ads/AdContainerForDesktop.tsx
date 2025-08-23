"use client";
import { useEffect, useState } from "react";
import { MediumRectangleAdUnit } from "./ad-unit";

export default function AdContainerForDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsDesktop(window.innerWidth >= 1024); // You can adjust the breakpoint as needed
    };

    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  if (!isDesktop) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: 300,
          height: 250,
          maxWidth: "100%",
        
        }}
      >
        <MediumRectangleAdUnit />
      </div>
    </div>
  );
}
