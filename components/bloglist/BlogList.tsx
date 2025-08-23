// "use client";

import DeSlugify from "@/libs/DeSlugify";
import { shimmer, toBase64 } from "@/libs/Shimmer";
import { FoodBlogs } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import { DisplayAdUnit } from "../Ads/ad-unit";
// import { DisplayAdUnit, InFeedAdUnit } from "../Ads/ad-unit";
// Poppins
const Poppins700 = Poppins({
  weight: "700",
  subsets: ["latin"],
  // display: "swap",
});

const Poppins400 = Poppins({
  weight: "400",
  subsets: ["latin"],
  // display: "swap",
});

const Poppins500 = Poppins({
  weight: "500",
  subsets: ["latin"],
});

const freight = localFont({
  src: "../../app/fonts/freight-neo-pro-book.otf",
});

type JsonValue = string | number | boolean | null;
interface posts {
  posts: FoodBlogs[];
}

function BlogList({ posts }: posts) {
  return (
    <div className="mx-auto mb-10 w-full px-4">
      <DisplayAdUnit format="auto" className="mx-auto w-full" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:max-w-[73rem] mx-auto w-full">
        {/* <InFeedAdUnit
          className="h-[55vw] w-full  lg:h-[12rem] xl:h-[22rem] md:h-[17rem] sm:h-[29rem] relative "
          // className="h-[55vw] w-full  lg:h-[12rem] xl:h-[22rem] md:h-[17rem] sm:h-[29rem] relative "
        /> */}
        {posts.map((item, index) => {
          // const myBlurDataUrl = await getBase64(item.imageurl);
          // const shouldInsertAd = Math.random() < 0.1;
          // if (shouldInsertAd) {
          //   return (
          //     <InFeedAdUnit
          //       key={index}
          //       // className="h-[55vw] w-full  lg:h-[12rem] xl:h-[22rem] md:h-[17rem] sm:h-[29rem] relative "
          //       // className="h-[55vw] w-full  lg:h-[12rem] xl:h-[22rem] md:h-[17rem] sm:h-[29rem] relative "
          //     />
          //   );
          // }
          return (
            <div
              key={index}
              className="group flex flex-col bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <Link
                href={`/${
                  item.section !== "null"
                    ? item.section.toLowerCase() + "/"
                    : ""
                }${
                  item.subsection !== "null"
                    ? item.subsection.toLowerCase() + "/"
                    : ""
                }${
                  item.subsubsection !== "null"
                    ? item.subsubsection.toLowerCase() + "/"
                    : ""
                }${item.title.toLowerCase()}`}
                className="relative h-[55vw] w-full lg:h-[12rem] xl:h-[22rem] md:h-[17rem] sm:h-[29rem] overflow-hidden"
              >
                <Image
                  className="rounded-t-xl transition-transform duration-500 group-hover:scale-105"
                  fill
                  sizes="(min-width: 640px) 608px,(min-width: 768px) 362px,(min-width: 1024px) 233px,(min-width: 1280px) 277px,(min-width: 1536px) 277px, 358px"
                  src={item.imageurl}
                  style={{ objectFit: "cover" }}
                  quality={90}
                  alt={item.imagealt}
                  loading="lazy"
                  placeholder={`data:image/svg+xml;base64,${toBase64(
                    shimmer(300, 300)
                  )}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Cooking Time Badge */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 shadow-md">
                  <svg
                    className="h-5 w-5 text-[#8D6271]"
                    viewBox="0 0 64.00 64.00"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="32" cy="32" r="24"></circle>
                    <polyline points="40 44 32 32 32 16"></polyline>
                  </svg>
                  <span
                    className={`text-sm font-medium text-[#8D6271] ${Poppins500.className}`}
                  >
                    {(() => {
                      const prepTimeInSeconds = parseInt(
                        (
                          (item.recipedetails as Record<string, any>)["1X"]
                            ?.preparationTime || 0
                        ).toString()
                      );
                      const totalMinutes = Math.floor(prepTimeInSeconds / 60);
                      const hours = Math.floor(totalMinutes / 60);
                      const minutes = totalMinutes % 60;
                      return hours > 0
                        ? `${hours} hr${hours > 1 ? "s" : ""} ${minutes} min${
                            minutes !== 1 ? "s" : ""
                          }`
                        : `${minutes} min${minutes !== 1 ? "s" : ""}`;
                    })()}
                  </span>
                </div>
              </Link>

              <div className="p-4 flex flex-col gap-2">
                {/* Category Link */}
                <Link
                  href={`/${
                    item.section !== "null"
                      ? item.section.toLowerCase() + "/"
                      : ""
                  }${
                    item.subsection !== "null"
                      ? item.subsection.toLowerCase() + "/"
                      : ""
                  }${
                    item.subsubsection !== "null"
                      ? item.subsubsection.toLowerCase() + "/"
                      : ""
                  }`}
                  className="inline-block"
                >
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#8D6271]/10 text-[#8D6271] text-sm font-medium hover:bg-[#8D6271]/20 transition-colors duration-200">
                    {DeSlugify(item.subsection)}
                  </span>
                </Link>

                {/* Title */}
                <Link
                  href={`/${
                    item.section !== "null"
                      ? item.section.toLowerCase() + "/"
                      : ""
                  }${
                    item.subsection !== "null"
                      ? item.subsection.toLowerCase() + "/"
                      : ""
                  }${
                    item.subsubsection !== "null"
                      ? item.subsubsection.toLowerCase() + "/"
                      : ""
                  }${item.title.toLowerCase()}`}
                  className="group"
                >
                  <h2
                    className={`text-lg font-bold text-[#1A1D1E] group-hover:text-[#8D6271] transition-colors duration-200 ${Poppins700.className}`}
                  >
                    {DeSlugify(item.title)}
                  </h2>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BlogList;
