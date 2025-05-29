"use client";

import { useEffect, useState } from "react";
// import Scroll from "react-scroll";
import { Poppins } from "next/font/google";
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
function Buttons() {
  const [Component, setComponent] = useState<JSX.Element>();

  useEffect(() => {
    async function loadModule() {
      const Scroll = await import("react-scroll");
      const ScrollLink = Scroll.Link;

      setComponent(
        <div
          className={` text-xs font-medium tracking-wider py-6 lg:py-4 px-3 lg:w-[45%] xl:px-0  ${Poppins400.className}`}
        >
          {/* Jump to Recipe Button */}
          <ScrollLink
            to="recipeSection"
            offset={-100}
            smooth={true}
            duration={500}
          >
            {" "}
            <button
              // onClick={() =>
              //   recipeRef.current?.scrollIntoView({ behavior: "smooth" })
              // }
              className="uppercase flex justify-center items-center   gap-2 bg-[#F4F2F2] hover:bg-[#8D6271] rounded-md px-4 py-2 text-black hover:text-white transition-all duration-300"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                strokeWidth="1.5"
                // stroke="currentColor"
                className="size-6 text-white hover:text-black"
                // xml:space="preserve"
              >
                <path d="m256 502 150-200h-80V146H186v156h-80zM186 78h140v40H186zM186 10h140v40H186z" />
              </svg>
              <h1 className="inline-block ">Jump to Recipe</h1>
              {/* <button className="w-full py-[0.6rem] uppercase flex justify-center items-center">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              // xml:space="preserve"
              
            >
              <path
                fill="#000000"
                d="m256 502 150-200h-80V146H186v156h-80zM186 78h140v40H186zM186 10h140v40H186z"
              />
            </svg>
            <h1>Jump to Recipe</h1>
          </button> */}
            </button>{" "}
          </ScrollLink>

          {/* Save Recipe Button */}
          {/* <button
          onClick={downloadPDF}
          className="uppercase flex justify-center items-center bg-[#6b4226] rounded-md py-[0.6rem] w-full gap-2 hover:bg-[#4e2f1dd0] transition-all"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75 9 17.25 19.5 6.75"
            />
          </svg>
          <h1>Save Recipe</h1>
        </button> */}
        </div>
      );
    }
    void loadModule();
  }, []);
  return Component;
}

export default Buttons;
