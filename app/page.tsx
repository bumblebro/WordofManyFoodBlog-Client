import BlogList from "@/components/bloglist/BlogList";
import Paginationblog from "@/components/pagination/Paginationblog";
import { FoodBlogs } from "@prisma/client";
import GETBLOG from "./api/blogs/GETBLOG";
import FeaturedPost from "@/components/featuredPost/FeaturedPost";
import { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import localFont from "next/font/local";
import FoodSections from "@/components/FoodSections";
import Navbar2 from "@/components/navbar2/page";
import Navbar3 from "@/components/navbar3/page";
import Link from "next/link";
import Image from "next/image";
import { shimmer, toBase64 } from "@/libs/Shimmer";
import DeSlugify from "@/libs/DeSlugify";

import { Poppins } from "next/font/google";
// import AdCode from "@/components/AdCode";
// import { DisplayAdUnit } from "@/components/Ads/ad-unit";

// Poppins
const Poppins700 = Poppins({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
});

const Poppins400 = Poppins({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const Poppins500 = Poppins({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
});

const freight = localFont({
  src: "../app/fonts/freight-neo-pro-book.otf",
});

const freightlight = localFont({
  src: "../app/fonts/fonnts.com-FreightNeo_Pro_Light.otf",
});

const freightbig = localFont({
  src: "../app/fonts/Freight Big Pro Medium Italic.otf",
});

const freightbigstraight = localFont({
  src: "../app/fonts/Freight Big Pro Medium.otf",
});

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Savory Touch | The Latest in Food & Drink Delights",
  };
}

const slugs = [
  "Cuisine-Types",
  "Meal-Types",
  "Dietary-Preferences",
  "Cooking-Techniques",
  "Ingredients",
  "Recipe-Formats",
  "Modern-Trends",
  "Seasonal-Recipes",
  "Global-Flavors",
  "Special-Occasions",
];

// Featured categories with images and descriptions
const featuredCategories = [
  {
    title: "Cuisine Types",
    description: "Explore authentic recipes from around the world",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070",
    link: "/cuisine-types",
    items: [
      "Italian",
      "Mexican",
      "Asian",
      "Mediterranean",
      "American",
      "Indian",
      "French",
      "Japanese",
      "Greek",
      "Spanish",
    ],
  },
  {
    title: "Meal Types",
    description: "Find the perfect recipe for any time of day",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080",
    link: "/meal-types",
    items: ["Breakfast", "Lunch", "Dinner", "Snacks", "Desserts", "Brunch"],
  },
  {
    title: "Dietary Preferences",
    description: "Recipes tailored to your dietary needs",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1974",
    link: "/dietary-preferences",
    items: [
      "Vegetarian",
      "Vegan",
      "Gluten-Free",
      "Keto",
      "Paleo",
      "Low-Carb",
      "Dairy-Free",
    ],
  },
  {
    title: "Seasonal Recipes",
    description: "Fresh recipes for every season",
    image:
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=1974",
    link: "/seasonal-recipes",
    items: ["Spring", "Summer", "Fall", "Winter", "Holiday"],
  },
];

// Update the popularCategories array with correct URLs
const popularCategories = [
  {
    title: "Quick & Easy",
    description: "30-minute meals and simple recipes",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2070",
    link: "/Recipe-Formats/Quick-Meals",
  },
  {
    title: "Healthy Options",
    description: "Nutritious and balanced meals",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053",
    link: "/Modern-Trends/Healthy-Swaps",
  },
  {
    title: "Family Favorites",
    description: "Kid-friendly and crowd-pleasing recipes",
    image:
      "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?q=80&w=2070",
    link: "/Recipe-Formats/Kid-Friendly",
  },
];

async function Home({ searchParams }: { searchParams: { pageNo: string } }) {
  let posts: FoodBlogs[] = [];
  let pageNo = "1";
  let totalPages = 1;
  let hasNextPage = false;

  const response = await GETBLOG({ pageNo: "1" });
  if (response) {
    posts = response.blogs;
    pageNo = "1";
    totalPages = response.metaData.totalPages;
    hasNextPage = response.metaData.hasNextPage;
  }

  return (
    <>
      <Navbar3 decodedslug={slugs} home={true} />
      <FeaturedPost posts={posts || []} />

      {/* Search Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-96 md:mt-20">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2
              className={`text-2xl sm:text-3xl font-bold text-[#8D6271] mb-3 ${Poppins700.className}`}
            >
              Find Your Perfect Recipe
            </h2>
            <p className={`text-gray-600 ${Poppins400.className}`}>
              Search through our collection of delicious recipes
            </p>
          </div>
          <form action="/search" method="get" className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="q"
                placeholder="Search for recipes..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6271] focus:border-transparent text-base"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#8D6271] text-white rounded-lg hover:bg-[#7a5260] transition-colors text-base font-medium whitespace-nowrap"
              >
                Search Recipes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Interactive Featured Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16  lg:mt-0">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold text-[#8D6271] mb-4 ${Poppins700.className}`}
          >
            Explore Recipe Categories
          </h2>
          <p
            className={`text-lg text-gray-600 max-w-2xl mx-auto ${Poppins400.className}`}
          >
            Discover recipes organized by cuisine, meal type, dietary
            preferences, and more
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.map((category, index) => (
            <Link
              key={index}
              href={category.link}
              className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative h-64">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(min-width: 768px) 50vw, (min-width: 1024px) 25vw, 100vw"
                  quality={75}
                  placeholder={`data:image/svg+xml;base64,${toBase64(
                    shimmer(300, 300)
                  )}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3
                    className={`text-xl font-bold text-white mb-2 ${Poppins700.className}`}
                  >
                    {category.title}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {category.description}
                  </p>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <div className="bg-white/90 rounded-full p-2 transform transition-transform duration-300 group-hover:translate-x-1">
                  <svg
                    className="w-5 h-5 text-[#8D6271]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/recipes"
            className={`inline-flex items-center px-6 py-3 rounded-full bg-[#8D6271] text-white hover:bg-[#7A5260] transition-colors duration-200 ${Poppins500.className}`}
          >
            View All Categories
            <svg
              className="w-5 h-5 ml-2"
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

      {/* Internal Linking Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold text-[#8D6271] mb-4 ${Poppins700.className}`}
          >
            Popular Categories
          </h2>
          <p
            className={`text-lg text-gray-600 max-w-2xl mx-auto ${Poppins400.className}`}
          >
            Discover our most loved recipe collections
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularCategories.map((category, index) => (
            <Link
              key={index}
              href={category.link}
              className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative h-64">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(min-width: 768px) 33vw, 100vw"
                  quality={75}
                  placeholder={`data:image/svg+xml;base64,${toBase64(
                    shimmer(300, 300)
                  )}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3
                    className={`text-xl font-bold text-white mb-2 ${Poppins700.className}`}
                  >
                    {category.title}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {category.description}
                  </p>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <div className="bg-white/90 rounded-full p-2 transform transition-transform duration-300 group-hover:translate-x-1">
                  <svg
                    className="w-5 h-5 text-[#8D6271]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold text-[#8D6271] mb-4 ${Poppins700.className}`}
          >
            Latest Recipes
          </h2>
          <p
            className={`text-lg text-gray-600 max-w-2xl mx-auto ${Poppins400.className}`}
          >
            Discover our newest culinary creations
          </p>
        </div>
        <BlogList posts={posts || []} />
        <div className="mt-8">
          <Paginationblog
            pageNo={pageNo}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
          />
        </div>
      </div>
    </>
  );
}

export default Home;
