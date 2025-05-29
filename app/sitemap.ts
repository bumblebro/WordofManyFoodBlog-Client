import { MetadataRoute } from "next";
import GETBLOG from "./api/blogs/GETBLOG";
import GenerateSlugs from "@/libs/GenerateSlugs";
import { subSections } from "@/libs/Section";
import GETBLOGALL from "./api/blogsall/GETBLOGALL";

export const revalidate = 43200; // 1/2 day in seconds

async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await GETBLOG({ pageNo: "1" });
    const totalpage = response.metaData.totalPages;
    const blogslug: MetadataRoute.Sitemap = [];

    const sluglayer = await GenerateSlugs(subSections);
    const categoryslug: MetadataRoute.Sitemap = sluglayer.map((item: any) => {
      let str = "";
      item.slug.map((item: any) => {
        str = `${str.toLowerCase()}/${encodeURIComponent(item).toLowerCase()}`;
      });
      return {
        url: `${process.env.NEXT_PUBLIC_BASE_API_URL}${str.toLowerCase()}`,
        lastModified: new Date(),
      };
    });

    let paramsArray: MetadataRoute.Sitemap = [];
    let page = 0;
    const pageSize = 200; // Increased to reduce number of API calls
    const maxPages = 20; // Safety limit: 200 * 20 = 4000 blogs max, sufficient for 1700 blogs

    while (page < maxPages) {
      const response = await GETBLOGALL(page, pageSize);

      if (!response || response.length === 0) {
        break;
      }

      const titleslug: MetadataRoute.Sitemap = response.map((item: any) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/${encodeURIComponent(
          item.section
        ).toLowerCase()}/${encodeURIComponent(
          item.subsection
        ).toLowerCase()}/${encodeURIComponent(
          item.subsubsection
        ).toLowerCase()}/${encodeURIComponent(item.title).toLowerCase()}`,
        lastModified: item.creationDate,
      }));

      paramsArray = [...paramsArray, ...titleslug];
      page++;
    }

    return [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/about`,
        lastModified: new Date(),
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/privacy-policy`,
        lastModified: new Date(),
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/website-disclaimer`,
        lastModified: new Date(),
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/terms`,
        lastModified: new Date(),
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASE_API_URL}`,
        lastModified: new Date(),
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/blog`,
        lastModified: new Date(),
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/blog/page/1`,
        lastModified: new Date(),
      },
      ...paramsArray,
      ...categoryslug,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return []; // Return empty sitemap in case of error
  }
}

export default sitemap;
