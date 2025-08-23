"use client";

import DeSlugify from "@/libs/DeSlugify";
import { useState, useRef, useEffect } from "react";
// import html2pdf from "html2pdf.js";
import localFont from "next/font/local";

import { Poppins } from "next/font/google";
import AdContainerForDesktop from "./Ads/AdContainerForDesktop";
import AdContainerForMobile from "./Ads/AdContainerForMobile";
// import AdCode from "./AdCode";
// import { DisplayAdUnit, MediumRectangleAdUnit } from "./Ads/ad-unit";
// import AdContainerForDesktop from "./Ads/AdContainerForDesktop";
// import AdContainerForMobile from "./Ads/AdContainerForMobile";
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
// const freight = localFont({
//   src: "../app/fonts/freight-neo-pro-book.otf",
// });

// const freightlight = localFont({
//   src: "../app/fonts/fonnts.com-FreightNeo_Pro_Light.otf",
// });

// const freightbig = localFont({
//   src: "../app/fonts/Freight Big Pro Medium Italic.otf",
// });

function timeToISO8601Duration(seconds: number) {
  const units = [
    { symbol: "Y", value: 365 * 24 * 3600 },
    { symbol: "D", value: 24 * 3600 },
    { symbol: "H", value: 3600 },
    { symbol: "M", value: 60 },
    { symbol: "S", value: 1 },
  ];

  let duration = "P";
  let hasTime = false;

  for (const { symbol, value } of units) {
    const quotient = Math.floor(seconds / value);
    if (quotient > 0) {
      seconds -= quotient * value;
      if (!hasTime && ["H", "M", "S"].includes(symbol)) {
        duration += "T";
        hasTime = true;
      }
      duration += `${quotient}${symbol}`;
    }
  }

  return duration;
}

