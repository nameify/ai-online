import prisma from "../db.server";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};


export const loader = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return new Response(
      JSON.stringify({ message: "Shop parameter is required" }),
      { status: 400, headers: corsHeaders },
    );
  }

  // ✅ Pagination Setup
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = 50;
  const skip = (page - 1) * limit;

  try {
    // 1️⃣ Date Ranges
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 2️⃣ Run queries in parallel
    const [
      totalVisitsResult,
      todayVisits,
      last7DaysVisits,
      productData,
      totalProducts,
    ] = await Promise.all([
      // A. Total Visits
      prisma.productAnalytics.aggregate({
        _sum: { viewCount: true },
        where: { shop },
      }),

      // B. Today's Visits
      prisma.productVisit.count({
        where: {
          shop,
          visitedAt: { gte: startOfToday },
        },
      }),

      // C. Last 7 Days
      prisma.productVisit.count({
        where: {
          shop,
          visitedAt: { gte: sevenDaysAgo },
        },
      }),

      // D. Paginated Product List
      prisma.productAnalytics.findMany({
        where: { shop },
        orderBy: { lastUpdated: "desc" },
        skip,
        take: limit,
      }),

      // E. Total Product Count (for pagination)
      prisma.productAnalytics.count({
        where: { shop },
      }),
    ]);

    const totalVisits = totalVisitsResult?._sum?.viewCount || 0;

    return new Response(
      JSON.stringify({
        status: 200,
        message: `Success for ${shop}`,
        stats: {
          totalVisits,
          todayVisits,
          last7DaysVisits,
        },
        pagination: {
          currentPage: page,
          perPage: limit,
          totalItems: totalProducts,
          totalPages: Math.ceil(totalProducts / limit),
          hasNextPage: page * limit < totalProducts,
          hasPreviousPage: page > 1,
        },
        data: productData,
      }),
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("Dashboard API Error:", error);

    return new Response(
      JSON.stringify({
        status: 500,
        message: "Failed to fetch dashboard data",
        error: error.message,
      }),
      { status: 500, headers: corsHeaders },
    );
  }
};

