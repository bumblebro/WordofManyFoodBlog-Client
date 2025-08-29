import { FoodBlogs } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { shimmer, toBase64 } from "@/libs/Shimmer";
import DeSlugify from "@/libs/DeSlugify";
import { Poppins } from "next/font/google";
import AdContainerForDesktop from "../Ads/AdContainerForDesktop";
import AdContainerForMobile from "../Ads/AdContainerForMobile";
// import AdContainerForDesktop from "../Ads/AdContainerForDesktop";
// import AdContainerForMobile from "../Ads/AdContainerForMobile";

const Poppins700 = Poppins({
  weight: "700",
  subsets: ["latin"],
});

const Poppins400 = Poppins({
  weight: "400",
  subsets: ["latin"],
});

interface InternalLinkingProps {
  currentPost: FoodBlogs;
  relatedPosts: FoodBlogs[];
  categoryPosts: FoodBlogs[];
}

export default function InternalLinking({
  currentPost,
  relatedPosts,
  categoryPosts,
}: InternalLinkingProps) {
  // Filter out the current post from related posts
  const filteredRelatedPosts = relatedPosts.filter(
    (post) => post.id !== currentPost.id
  );
  const filteredCategoryPosts = categoryPosts.filter(
    (post) => post.id !== currentPost.id
  );

  return (
    <div className="my-8 px-4 xl:px-0">
      {/* Related Recipes Section */}
      <div className="mb-8">
        <h2
          className={`text-2xl font-semibold mb-4 ${Poppins700.className} text-[#8D6271]`}
        >
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRelatedPosts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href={`/${post.section.toLowerCase()}/${post.subsection.toLowerCase()}/${post.subsubsection.toLowerCase()}/${post.title.toLowerCase()}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                <div className="relative h-48">
                  <Image
                    src={post.imageurl}
                    alt={post.imagealt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, (min-width: 1024px) 33vw, 100vw"
                    quality={75}
                    placeholder={`data:image/svg+xml;base64,${toBase64(
                      shimmer(300, 300)
                    )}`}
                  />
                </div>
                <div className="p-4">
                  <span className="text-sm text-gray-600 block mb-2">
                    {DeSlugify(post.subsection)}
                  </span>
                  <h3
                    className={`text-lg font-semibold line-clamp-2 group-hover:text-[#8D6271] transition-colors ${Poppins700.className}`}
                  >
                    {DeSlugify(post.title)}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <AdContainerForDesktop />
      <AdContainerForMobile />
      {/* Category Section */}
      <div>
        <h2
          className={`text-2xl font-semibold mb-4 ${Poppins700.className} text-[#8D6271]`}
        >
          More in {DeSlugify(currentPost.subsection)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategoryPosts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href={`/${post.section.toLowerCase()}/${post.subsection.toLowerCase()}/${post.subsubsection.toLowerCase()}/${post.title.toLowerCase()}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                <div className="relative h-48">
                  <Image
                    src={post.imageurl}
                    alt={post.imagealt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, (min-width: 1024px) 33vw, 100vw"
                    quality={75}
                    placeholder={`data:image/svg+xml;base64,${toBase64(
                      shimmer(300, 300)
                    )}`}
                  />
                </div>
                <div className="p-4">
                  <span className="text-sm text-gray-600 block mb-2">
                    {DeSlugify(post.subsubsection)}
                  </span>
                  <h3
                    className={`text-lg font-semibold line-clamp-2 group-hover:text-[#8D6271] transition-colors ${Poppins700.className}`}
                  >
                    {DeSlugify(post.title)}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>{" "}
      <AdContainerForDesktop />
      <AdContainerForMobile />
    </div>
  );
}