const RecipePage = ({ currentPost }: any) => {
  const [selectedQuantity, setSelectedQuantity] = useState("1X");
  const recipeRef = useRef(null);
  const [html2pdf, setHtml2pdf] = useState<Function | null>(null); // State to hold the html2pdf function
  const siteURL = process.env.NEXT_PUBLIC_BASE_API_URL || "";
  const domain =
    process.env.NEXT_PUBLIC_BASE_API_URL?.replace(/^https:/, "http:") || "";
  useEffect(() => {
    async function loadModule() {
      const impmodule = await import("html2pdf.js");
      setHtml2pdf(() => impmodule.default); // Set the html2pdf function
    }
    loadModule();
  }, []);

  const recipeDetails = currentPost.recipedetails?.[selectedQuantity] || {
    ingredients: [],
    instructions: [],
    nutrition: {},
    notes: [],
    yield: "",
    cookTime: "",
    totalTime: "",
    preparationTime: "",
  };
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    new Array(recipeDetails.ingredients.length).fill(false)
  );

  const handleCheck = (index: number) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  };

  const options = {
    filename: currentPost.title,
    margin: 0,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  const downloadPDF = async () => {
    const content = recipeRef.current;
    html2pdf?.().set(options).from(content).save();
  };

  const generatePinterestUrl = ({ pageUrl, imageUrl, description }: any) => {
    const baseUrl = "https://www.pinterest.com/pin/create/bookmarklet/?";
    const params = new URLSearchParams({
      url: pageUrl,
      media: imageUrl,
      description,
    });

    return `${baseUrl}${params.toString()}`;
  };

  return (
    <div
      // className={`flex flex-col items-center min-h-screen  py-4 w-full   tracking-[1.275px] ${Poppins400.className} `}
      className={`flex flex-col items-center min-h-screen  pb-4 w-full  ${Poppins400.className} my-10`}
      id="recipeSection"
    >
      <div
        ref={recipeRef}
        className="w-full max-w-4xl bg-white shadow-lg   border border-gray-300 pb-12"
      >
        {/* Recipe Title */}
        <div
          className="relative py-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${currentPost?.imageurl})`,
          }}
        >
          <div className="absolute inset-0 bg-black/60" /> {/* Dark overlay */}
          <div className="relative z-10">
            <h1
              className={`text-3xl text-center text-white p-name ${Poppins700.className} pb-5 uppercase`}
            >
              {DeSlugify(currentPost?.title)}
            </h1>
            {/* Recipe Description */}
            <p className="text-white text-center italic text-base p-summary max-w-3xl mx-auto px-4">
              {currentPost?.recipedescription}
            </p>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex justify-center space-x-3 my-12">
          {["1X", "2X", "3X", "4X"].map((qty) => (
            <button
              key={qty}
              onClick={() => {
                setSelectedQuantity(qty);
                setCheckedItems(
                  new Array(recipeDetails?.ingredients?.length).fill(false)
                );
              }}
              className={`px-5 py-2  text-base  transition-all ${
                selectedQuantity === qty
                  ? "bg-[#8D6271] text-white shadow-md"
                  : " text-gray-800 hover:bg-gray-200"
              }`}
            >
              {qty}
            </button>
          ))}
        </div>
        {/* Yield & Time Info */}
        <div className="mx-4 p-2 sm:p-6  shadow-md border border-gray-300  flex flex-col lg:flex-row justify-between items-start lg:items-center my-12">
          <div className="my-auto">
            <h2
              className={`text-xl  text-[#000000] mb-3  ${Poppins700.className} italic`}
            >
              ⏳ Yield & Time
            </h2>
            <p className="text-base p-yield">
              <strong>Yield:</strong>{" "}
              <span className="p-yield">{recipeDetails?.yield}</span> servings
            </p>
            <p className="text-base">
              <strong>Preparation Time:</strong>{" "}
              {Math.floor(parseInt(recipeDetails?.preparationTime) / 60)}{" "}
              minutes
            </p>
            <p className="text-base">
              <strong>Cook Time:</strong>{" "}
              {Math.floor(parseInt(recipeDetails?.cookTime) / 60)} minutes
            </p>
            <p className="text-base dt-duration  ">
              <strong>Total Time:</strong>{" "}
              <time
                className="dt-duration"
                dateTime={timeToISO8601Duration(recipeDetails?.totalTime)}
              >
                {Math.floor(parseInt(recipeDetails?.totalTime) / 60)} minutes
              </time>
            </p>
            {/* <time className="dt-duration" dateTime="1H">
            15 min
          </time> */}
          </div>
          <AdContainerForDesktop />
        </div>

        {/* Ingredients */}
        {/* <div className=" p-6 rounded-lg shadow-md border border-gray-300 ">
          <h2 className="text-xl font-serif text-[#6b4226] mb-3">
            🍽 Ingredients
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-lg">
            {recipeDetails.ingredients.map((ingredient: any, index: any) => (
              <li key={index} className="text-black text-base">
                {ingredient.quantity} {ingredient.name}
              </li>
            ))}
          </ul>
        </div> */}
        <AdContainerForMobile />

        <div className="mx-4  p-2 sm:p-6  shadow-md border border-gray-300  flex flex-col lg:flex-row justify-between items-start lg:items-center my-12 ">
          <div className="my-auto">
            <h2
              className={`text-xl  text-[#000000] mb-3  ${Poppins700.className} italic`}
            >
              🍽 Ingredients
            </h2>
            <ul className="  space-y-2 text-lg">
              {recipeDetails?.ingredients?.map(
                (ingredient: any, index: any) => (
                  <li
                    key={index}
                    className={`text-black text-base ${
                      checkedItems[index] ? "line-through" : ""
                    }`}
                  >
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={checkedItems[index]}
                        onChange={() => handleCheck(index)}
                        className="h-4 w-4 text-[#8D6271] checked:bg-[#8D6271] border-[#8D6271] focus:ring-[#8D6271]"
                      />
                      <span
                        className="p-ingredient
"
                      >
                        {ingredient?.quantity} {ingredient?.name}
                      </span>
                    </label>
                  </li>
                )
              )}
            </ul>
          </div>
          <AdContainerForDesktop />
        </div>
        {/* <DisplayAdUnit format="auto" /> */}
        <AdContainerForMobile />

        {/* Instructions */}
        <div className="mx-4  p-2 sm:p-6  shadow-md border border-gray-300  my-12">
          <h2
            className={`text-xl  text-[#000000] mb-3  ${Poppins700.className} italic`}
          >
            📖 Instructions
          </h2>
          <ol className="list-decimal pl-4 space-y-2 text-lg ">
            {currentPost?.instructions?.map((instruction: any, index: any) => (
              <li
                key={index}
                className="text-black text-base e-instructions
"
              >
                {instruction}
              </li>
            ))}
          </ol>
        </div>
        {/* Notes */}
        <AdContainerForMobile />

        <div className="mx-4  p-2 sm:p-6  shadow-md border border-gray-300  my-12 flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div className="my-auto">
            <h2
              className={`text-xl  text-[#000000] mb-3  ${Poppins700.className} italic`}
            >
              📝 Notes
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-lg">
              {recipeDetails?.notes?.map((note: any, index: any) => (
                <li key={index} className="text-black text-base">
                  {note}
                </li>
              ))}
            </ul>
          </div>
          <AdContainerForDesktop />
        </div>
        {/* <DisplayAdUnit format="auto" /> */}
        <AdContainerForMobile />

        {/* Nutrition Info */}
        <div className="mx-4  p-2 sm:p-6  shadow-md border border-gray-300 flex flex-col lg:flex-row justify-between items-start lg:items-center mt-12">
          <div>
            <h2
              className={`text-xl  text-[#000000] mb-3  ${Poppins700.className} italic`}
            >
              🍎 Nutrition
            </h2>
            <p
              className="text-base p-nutrition pl-4
