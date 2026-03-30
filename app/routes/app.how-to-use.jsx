export default function HowToUsePage() {
  return (
    <s-page heading="How to use Discount Capper">
      <s-section heading="What this app does">
        <s-paragraph>
          Discount Capper lets you run a percentage discount while limiting the
          maximum amount a customer can receive.
        </s-paragraph>
        <s-paragraph>
          Example: 10% off with a $250 cap gives full 10% up to a $2,500 order,
          then caps at $250 for higher totals.
        </s-paragraph>
      </s-section>

      <s-section heading="Create a capped discount code">
        <s-ordered-list>
          <s-list-item>Go to Shopify Admin and open Discounts.</s-list-item>
          <s-list-item>
            Click Create discount and select App discount.
          </s-list-item>
          <s-list-item>Select Discount Capper as the discount function.</s-list-item>
          <s-list-item>
            Set your discount code details (code name, dates, usage limits).
          </s-list-item>
          <s-list-item>
            In function settings, set Percentage and Max discount amount.
          </s-list-item>
          <s-list-item>Save the discount.</s-list-item>
        </s-ordered-list>
      </s-section>

      <s-section heading="Recommended settings">
        <s-unordered-list>
          <s-list-item>
            Percentage: your intended offer rate (for example, 10).
          </s-list-item>
          <s-list-item>
            Max discount amount: the absolute cap in store currency (for
            example, 250).
          </s-list-item>
          <s-list-item>
            Threshold math: cap / (percentage / 100). With 10% and $250, the
            threshold is $2,500.
          </s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section heading="Test checklist">
        <s-ordered-list>
          <s-list-item>
            Test cart at or below threshold (for example, $2,500) and confirm
            full percentage applies.
          </s-list-item>
          <s-list-item>
            Test cart above threshold (for example, $5,000) and confirm
            discount is capped.
          </s-list-item>
          <s-list-item>
            Verify the code behavior with shipping and tax settings that match
            your store policy.
          </s-list-item>
        </s-ordered-list>
      </s-section>

      <s-section slot="aside" heading="Quick links">
        <s-unordered-list>
          <s-list-item>
            <s-link href="https://admin.shopify.com/store" target="_blank">
              Open Shopify Admin
            </s-link>
          </s-list-item>
          <s-list-item>
            <s-link
              href="https://help.shopify.com/en/manual/discounts/discount-types"
              target="_blank"
            >
              Shopify discount docs
            </s-link>
          </s-list-item>
        </s-unordered-list>
      </s-section>
    </s-page>
  );
}
