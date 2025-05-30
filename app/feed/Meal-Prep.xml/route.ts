import GETBLOGBYSECTION from "@/app/api/blogbysection/GETBLOGBYSECTION";
import { generateRSSFeed } from "@/app/utils/generateRSSFeed";

export const revalidate = 0;

export async function GET() {
  const recipes = await GETBLOGBYSECTION({
    subCategory: "Meal-Prep",
  });
  const xml = generateRSSFeed(recipes, "Meal-Prep");
  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
