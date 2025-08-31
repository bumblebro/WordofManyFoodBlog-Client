import GETBLOGBYSECTION from "@/app/api/blogbysection/GETBLOGBYSECTION";
import { generateRSSFeed } from "@/app/utils/generateRSSFeed";

// export const revalidate = 0; // revalidate at most every sec
export const dynamic = "force-dynamic"; // revalidate at most every sec

export async function GET() {
  const recipes = await GETBLOGBYSECTION({ subCategory: "Coffee-and-Tea" });
  const xml = generateRSSFeed(recipes, "Coffee-and-Tea");
  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
