import { PrismaClient } from "@prisma/client";
import DeSlugify from "@/libs/DeSlugify";
import { Feed } from "feed";

const boardId = {
  "Summer-Grilling": "1047298157036640394", // Summer Grilling Recipes
  "BBQ-Classics": "1047298157036634740", // BBQ Classics Recipes
  "Summer-Lunch-Ideas": "1047298157036634724", // Summer Lunch Ideas
  "Summer-Salads-and-Sides": "1047298157036640721", // Summer Salads and Sides
  "Quick-Summer-Meals": "1047298157036634716", // Quick Summer Meals
  "Easy-Summer-Desserts": "1047298157036756404", // not found
  "Summer-Breakfast-Ideas": "1047298157036634738", // Summer Breakfast Ideas
  "Summer-Snacks-for-Kids": "1047298157036640725", // Summer Snacks for Kids
  "Rhubarb-Sauces-and-Jams": "1047298157036640713", // Rhubarb Sauces and Jams
  "Rhubarb-Baked-Goods": "1047298157036634717", // Rhubarb Baked Goods
  "Strawberry-Desserts": "1047298157036634728", // Strawberry Desserts
  "Strawberry-Breakfast-and-Drinks": "1047298157036634720", // Strawberry Breakfast and Drinks
  "Strawberry-Salads": "1047298157036634731", // Strawberry Salads
  Graduation: "1047298157036640714", // Graduation
  "Healthy-Eating": "1047298157036640723", // Healthy Eating
  "Cultural-Favorites": "1047298157036634711", // Cultural Favorites Recipes
  "Cool-Drinks": "1047298157036640390", // Cool Drinks
  "Pasta-and-Soups": "1047298157036634718", // Pasta and Soups
  "Crockpot-and-Camping": "1047298157036640392", // Crockpot and Camping Recipes
  "Fruit-Based-Desserts": "1047298157036634721", // Fruit Based Desserts
  "Frozen-Desserts": "1047298157036640393", // Frozen-Desserts
  "Baked-Desserts": "1047298157036640712", // Baked Desserts
  "Vegan-Recipes": "1047298157036640710", // Vegan Recipes
  "Keto-and-Low-Carb": "1047298157036634729", // Keto and Low Carb
  "Asian-Food": "1047298157036640730", // Asian Food Recipes
  "Mexican-Food": "1047298157036634726", // Mexican Food Recipes
  "Italian-Food": "1047298157036640728", // Italian Food Recipes
  "Summer-Fruits": "1047298157036634714", // Summer Fruits Recipes
  "Baked-Fruit": "1047298157036634715", // Baked Fruit Recipes
  Mocktails: "1047298157036640395", // Mocktails
  Smoothies: "1047298157036634732", // Smoothies
  "Coffee-and-Tea": "1047298157036640391", // Coffee and Tea
  "Single-Serve": "1047298157036634735", // Single Serve Recipes
  "Cheese-Based": "1047298157036640396", // Cheese Based Recipes
  "Milk-and-Yogurt": "1047298157036634739", // Milk and Yogurt Recipes
  "Roasted-Vegetables": "1047298157036634712", // Roasted Vegetables Recipes
  "Vegetable-Mains": "1047298157036640715", // Vegetable Mains
  "Beef-Recipes": "1047298157036640711", // Beef Recipes
  "Chicken-Recipes": "1047298157036640720", // Chicken Recipes
  "Low-Calorie-Meals": "1047298157036634727", // Low Calorie Meals
  "High-Protein-Recipes": "1047298157036640717", // High Protein Recipes
  "Meal-Prep": "1047298157036634737", // Meal Prep
  "Layer-Cakes": "1047298157036756526",
  "Healthy-Summer-Dinners": "1047298157036756527",
  "Breakfast-Ideas": "1047298157036756529",
  "Gluten-Free": "1047298157036756531",
  "Dinner-Ideas": "1047298157036756532",
  "Father's-Day": "1047298157036756533`",
  "Rhubarb-Desserts": "1047298157036756534",
  "Pork-Recipes": "1047298157036756536",
  "Lunch-Ideas": "1047298157036756537`",
  "Memorial-Day": "1047298157036756538",
  "Cold-Pasta-Salad-Recipes": "1047298157036756540",
  "Desserts-and-Cookies": "1047298157036756541",
};

export const dynamic = "force-dynamic";
const domain =
  process.env.NEXT_PUBLIC_BASE_API_URL?.replace(/^https:/, "http:") || "";

const count = parseInt(process.env.RANDOMBLOGCOUNT || "6", 10);

export async function GET(request: Request, response: Response) {
  // Fetch random blogs directly using Prisma
  const prisma = new PrismaClient();
  const totalBlogs = await prisma.foodBlogs.count();
  let blogs = [];
  if (totalBlogs <= count) {
    blogs = await prisma.foodBlogs.findMany({
      take: count,
      orderBy: { creationDate: "desc" },
    });
  } else {
    // Get unique random skips
    const skips = new Set<number>();
    while (skips.size < count) {
      skips.add(Math.floor(Math.random() * totalBlogs));
    }
    const blogPromises = Array.from(skips).map((skip) =>
      prisma.foodBlogs.findFirst({
        skip,
        select: {
          author: true,
          section: true,
          subsection: true,
          subsubsection: true,
          title: true,
          slug: true,
          imageurl: true,
          content: true,
          instructions: true,
          recipedescription: true,
          recipedetails: true,
          creationDate: true,
          seo: true,
        },
      })
    );
    blogs = (await Promise.all(blogPromises)).filter(Boolean);
  }
  await prisma.$disconnect();
  const rss = generateRSSFeed(blogs);
  return new Response(rss, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });

  function generateRSSFeed(blogs: any) {
    const siteURL = process.env.NEXT_PUBLIC_BASE_API_URL || "";
    const date = new Date();
    const author = {
      name: "SavoryTouch",
      link: "https://savorytouch.com",
    };

    const feed = new Feed({
      title: "SavoryTouch - Random Blogs",
      description:
        "A random selection of 6 blogs from SavoryTouch. Discover something new each time!",
      id: siteURL,
      link: siteURL,
      image: `${siteURL}/opengraph-image.png`,
      favicon: `${siteURL}/favicon.ico`,
      copyright: `All rights reserved ${date.getFullYear()}`,
      updated: date,
      generator: "Feed",
      feedLinks: {
        rss2: `${siteURL}/feed/random.xml`,
        json: `${siteURL}/feed/random.json`,
      },
      author,
      language: "en-us",
    });

    blogs.forEach((r: any) => {
      const id = boardId[r.subsection as keyof typeof boardId];

      const hasImageExtension = /\.(jpe?g|png|gif|webp|bmp)$/i.test(r.imageurl);
      if (hasImageExtension) {
        const imageUrl =
          process.env.NEXT_PUBLIC_BASE_API_URL +
          `/api/og?` +
          `title=${r.title}` +
          `&cover=${r.imageurl}`;
        const url = siteURL + "/" + r.slug;
        feed.addItem({
          title: DeSlugify(r.title),
          id: url,
          link: url,
          description: r.recipedescription,
          author: [author],
          contributor: [author],
          date: new Date(Date.now() - 60 * 60 * 1000), // pubDate is set to 1 hour before now
          category: [
            { name: id },
            { name: r.subsection },
            { name: r.subsubsection },
          ],
          image: {
            type: "image/png",
            url:
              domain +
              `/api/og?title=${r.title}&amp;cover=${encodeURIComponent(
                r.imageurl
              )}`,
          },
        });
      }
    });
    return feed.rss2();
  }
}
