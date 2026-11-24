import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://btvh.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/api/artifacts",
          "/llms.txt",
          "/llms-full.txt",
        ],
        disallow: ["/*/saved"],
      },
      {
        userAgent: [
          "Googlebot",
          "Googlebot-Image",
          "Bingbot",
          "YandexBot",
        ],
        allow: "/",
        disallow: ["/*/saved"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "ClaudeBot",
          "anthropic-ai",
          "PerplexityBot",
          "Google-Extended",
          "Applebot",
          "Applebot-Extended",
          "cohere-ai",
        ],
        allow: [
          "/",
          "/llms.txt",
          "/llms-full.txt",
          "/api/artifacts",
        ],
        disallow: ["/*/saved"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
