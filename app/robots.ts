import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          "*",
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "PerplexityBot",
          "Google-Extended",
          "Googlebot",
          "Bingbot",
        ],
        allow: ["/", "/api/artifacts", "/llms.txt", "/llms-full.txt"],
        disallow: ["/*/saved"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },
    ],
    sitemap: "https://btvh.vercel.app/sitemap.xml",
  };
}
