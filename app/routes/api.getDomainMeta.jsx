import axios from "axios";
import Replicate from "replicate";
import { connectRedis, getRedisClient, parseWhoisResponse } from "../utils";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export const loader = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  const url = new URL(request.url);
  const domain = url.searchParams.get("domain");
  const productId = url.searchParams.get("productId");

  try {
    // Redis connection caching logic
    await connectRedis();
    const client = getRedisClient();

    // Get product cache from Redis by productId
    const cachedUser = await client.get(`${productId}`);

    if (cachedUser) {
      console.log("From cache");
      return new Response(
        JSON.stringify({
          status: 200,
          data: JSON.parse(cachedUser),
        }),
        { status: 200, headers: corsHeaders },
      );
    }

    // Helper to safely run API calls
    const safeCall = async (fn) => {
      try {
        return await fn();
      } catch (err) {
        console.error("API call failed:", err.message);
        return null; // return null on failure
      }
    };

    // Run all API calls in parallel
    const [estibotRes, godaddyRes, whoisRes, humbleworthRes] =
      await Promise.all([
        safeCall(() =>
          axios.get(
            `https://developer.nameify.com/api/getDomainMeta?domain=${domain}&productId=${productId}`,
          ),
        ),
        safeCall(() =>
          axios.get(
            `https://api.ote-godaddy.com/v1/domains/available?domain=${domain}`,
            {
              headers: {
                Authorization: `sso-key 3mM44YwfEFekuR_qvqiSGpmPCW15b7NwMC66:K4d1XR5hwoStL3v1dsrCHz`,
                "Content-Type": "application/json",
              },
            },
          ),
        ),
        safeCall(() =>
          axios.get("https://www.whoisxmlapi.com/whoisserver/WhoisService", {
            params: {
              apiKey: "at_Y32zEXEXDVbCTzTslSIXqrSfB6J3K",
              domainName: domain,
              outputFormat: "JSON",
            },
          }),
        ),
        safeCall(() => {
          const input = { domains: domain };
          return replicate.run(
            "humbleworth/price-predict-v1:a925db842c707850e4ca7b7e86b217692b0353a9ca05eb028802c4a85db93843",
            { input },
          );
        }),
      ]);

    // Only parse Whois if it succeeded
    const parsedWhoisRes = whoisRes ? parseWhoisResponse(whoisRes) : null;

    const raw = estibotRes?.data?.estiresponse?.results?.data[0];

    const cleanDataEstibot = {
      domain: raw?.domain,
      estimatedValue: raw?.appraised_value,
      wholesaleValue: raw?.appraised_wholesale_value,
      retailRange: raw?.price_range_retail,
      ageDays: raw?.whois_age,
      registrar: raw?.whois_registrar,
    };

    const responseData = {
      godaddyResponse: godaddyRes?.data || null,
      whoisResponse: parsedWhoisRes,
      humbleworthResponse: humbleworthRes || null,
      estibotResponse: cleanDataEstibot || null,
    };

    // Save only successful API results in Redis
    await client.setEx(`${productId}`, 86400, JSON.stringify(responseData));

    return new Response(JSON.stringify({ status: 200, ...responseData }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Loader Error:", error);
    return new Response(
      JSON.stringify({
        error: error?.response?.data || error.message || "Internal error",
      }),
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
};
