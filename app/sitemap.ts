import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://savemyreel.xyz";
  const routes = [
    "",
    "/video",
    "/photo",
    "/reels",
    "/story",
    "/igtv",
    "/carousel",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions"
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8
  }));
}
