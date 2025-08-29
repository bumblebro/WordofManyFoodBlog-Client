import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GETRANDOMBLOG() {
  try {
    // First, get the total count of blogs
    const totalBlogs = await prisma.foodBlogs.count();
    console.log(totalBlogs);
    // Generate a random skip value
    const randomSkip = Math.floor(Math.random() * totalBlogs);
    console.log(randomSkip);
    // Get one random blog post
    const randomBlog = await prisma.foodBlogs.findFirst({
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
      skip: randomSkip,
    });
    // console.log(randomBlog);
    if (!randomBlog) {
      return NextResponse.json(
        { error: "No blog post found" },
        { status: 404 }
      );
    }

    return [randomBlog];
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
