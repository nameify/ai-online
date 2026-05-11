import { useEffect } from "react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import "../css/generic_styles.css";
import prisma from "../db.server";

// 1. Server-side Loader: Get the current Shop
export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  const url = new URL(request.url);

  // Pagination params
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "50", 10); // default 5
  const skip = (page - 1) * limit;

  // Run queries in parallel
  const [domainSales, totalSales] = await Promise.all([
    prisma.domainSale.findMany({
      where: { shop: session.shop },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),

    prisma.domainSale.count({
      where: { shop: session.shop },
    }),
  ]);

  return {
    shop: session.shop,
    domainSales,
    pagination: {
      currentPage: page,
      perPage: limit,
      totalItems: totalSales,
      totalPages: Math.ceil(totalSales / limit),
      hasNextPage: page * limit < totalSales,
      hasPreviousPage: page > 1,
    },
  };
};

export default function Index() {
  const { domainSales, pagination } = useLoaderData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPages || 1;
  const hasNext = pagination?.hasNextPage;
  const hasPrevious = pagination?.hasPreviousPage;

  const handleNext = () => {
    const nextPage = currentPage + 1;
    searchParams.set("page", nextPage);
    navigate(`?${searchParams.toString()}`);
  };

  const handlePrevious = () => {
    const prevPage = currentPage - 1;
    searchParams.set("page", prevPage);
    navigate(`?${searchParams.toString()}`);
  };
  return (
    <s-page heading="Domain Sale Dashboard" inlineSize="large">
      <s-section padding="none" accessibilityLabel="Domain Sale table section">
        <s-table
          paginate
          hasPreviousPage={hasPrevious}
          hasNextPage={hasNext}
          onPreviousPage={handlePrevious}
          onNextPage={handleNext}
        >
          <s-table-header-row>
            <s-table-header>S.NO</s-table-header>
            <s-table-header listSlot="primary">Domain Name</s-table-header>
            
            <s-table-header>List Price</s-table-header>
            <s-table-header>Min Price</s-table-header>
            <s-table-header>Domain Reg</s-table-header>
            <s-table-header>Exp Date</s-table-header>
            <s-table-header>Traffic Info</s-table-header>
            <s-table-header>Name</s-table-header>
            <s-table-header>Email</s-table-header>
            <s-table-header>phone No</s-table-header>
            <s-table-header>Notes</s-table-header>
            {/* <s-table-header format="numeric">Pieces</s-table-header> */}
            <s-table-header>Created</s-table-header>
          </s-table-header-row>
          <s-table-body>
            {domainSales.map((item, index) => (
              <s-table-row key={item.id}>
                <s-table-cell>{index + 1}</s-table-cell>
                <s-table-cell>{item.domain}</s-table-cell>
            
                <s-table-cell>{item.price}</s-table-cell>
                <s-table-cell>{item.minOffer}</s-table-cell>
                <s-table-cell>{item.registrar}</s-table-cell>
                <s-table-cell>
                  {item.expiry
                    ? new Date(item.expiry).toLocaleDateString()
                    : ""}
                </s-table-cell>
                <s-table-cell>{item.traffic}</s-table-cell>
                <s-table-cell>{item.fullName}</s-table-cell>

                <s-table-cell>
                  <s-link href={`mailto:${item.email}`}>{item.email}</s-link>
                </s-table-cell>

                <s-table-cell>
                  <s-link href={`tel:${item.phone}`}>{item.phone}</s-link>
                </s-table-cell>

                <s-table-cell>{item.comments}</s-table-cell>

                <s-table-cell>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : ""}
                </s-table-cell>
              </s-table-row>
            ))}
          </s-table-body>
        </s-table>
        <s-stack
          direction="inline"
          alignItems="center"
          justifyContent="safe start"
          padding="base base"
        >
          {/* Left Side - Page Info */}
          <s-heading level="5" emphasis="subdued">
            Page {currentPage} of {totalPages}
          </s-heading>
        </s-stack>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
