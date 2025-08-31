import GETBLOGBYSECTION from "@/app/api/blogbysection/GETBLOGBYSECTION";
import { generateRSSFeed } from "@/app/utils/generateRSSFeed";

// export const revalidate = 0; // revalidate at most every sec
export const dynamic = "force-dynamic"; // revalidate at most every sec

export async function GET(request: Request) {
  const recipes = await GETBLOGBYSECTION({ subCategory: "Rhubarb-Desserts" });
  const rss = generateRSSFeed(recipes, "Rhubarb-Desserts");

  return new Response(rss, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
