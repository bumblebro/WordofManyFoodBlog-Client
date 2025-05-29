"use client";
import { useState } from "react";
import MarkdownComponent from "./Markdown";

export const ExpandableContent = ({ content }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="flex flex-col pb-6 px-4 xl:px-0">
      {/* Show only a part of content when collapsed */}
      <div
        className={`leading-[1.7rem] font-[330] text-black ${
          isExpanded ? "mb-4" : "line-clamp-3"
        }`}
      >
        <MarkdownComponent text={content} />
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleExpand}
        className="text-blue-600 hover:underline font-semibold"
      >
        {isExpanded ? "Show Less" : "Read More"}
      </button>
    </div>
  );
};

