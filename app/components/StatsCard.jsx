export default function StatsCardViewers({ title, analytics, iconName }) {
  return (
    <>
      <s-box
        background="strong"
        padding="base"
        border="base"
        borderRadius="large-100"
      >
        <s-block-stack spacing="none">
          <s-stack
            direction="inline"
            alignItems="center"
            justifyContent="space-between"
            gap="base large"
            columnGap="small-200"
          >
            <s-icon type={iconName} size="small" />
            <s-paragraph emphasis="subdued"> {title} </s-paragraph>
          </s-stack>
          <s-heading> {analytics} </s-heading>
        </s-block-stack>
      </s-box>
    </>
  );
}
