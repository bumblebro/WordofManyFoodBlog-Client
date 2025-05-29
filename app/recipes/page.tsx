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
    title: "Grilling Recipes",
    items: ["Summer-Grilling", "BBQ-Classics"],
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Discover delicious grilling recipes for every occasion",
  },
  {
    title: "Summer Recipes",
    items: [
      "Cold-Pasta-Salad-Recipes",
      "Summer-Lunch-Ideas",
      "Summer-Salads-and-Sides",
      "Healthy-Summer-Dinners",
      "Quick-Summer-Meals",
      "Easy-Summer-Desserts",
      "Summer-Breakfast-Ideas",
      "Summer-Snacks-for-Kids",
    ],
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Fresh and vibrant recipes perfect for summer",
  },
  {
    title: "Rhubarb Recipes",
    items: [
      "Rhubarb-Desserts",
      "Rhubarb-Sauces-and-Jams",
      "Rhubarb-Baked-Goods",
    ],
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1964",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Explore sweet and tangy rhubarb creations",
  },
  {
    title: "Strawberry Recipes",
    items: [
      "Strawberry-Desserts",
      "Strawberry-Breakfast-and-Drinks",
      "Strawberry-Salads",
    ],
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Sweet and refreshing strawberry delights",
  },
  {
    title: "Holiday and Occasion",
    items: ["Memorial-Day", "Graduation", "Father's-Day"],
    image:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=2080",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Special recipes for celebrations and holidays",
  },
  {
    title: "Specialty and Seasonal",
    items: ["Healthy-Eating", "Cultural-Favorites", "Cool-Drinks"],
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Unique and seasonal culinary experiences",
  },
  {
    title: "Popular Categories",
    items: [
      "Dinner-Ideas",
      "Lunch-Ideas",
      "Breakfast-Ideas",
      "Desserts-and-Cookies",
      "Pasta-and-Soups",
      "Crockpot-and-Camping",
    ],
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Browse our most popular recipe collections",
  },
  {
    title: "Desserts",
    items: ["Fruit-Based-Desserts", "Frozen-Desserts", "Baked-Desserts"],
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1974",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Sweet treats for every occasion",
  },
  {
    title: "Special Diet",
    items: ["Vegan-Recipes", "Gluten-Free", "Keto-and-Low-Carb"],
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Recipes for specific dietary needs",
  },
  {
    title: "World Cuisine",
    items: ["Asian-Food", "Mexican-Food", "Italian-Food"],
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Explore global culinary traditions",
  },
  {
    title: "Fruit",
    items: ["Summer-Fruits", "Baked-Fruit"],
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Fresh and creative fruit recipes",
  },
  {
    title: "Drinks",
    items: ["Mocktails", "Smoothies", "Coffee-and-Tea"],
    image:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1975",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Refreshing beverages for any time",
  },
  {
    title: "Cake",
    items: ["Layer-Cakes", "Single-Serve"],
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1989",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Delicious cake recipes for every occasion",
  },
  {
    title: "Dairy",
    items: ["Cheese-Based", "Milk-and-Yogurt"],
    image:
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=2073",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Creamy and delicious dairy recipes",
  },
  {
    title: "Vegetables",
    items: ["Roasted-Vegetables", "Vegetable-Mains"],
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Fresh and flavorful vegetable dishes",
  },
  {
    title: "Meat",
    items: ["Beef-Recipes", "Chicken-Recipes", "Pork-Recipes"],
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Satisfying meat-based recipes",
  },
  {
    title: "Healthy Recipes",
    items: ["Low-Calorie-Meals", "High-Protein-Recipes", "Meal-Prep"],
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053",
    color: "bg-[#8D6271]",
    hoverColor: "hover:bg-[#7A5260]",
    description: "Nutritious and balanced meal options",
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
