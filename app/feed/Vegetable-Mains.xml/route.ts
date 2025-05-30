import GETBLOGBYSECTION from "@/app/api/blogbysection/GETBLOGBYSECTION";
import { generateRSSFeed } from "@/app/utils/generateRSSFeed";

export const revalidate = 0;

export async function GET(request: Request) {
  const recipes = await GETBLOGBYSECTION({ subCategory: "Vegetable-Mains" });
  const rss = generateRSSFeed(recipes, "Vegetable-Mains");

  return new Response(rss, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
