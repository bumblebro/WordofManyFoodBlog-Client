"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { FoodBlogs } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { shimmer, toBase64 } from "@/libs/Shimmer";
import DeSlugify from "@/libs/DeSlugify";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import Navbar3 from "@/components/navbar3/page";

const Poppins700 = Poppins({
  weight: "700",
  subsets: ["latin"],
});

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState<FoodBlogs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(query || "");
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setLoading(true);
      setError(null);
      try {
        console.log("Fetching results for query:", query);
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        console.log("Search response:", data);

        if (data.error) {
          setError(data.error);
          setResults([]);
        } else {
          setResults(data.results || []);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("Failed to fetch search results");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for recipes..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D6271] focus:border-transparent text-base sm:text-lg"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-[#8D6271] text-white rounded-lg hover:bg-[#7a5260] transition-colors text-base sm:text-lg whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </form>

        {!query ? (
          <div>
            <h1
              className={`text-2xl sm:text-3xl font-semibold mb-4 ${Poppins700.className}`}
            >
              Search Recipes
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Enter a search term to find recipes.
            </p>
          </div>
        ) : (
          <>
            <h1
              className={`text-2xl sm:text-3xl font-semibold mb-4 ${Poppins700.className}`}
            >
              Search Results for &ldquo;{query}&rdquo;
            </h1>

            {loading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8D6271]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 text-base sm:text-lg">{error}</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 text-base sm:text-lg">
                  No recipes found matching your search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {results.map((recipe) => (
                  <Link
                    key={recipe.id}
                    href={`/${
                      recipe.section !== "null"
                        ? recipe.section.toLowerCase() + "/"
                        : ""
                    }${
                      recipe.subsection !== "null"
                        ? recipe.subsection.toLowerCase() + "/"
                        : ""
                    }${
                      recipe.subsubsection !== "null"
                        ? recipe.subsubsection.toLowerCase() + "/"
                        : ""
                    }${recipe.title.toLowerCase()}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                      <div className="relative h-48 sm:h-56">
                        <Image
                          src={recipe.imageurl}
                          alt={recipe.imagealt}
                          fill
                          className="object-cover"
                          sizes="(min-width: 768px) 50vw, 100vw"
                          quality={75}
                          placeholder={`data:image/svg+xml;base64,${toBase64(
                            shimmer(300, 300)
                          )}`}
                        />
                      </div>
                      <div className="p-4">
                        <span className="text-sm text-gray-600 block mb-2">
                          {DeSlugify(recipe.subsection)}
                        </span>
                        <h3
                          className={`text-lg font-semibold line-clamp-2 group-hover:text-[#8D6271] transition-colors ${Poppins700.className}`}
                        >
                          {DeSlugify(recipe.title)}
                        </h3>
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                          {recipe.recipedescription}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <Navbar3 />
      <Suspense
        fallback={
          <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8D6271]"></div>
              </div>
            </div>
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </>
  );
}
