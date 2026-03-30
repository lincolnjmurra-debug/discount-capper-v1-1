import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  let createPath = "/admin/discounts/new";

  try {
    const response = await admin.graphql(
      `#graphql
        query DiscountTypeCreatePath {
          appDiscountTypes {
            appKey
            title
            appBridge {
              createPath
            }
          }
        }`,
    );
    const responseJson = await response.json();
    const appDiscountTypes = responseJson?.data?.appDiscountTypes ?? [];
    const appKey = process.env.SHOPIFY_API_KEY;
    const matchingType = appDiscountTypes.find((type) => type.appKey === appKey);
    const rawPath = matchingType?.appBridge?.createPath;

    if (typeof rawPath === "string" && rawPath.length > 0) {
      createPath = normalizeAdminPath(rawPath);
    }
  } catch (error) {
    console.error("Failed to load app discount create path", error);
  }

  return { createPath };
};

export default function Index() {
  const { createPath } = useLoaderData();

  const generateDiscount = async () => {
    window.open(createPath, "_top");
  };

  return (
    <s-page heading="Discount Capper v1.2">
      <s-button slot="primary-action" onClick={generateDiscount}>
        Generate a discount
      </s-button>

      <s-section heading="Set up capped percentage discounts">
        <s-paragraph>
          Use this app to apply a percentage discount with a hard cap. For
          example, 10% off can be capped at $250 so high-ticket orders do not
          exceed your maximum discount amount.
        </s-paragraph>
        <s-paragraph>
          Open{" "}
          <s-link href="/app/how-to-use">How to use</s-link> for the full setup
          and testing guide.
        </s-paragraph>
      </s-section>

      <s-section heading="Create a discount in Shopify">
        <s-paragraph>
          Click <s-text emphasis="bold">Generate a discount</s-text> to open
          Shopify&apos;s <s-text emphasis="bold">Select discount type</s-text>{" "}
          flow, then choose your Discount Capper app discount type.
        </s-paragraph>
        <s-stack direction="inline" gap="base">
          <s-button onClick={generateDiscount}>Generate a discount</s-button>
          <s-link href={createPath} target="_top">
            Open Discount Capper creation
          </s-link>
        </s-stack>
      </s-section>

      <s-section slot="aside" heading="Quick links">
        <s-unordered-list>
          <s-list-item>
            <s-link href="/app/how-to-use">How to use this app</s-link>
          </s-list-item>
          <s-list-item>
            <s-link href="https://help.shopify.com/en/manual/discounts" target="_blank">
              Shopify discount docs
            </s-link>
          </s-list-item>
        </s-unordered-list>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};

function normalizeAdminPath(rawPath) {
  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    return rawPath;
  }

  if (rawPath.startsWith("/admin/")) {
    return rawPath;
  }

  if (rawPath.startsWith("/")) {
    return `/admin${rawPath}`;
  }

  return `/admin/${rawPath}`;
}
