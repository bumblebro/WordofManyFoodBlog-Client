import GETBLOGBYSECTION from "@/app/api/blogbysection/GETBLOGBYSECTION";
import { generateRSSFeed } from "@/app/utils/generateRSSFeed";

export const revalidate = 0;

export async function GET(request: Request) {
  const recipes = await GETBLOGBYSECTION({ subCategory: "Italian-Food" });
  const rss = generateRSSFeed(recipes, "Italian-Food");

  return new Response(rss, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
