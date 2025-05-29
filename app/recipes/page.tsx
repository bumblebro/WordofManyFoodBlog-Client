"use client";

import localFont from "next/font/local";
import DeSlugify from "@/libs/DeSlugify";
import Link from "next/link";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { shimmer, toBase64 } from "@/libs/Shimmer";
import { useState } from "react";
import Navbar3 from "@/components/navbar3/page";

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

const freight = localFont({
  src: "../../app/fonts/freight-neo-pro-book.otf",
});

// Category data with images and theme colors
const categories = [
  {
    title: "Cuisine Types",
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
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Explore authentic recipes from around the world",
  },
  {
    title: "Meal Types",
    items: ["Breakfast", "Lunch", "Dinner", "Snacks", "Desserts", "Brunch"],
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Find the perfect recipe for any time of day",
  },
  {
    title: "Dietary Preferences",
    items: [
      "Vegetarian",
      "Vegan",
      "Gluten-Free",
      "Keto",
      "Paleo",
      "Low-Carb",
      "Dairy-Free",
    ],
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1974",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Recipes tailored to your dietary needs",
  },
  {
    title: "Cooking Techniques",
    items: [
      "Baking",
      "Grilling",
      "Roasting",
      "Sautéing",
      "Boiling",
      "Steaming",
      "Frying",
      "Smoking",
    ],
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1964",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Master different cooking methods",
  },
  {
    title: "Ingredients",
    items: ["Fruits", "Vegetables", "Proteins", "Grains", "Spices-and-Herbs"],
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Browse recipes by main ingredients",
  },
  {
    title: "Recipe Formats",
    items: [
      "Quick-Meals",
      "Slow-Cooker",
      "Instant-Pot",
      "Batch-Cooking",
      "No-Cook",
      "One-Bowl-Meals",
      "Kid-Friendly",
    ],
    image:
      "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=2070",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Find recipes that fit your cooking style",
  },
  {
    title: "Modern Trends",
    items: [
      "Plant-Based",
      "Fusion-Cuisine",
      "Healthy-Swaps",
      "Fermented-Foods",
      "Zero-Waste-Cooking",
    ],
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Stay up to date with food trends",
  },
  {
    title: "Seasonal Recipes",
    items: ["Spring", "Summer", "Fall", "Winter", "Holiday"],
    image:
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=1974",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Recipes for every season",
  },
  {
    title: "Global Flavors",
    items: [
      "Middle-Eastern",
      "South-American",
      "African",
      "Caribbean",
      "Nordic",
    ],
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Discover international cuisines",
  },
  {
    title: "Special Occasions",
    items: ["Birthday", "Anniversary", "Picnic", "Potluck", "Game-Day"],
    image:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=2080",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Perfect recipes for celebrations",
  },
];

function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.items.some((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      !selectedCategory || category.title === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar3 />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1
            className={`text-4xl md:text-5xl font-bold text-[#8D6271] mb-4 ${Poppins700.className}`}
          >
            Discover Recipes
          </h1>
          <p
            className={`text-lg text-gray-600 max-w-2xl mx-auto mb-8 ${Poppins400.className}`}
          >
            Explore our collection of recipes organized by cuisine, meal type,
            dietary preferences, and more.
          </p>

          {/* Search and Filter Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search recipes or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 rounded-full border-2 border-[#8D6271] focus:outline-none focus:ring-2 focus:ring-[#8D6271] focus:border-transparent transition-all duration-200"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-6 h-6 text-[#8D6271]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className="relative h-48">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(min-width: 768px) 50vw, (min-width: 1024px) 33vw, 100vw"
                  quality={75}
                  placeholder={`data:image/svg+xml;base64,${toBase64(
                    shimmer(300, 300)
                  )}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2
                    className={`text-2xl font-bold text-white ${Poppins700.className}`}
                  >
                    {category.title}
                  </h2>
                  <p className="text-white/90 text-sm mt-1">
                    {category.description}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">
                    {category.items.length} recipes
                  </span>
                  <Link
                    href={`/${category.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="text-[#8D6271] hover:text-[#7A5260] text-sm font-medium transition-colors duration-200"
                  >
                    View all →
                  </Link>
                </div>
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link
                        href={`/${category.title
                          .toLowerCase()
                          .replace(/\s+/g, "-")}/${item.toLowerCase()}`}
                        className={`block text-gray-700 hover:text-[#8D6271] transition-colors duration-200 ${Poppins400.className}`}
                      >
                        {DeSlugify(item)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className={`text-lg text-gray-600 ${Poppins400.className}`}>
              No recipes found matching your search. Try different keywords or
              browse all categories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipesPage;
