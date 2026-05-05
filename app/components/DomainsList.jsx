import React from "react";

export default function DomainsList({
  domainTitle,
  visitCount,
  index,
  productId,
}) {
  const visitLabel = parseInt(visitCount) === 1 ? "time" : "times";

  return (
    <s-table-row>
      <s-table-cell>{index}</s-table-cell>
      <s-table-cell>{productId}</s-table-cell>
      <s-table-cell>{domainTitle}</s-table-cell>
      <s-table-cell>
        {visitCount} {visitLabel}
      </s-table-cell>
    </s-table-row>
  );
}
