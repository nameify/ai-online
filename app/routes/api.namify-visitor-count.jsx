import prisma from "../db.server";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const loader = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  const url = new URL(request.url);
  const productID = url.searchParams.get("productId");
  const productTitle = url.searchParams.get("productTitle"); // 1. Get the title
  const shop = url.searchParams.get("shop");
  const visitorID = url.searchParams.get("visitorId");

  if (!productID || !shop || !visitorID) {
    return new Response(JSON.stringify({ message: "Missing parameters" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  try {
    const existingVisit = await prisma.productVisit.findFirst({
      where: {
        shop,
        productId: productID,
        visitorId: visitorID,
        visitedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    let currentCount = 0;

    if (!existingVisit) {
      await prisma.productVisit.create({
        data: { shop, productId: productID, visitorId: visitorID },
      });

      const analytics = await prisma.productAnalytics.upsert({
        where: {
          shop_productId: { shop, productId: productID },
        },
        update: {
          viewCount: { increment: 1 },
          productTitle: productTitle || undefined, // Updates title if provided
        },
        create: {
          shop,
          productId: productID,
          productTitle: productTitle || "Unknown Product", // Fallback for first-time save,
          viewCount: 1,
        },
      });

      currentCount = analytics.viewCount;
    } else {
      const analytics = await prisma.productAnalytics.findUnique({
        where: { shop_productId: { shop, productId: productID } },
      });

      currentCount = analytics ? analytics.viewCount : 0;
    }

    return new Response(
      JSON.stringify({
        status: 200,
        message: "success",
        views: currentCount,
      }),
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error("API Error:", error);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};
