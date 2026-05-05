import prisma from "../db.server";
import { customerTemplate } from "../emails/customerTemplate.server";
import { adminTemplate } from "../emails/adminTemplate.server";
import { sendMail } from "../utils/mailer.server";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle preflight + optional GET
export const loader = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  return new Response(
    JSON.stringify({ message: "API is working" }),
    { headers: corsHeaders }
  );
};

// Handle form submission (POST)


export const action = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");

    if (!shop) {
      return new Response(
        JSON.stringify({ message: "Shop parameter is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const data = await request.json();

    // ✅ Save into database
    const saved = await prisma.domainSale.create({
      data: {
        shop: shop,
        domain: data?.domain || "",
        listingType: data?.listingType || "",
        price: data?.price || "",
        minOffer: data?.minOffer || "",
        registrar: data?.registrar || "",
        expiry: data?.expiry ? new Date(data?.expiry) : null,
        traffic: data?.traffic || "",
        comments: data?.comments || "",
        fullName: data?.fullName || "",
        email: data?.email || "",
        phone: data?.phone || "",
      },
    });

    // ✅ Send email to customer
    await sendMail({
      to: data.email,
      subject: "Your domain submission received",
      html: customerTemplate(data),
    });

    // ✅ Send email to admin
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: "New domain submitted",
      html: adminTemplate(data, shop),
    });

    // ✅ NOW return response
    return new Response(
      JSON.stringify({
        status: 200,
        message: "Domain submitted successfully",
        data: saved,
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error("Domain Sale API Error:", error);

    return new Response(
      JSON.stringify({
        status: 500,
        message: "Failed to save submission",
        error: error?.message,
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};

// export const action = async ({ request }) => {
//   if (request.method === "OPTIONS") {
//     return new Response(null, { status: 204, headers: corsHeaders });
//   }

//   try {

//     const url = new URL(request.url);
//     const shop = url.searchParams.get("shop");

//     if (!shop) {
//       return new Response(
//         JSON.stringify({ message: "Shop parameter is required" }),
//         { status: 400, headers: corsHeaders },
//       );
//     }

//     const data = await request.json();

//     // ✅ Save into database
//     const saved = await prisma.domainSale.create({
//       data: {
//         shop: shop,
//         domain: data?.domain || "",
//         listingType: data?.listingType || "",
//         price: data?.price || "",
//         minOffer: data?.minOffer || "",
//         registrar: data?.registrar || "",
//         expiry: data?.expiry ? new Date(data?.expiry) : null,
//         traffic: data?.traffic || "",
//         comments: data?.comments || "",
//         fullName: data?.fullName || "",
//         email: data?.email || "",
//         phone: data?.phone || "",
//       },
//     });


//     // Send email to customer
//     await sendMail({
//       to: data.email,
//       subject: "Your domain submission received",
//       html: customerTemplate(data),
//     });

//     // send alert to admin
//     await sendMail({
//       to: process.env.ADMIN_EMAIL,
//       subject: "New domain submitted",
//       html: adminTemplate(data, shop),
//     });


//     return new Response(
//       JSON.stringify({
//         status: 200,
//         message: "Domain submitted successfully",
//         data: saved,
//       }),
//       { headers: corsHeaders }
//     );




//   } catch (error) {
//     console.error("Domain Sale API Error:", error);

//     return new Response(
//       JSON.stringify({
//         status: 500,
//         message: "Failed to save submission",
//         error: error?.message,
//       }),
//       { status: 500, headers: corsHeaders }
//     );
//   }
// };