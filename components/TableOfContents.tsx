import { useEffect, useState } from "react";
import Link from "next/link";

interface TableOfContentsProps {
  content: string;
  className?: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({
  content,
  className = "",
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from content
    const headingRegex = /<h([2-3])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[2-3]>/g;
    const matches = Array.from(content.matchAll(headingRegex));

    const extractedHeadings = matches.map((match) => ({
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, ""), // Remove any HTML tags
      level: parseInt(match[1]),
    }));

    setHeadings(extractedHeadings);

    // Set up intersection observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    // Observe all headings
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [content]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      className={`sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto ${className}`}
      aria-label="Table of contents"
    >
      <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
      <ul className="space-y-2">
        {headings.map(({ id, text, level }) => (
          <li
            key={id}
            className={`${
              level === 3 ? "ml-4" : ""
            } transition-colors duration-200`}
          >
            <Link
              href={`#${id}`}
              className={`block py-1 ${
                activeId === id
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-blue-600"
              }`}
              scroll={false}
            >
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
