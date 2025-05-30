import GETBLOGBYSECTION from "@/app/api/blogbysection/GETBLOGBYSECTION";
import { generateRSSFeed } from "@/app/utils/generateRSSFeed";

export const revalidate = 0;

export async function GET() {
  const recipes = await GETBLOGBYSECTION({
    subCategory: "Low-Calorie-Meals",
  });
  const xml = generateRSSFeed(recipes, "Low-Calorie-Meals");
  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
