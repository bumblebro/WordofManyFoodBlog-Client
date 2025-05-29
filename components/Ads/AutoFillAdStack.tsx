// "use client";
// import { useEffect, useRef, useState } from "react";
// import AdContainerForDesktop from "./AdContainerForDesktop";

// export const AutoFillAdStack = () => {
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const [numAds, setNumAds] = useState(0);
//   const AD_HEIGHT = 250;

//   useEffect(() => {
//     const measureHeight = () => {
//       const height = wrapperRef.current?.offsetHeight || 0;
//       const count = Math.floor(height / AD_HEIGHT);
//       setNumAds(count);
//     };

//     const observer = new ResizeObserver(measureHeight);

//     if (wrapperRef.current) {
//       observer.observe(wrapperRef.current);
//       measureHeight(); // Initial
//     }

//     return () => {
//       observer.disconnect();
//     };
//   }, []);

//   return (
//     <>
//       {/* This invisible div matches height of the content column */}
//       <div
//         ref={wrapperRef}
//         className="h-full w-0 overflow-hidden absolute pointer-events-none"
//       />

//       {/* This div actually renders ads */}
//       <div className="w-[300px] h-full">
//         {Array.from({ length: numAds }).map((_, i) => (
//           <div
//             key={i}
//             style={{ width: 300, height: 250, maxWidth: "100%" }}
//             className="mb-4"
//           >
//             <AdContainerForDesktop />
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };
