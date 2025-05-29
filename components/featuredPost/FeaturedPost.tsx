import { shimmer, toBase64 } from "@/libs/Shimmer";
import { FoodBlogs } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { Pacifico } from "next/font/google";
import { Poppins } from "next/font/google";

export const revalidate = 3600;

// Poppins
const Poppins700 = Poppins({
  weight: "700",
  subsets: ["latin"],
});

const Poppins400 = Poppins({
  weight: "400",
  subsets: ["latin"],
});

const Poppins500 = Poppins({
  weight: "500",
  subsets: ["latin"],
});

// Pacifico
const font = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

const freight = localFont({
  src: "../../app/fonts/freight-neo-pro-book.otf",
});

const freightlight = localFont({
  src: "../../app/fonts/fonnts.com-FreightNeo_Pro_Light.otf",
});

const freightbig = localFont({
  src: "../../app/fonts/Freight Big Pro Medium Italic.otf",
});

const freightbigstraight = localFont({
  src: "../../app/fonts/Freight Big Pro Medium.otf",
});

interface posts {
  posts: FoodBlogs[];
}

function FeaturedPost({ posts }: posts) {
  let randomNum = Math.floor(Math.random() * posts.length) + 1;

  return (
    <div className="mx-auto px-4 mt-[10px] md:mt-[10px]">
      <div className="grid grid-cols-1 relative md:grid-cols-2 md:h-[28rem] xl:h-[32rem] xl:max-w-[73rem] mx-auto">
        {/* Featured Image */}
        <Link
          className="flex justify-center pt-4 h-64 relative md:h-full group overflow-hidden"
          href={`/${
            posts[randomNum]?.section !== "null"
              ? posts[randomNum]?.section + "/"
              : ""
          }${
            posts[randomNum]?.subsection !== "null"
              ? posts[randomNum]?.subsection + "/"
              : ""
          }${
            posts[randomNum]?.subsubsection !== "null"
              ? posts[randomNum]?.subsubsection + "/"
              : ""
          }${posts[randomNum]?.title}`}
        >
          <Image
            className="md:rounded-none rounded-xl transition-transform duration-500 group-hover:scale-105"
            fill
            sizes="(min-width: 640px) 608px,(min-width: 768px) 368px,(min-width: 1024px) 496px,(min-width: 1280px) 584px,(min-width: 1536px) 584px, 328px"
            src={posts[randomNum]?.imageurl}
            style={{ objectFit: "cover" }}
            quality={90}
            alt={posts[randomNum]?.imagealt}
            priority
            placeholder={`data:image/svg+xml;base64,${toBase64(
              shimmer(300, 300)
            )}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Content Section */}
        <div className="bg-[#F0F1F3] left-[5%] text-center w-[90%] py-8 absolute top-[80%] px-8 md:relative md:h-full md:top-0 md:flex md:flex-col md:justify-center md:left-0 md:w-full rounded-xl md:rounded-none text-[#000000] shadow-lg md:shadow-none">
          {/* Category Link */}
          {posts[randomNum]?.subsubsection ? (
            <Link
              href={`/${
                posts[randomNum].section !== "null"
                  ? posts[randomNum].section + "/"
                  : ""
              }${
                posts[randomNum].subsection !== "null"
                  ? posts[randomNum].subsection + "/"
                  : ""
              }${
                posts[randomNum].subsubsection !== "null"
                  ? posts[randomNum].subsubsection + "/"
                  : ""
              }`}
              className="inline-block"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#8D6271]/10 text-[#8D6271] text-sm font-medium mb-4 hover:bg-[#8D6271]/20 transition-colors duration-200">
                {posts[randomNum].subsubsection?.replace(/-/g, " ")}
              </span>
            </Link>
          ) : posts[randomNum]?.subsection ? (
            <Link
              href={`/${
                posts[randomNum].section !== "null"
                  ? posts[randomNum].section + "/"
                  : ""
              }${
                posts[randomNum].subsection !== "null"
                  ? posts[randomNum].subsection + "/"
                  : ""
              }`}
              className="inline-block"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#8D6271]/10 text-[#8D6271] text-sm font-medium mb-4 hover:bg-[#8D6271]/20 transition-colors duration-200">
                {posts[randomNum].subsection?.replace(/-/g, " ")}
              </span>
            </Link>
          ) : (
            <Link
              href={`/${
                posts[randomNum]?.section !== "null"
                  ? posts[randomNum]?.section + "/"
                  : ""
              }`}
              className="inline-block"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#8D6271]/10 text-[#8D6271] text-sm font-medium mb-4 hover:bg-[#8D6271]/20 transition-colors duration-200">
                {posts[randomNum]?.section?.replace(/-/g, " ")}
              </span>
            </Link>
          )}

          {/* Title */}
          <Link
            href={`/${
              posts[randomNum]?.section !== "null"
                ? posts[randomNum]?.section + "/"
                : ""
            }${
              posts[randomNum]?.subsection !== "null"
                ? posts[randomNum]?.subsection + "/"
                : ""
            }${
              posts[randomNum]?.subsubsection !== "null"
                ? posts[randomNum]?.subsubsection + "/"
                : ""
            }${posts[randomNum]?.title}`}
            className="group"
          >
            <h2
              className={`text-2xl font-bold md:text-4xl lg:text-5xl mb-4 ${Poppins700.className} text-black group-hover:text-[#8D6271] transition-colors duration-200`}
            >
              {posts[randomNum]?.title?.replace(/-/g, " ")}
            </h2>
          </Link>

          {/* Description */}
          <p className={`text-gray-600 mb-6 ${Poppins400.className}`}>
            {posts[randomNum]?.recipedescription?.slice(0, 150)}...
          </p>

          {/* Read More Button */}
          <Link
            href={`/${
              posts[randomNum]?.section !== "null"
                ? posts[randomNum]?.section + "/"
                : ""
            }${
              posts[randomNum]?.subsection !== "null"
                ? posts[randomNum]?.subsection + "/"
                : ""
            }${
              posts[randomNum]?.subsubsection !== "null"
                ? posts[randomNum]?.subsubsection + "/"
                : ""
            }${posts[randomNum]?.title}`}
            className={`inline-flex items-center text-[#8D6271] hover:text-[#7A5260] transition-colors duration-200 ${Poppins500.className}`}
          >
            Read More
            <svg
              className="w-5 h-5 ml-2 transform transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FeaturedPost;
