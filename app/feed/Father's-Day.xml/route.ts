import GETBLOGBYSECTION from "@/app/api/blogbysection/GETBLOGBYSECTION";
import { generateRSSFeed } from "@/app/utils/generateRSSFeed";

export const revalidate = 0;

export async function GET(request: Request) {
  const recipes = await GETBLOGBYSECTION({ subCategory: "Father's-Day" });
  const rss = generateRSSFeed(recipes, "Father's-Day");

  return new Response(rss, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
