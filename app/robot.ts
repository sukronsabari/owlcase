import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL!;
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/cart/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
