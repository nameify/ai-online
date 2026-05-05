import { useEffect, useState } from "react";
import { useLoaderData, useFetcher } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import StatsCardViewers from "../components/StatsCard";
import DomainsList from "../components/DomainsList"; // Fixed import name
import "../css/generic_styles.css";

// 1. Server-side Loader: Get the current Shop
export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  return { shop: session.shop };
};

export default function Index() {
  const { shop } = useLoaderData();
  const fetcher = useFetcher();

  const [page, setPage] = useState(1);

  useEffect(() => {
    fetcher.load(`/api/getVisitorData?shop=${shop}&page=${page}`);
  }, [shop, page]);

  const apiData = fetcher.data || {};
  const isLoading = fetcher.state === "loading";

  const stats = apiData?.stats || {
    totalVisits: 0,
    todayVisits: 0,
    last7DaysVisits: 0,
  };

  const products = apiData?.data || [];
  const pagination = apiData?.pagination || {};

  const totalPages = pagination?.totalPages || 1;
  const hasNext = pagination?.hasNextPage;
  const hasPrevious = pagination?.hasPreviousPage;

  function formatCompactNumber(num) {
    if (!num) return "0";

    const absNum = Math.abs(num);

    if (absNum >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    }

    if (absNum >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }

    if (absNum >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }

    return num.toString();
  }

  return (
    <s-page heading="Nameify Product Analytics" inlineSize="large">
      {/* Top Section: Stats Cards */}
      <s-box
        padding="none base"
        background="bg-surface"
        border="base"
        borderRadius="large-100"
      >
        {/* Header */}
        <s-stack
          direction="inline"
          gap="base large"
          justifyContent="space-between"
          padding="base base"
        >
          <s-stack spacing="none">
            <s-heading lineClamp={10}>Visitor Analytics</s-heading>
          </s-stack>
          <s-badge tone="success">Live</s-badge>
        </s-stack>

        <s-stack padding="none base">
          <s-divider color="strong" />
        </s-stack>

        {/* Stats Row */}
        <s-stack
          gap="base base"
          direction="inline"
          padding="base base"
          justifyContent="space-between"
        >
          <StatsCardViewers
            title="Total Visitor Counts"
            analytics={
              isLoading
                ? "..."
                : ` ${formatCompactNumber(stats?.totalVisits)} times`
            }
            iconName="view"
          />

          <StatsCardViewers
            title="Today Visitor Counts"
            analytics={
              isLoading
                ? "..."
                : ` ${formatCompactNumber(stats?.todayVisits)} times`
            }
            iconName="view"
          />

          <StatsCardViewers
            title="Last 7 Days"
            analytics={
              isLoading
                ? "..."
                : ` ${formatCompactNumber(stats?.last7DaysVisits)} times`
            }
            iconName="view"
          />
        </s-stack>
      </s-box>

      {/* Bottom Section: Product Table */}
      <div className="mt-4">
        <s-box gap="large-100" borderRadius="large-100">
          <s-table
            paginate={true}
            hasPreviousPage={hasPrevious}
            hasNextPage={hasNext}
            onPreviousPage={() => setPage((prev) => prev - 1)}
            onNextPage={() => setPage((prev) => prev + 1)}
            loading={isLoading}
          >
            <s-table-header-row>
              <s-table-header>S.No</s-table-header>
              <s-table-header>Product ID</s-table-header>
              <s-table-header>Product Title</s-table-header>
              <s-table-header>Visit Count</s-table-header>
            </s-table-header-row>

            <s-table-body>
              {products?.length < 1 ? (
                <s-table-row>
                  <s-table-cell colSpan={4}>
                    No visits recorded yet.
                  </s-table-cell>
                </s-table-row>
              ) : (
                products?.map((product, index) => (
                  <DomainsList
                    key={product.id}
                    index={(page - 1) * 50 + index + 1}
                    productId={product.productId}
                    domainTitle={product.productTitle}
                    visitCount={product.viewCount?.toString()}
                  />
                ))
              )}
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
              Page {page} of {totalPages}
            </s-heading>
          </s-stack>
        </s-box>
      </div>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
