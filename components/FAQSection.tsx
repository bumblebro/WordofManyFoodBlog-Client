"use client";
import { useEffect, useState } from "react";
import localFont from "next/font/local";

import { Poppins } from "next/font/google";
import DeSlugify from "@/libs/DeSlugify";
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
// export const FAQSection = ({ faqs }: any) => {
//   const [openIndex, setOpenIndex] = useState(null);

//   const toggleFAQ = (index: any) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <div
//       className={`faq-section  my-10 ${Poppins400.className}  border-b border-slate-300 `}
//     >
//       {" "}
//       <div className="flex items-center text-center mb-4 gap-4">
//         {" "}
//         {/* <h1 className="bg-[#CBAFB7] rounded-full px-[6px] md:px-[8px]  text-4xl">
//           ?
//         </h1> */}
//         <h2
//           className={`text-2xl font-semibold    ${Poppins700.className} italic mx-4`}
//         >
//           Frequently Asked Questions
//         </h2>
//       </div>
//       <div className=" ">
//         {faqs.map((item: any, index: any) => (
//           <div
//             key={index}
//             className=" pb-4 border border-b-0 border-slate-300  px-4 py-4"
//           >
//             {/* Question - Click to toggle */}
//             <button
//               className={` text-lg md:text-xl  font-medium mb-2 flex justify-between w-full text-left ${Poppins700.className}`}
//               onClick={() => toggleFAQ(index)}
//             >
//               {item.question}
//               <span className="ml-2 ">
//                 {openIndex === index ? (
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="20"
//                     height="20"
//                   >
//                     <path d="m12 6.586-8.707 8.707 1.414 1.414L12 9.414l7.293 7.293 1.414-1.414L12 6.586z" />
//                   </svg>
//                 ) : (
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="20"
//                     height="20"
//                   >
//                     <path d="M12 17.414 3.293 8.707l1.414-1.414L12 14.586l7.293-7.293 1.414 1.414L12 17.414z" />
//                   </svg>
//                 )}
//               </span>
//             </button>

//             {/* Answer - Show if active */}
//             {openIndex === index && (
//               <p className="text-gray-700">{item.answer}</p>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

export const FAQSection = ({ faqs, title }: any) => {
  const [openIndexes, setOpenIndexes] = useState<boolean[]>([]);

  // Set all FAQs open initially
  useEffect(() => {
    setOpenIndexes(faqs.map(() => true));
  }, [faqs]);

  const toggleFAQ = (index: number) => {
    setOpenIndexes((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  return (
    <div
      className={`faq-section my-10 ${Poppins400.className} border-b border-slate-300`}
    >
      <div className="flex  mb-4 gap-4">
        <h2
          className={`text-xl font-semibold ${Poppins700.className} italic mx-4 uppercase text-start`}
        >
          {DeSlugify(title)}: Frequently Asked Questions
        </h2>
      </div>

      <div>
        {faqs.map((item: any, index: number) => (
          <div
            key={index}
            className="pb-4 border border-b-0 border-slate-300 px-4 py-4"
          >
            <button
              className={`text-lg md:text-xl font-medium mb-2 flex justify-between w-full text-left ${Poppins700.className}`}
              onClick={() => toggleFAQ(index)}
            >
              {item.question}
              <span className="ml-2">
                {openIndexes[index] ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                  >
                    <path d="m12 6.586-8.707 8.707 1.414 1.414L12 9.414l7.293 7.293 1.414-1.414L12 6.586z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                  >
                    <path d="M12 17.414 3.293 8.707l1.414-1.414L12 14.586l7.293-7.293 1.414 1.414L12 17.414z" />
                  </svg>
                )}
              </span>
            </button>

            {openIndexes[index] && (
              <p className="text-gray-700">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