"
            >
              <strong>Calories:</strong> {recipeDetails?.nutrition?.calories}
            </p>
            <p
              className="text-base p-nutrition pl-4
"
            >
              <strong>Protein:</strong> {recipeDetails?.nutrition?.protein}
            </p>
            <p
              className="text-base p-nutrition pl-4
"
            >
              <strong>Fat:</strong> {recipeDetails?.nutrition?.fat}
            </p>
            <p
              className="text-base p-nutrition pl-4
"
            >
              <strong>Carbohydrates:</strong>{" "}
              {recipeDetails?.nutrition?.carbohydrates}
            </p>
            <p
              className="text-base p-nutrition pl-4
"
            >
              <strong>Fiber:</strong> {recipeDetails?.nutrition?.fiber}
            </p>
            <p
              className="text-base p-nutrition pl-4
"
            >
              <strong>Calcium:</strong> {recipeDetails?.nutrition?.calcium}
            </p>
          </div>
          <AdContainerForDesktop />
        </div>
      </div>
      <div className=" w-full flex lg:ml-6 lg:justify-start gap-4 justify-center mt-6">
        {" "}
        <button
          onClick={downloadPDF}
          className={`mt-4 px-5 py-2  shadow-md transition-all hover:bg-black text-white bg-[#8D6271] duration-400 uppercase ${Poppins700.className}  `}
        >
          📜 Print Recipe
        </button>
        <a
          target="_blank"
          href={generatePinterestUrl({
            pageUrl: siteURL + "/" + DeSlugify(currentPost.slug),
            imageUrl:
              domain +
              `/api/og?title=${
                currentPost.title
              }&amp;cover=${encodeURIComponent(currentPost.imageurl)}`,
            description: currentPost.recipedescription,
          })}
        >
          <button
            className={`mt-4 px-5 py-2  shadow-md transition-all hover:bg-black text-white bg-[#E60022] duration-400 uppercase ${Poppins700.className}  `}
          >
            📌 Pin Recipe
          </button>
        </a>
      </div>
    </div>
  );
};

export default RecipePage;
