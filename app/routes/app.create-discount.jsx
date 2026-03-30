import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin, redirect } = await authenticate.admin(request);

  let createPath = "/discounts/new";

  try {
    const response = await admin.graphql(
      `#graphql
        query DiscountTypeCreatePath {
          appDiscountTypes {
            appKey
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
      createPath = normalizeShopifyAdminPath(rawPath);
    }
  } catch (error) {
    console.error("Failed to resolve app discount create path", error);
  }

  return redirect(`shopify://admin${createPath}`, { target: "_parent" });
};

export default function CreateDiscountRedirect() {
  return null;
}

function normalizeShopifyAdminPath(rawPath) {
  if (rawPath.startsWith("shopify://admin")) {
    return rawPath.replace("shopify://admin", "");
  }

  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    try {
      const url = new URL(rawPath);
      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return "/discounts/new";
    }
  }

  let path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;

  if (path.startsWith("/admin/")) {
    path = path.slice("/admin".length);
  }

  return path;
}
