import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { useState } from "react";
import { Form, redirect, useActionData, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import db from "../../db.server";
import { loginErrorMessage } from "./error.server";
import { deriveShopFromRequestUrl } from "../../utils/shop-from-host.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const hasShopParam = Boolean(url.searchParams.get("shop"));

  if (!hasShopParam) {
    let derivedShop = deriveShopFromRequestUrl(url);

    if (!derivedShop) {
      derivedShop = process.env.SHOPIFY_FALLBACK_SHOP || null;
    }

    if (!derivedShop) {
      const existingSession = await db.session.findFirst({
        select: { shop: true },
      });
      derivedShop = existingSession?.shop || null;
    }

    if (derivedShop) {
      url.searchParams.set("shop", derivedShop);
      throw redirect(`${url.pathname}?${url.searchParams.toString()}`);
    }
  }

  const errors = loginErrorMessage(await login(request));

  return { errors };
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const submittedShop = formData.get("shop")?.toString().trim();

  if (submittedShop) {
    const url = new URL(request.url);
    url.searchParams.set("shop", submittedShop);
    throw redirect(`${url.pathname}?${url.searchParams.toString()}`);
  }

  return loader({ request });
};

export default function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const { errors } = actionData || loaderData;

  return (
    <AppProvider embedded={false}>
      <s-page>
        <s-section heading="Open from Shopify Admin">
          <s-paragraph>
            Install and launch Discount Capper from Shopify Admin / App Store.
          </s-paragraph>
          {errors.shop && <s-banner tone="critical">{errors.shop}</s-banner>}
          <Form method="post">
            <s-text-field
              name="shop"
              label="Shop domain (fallback)"
              details="example.myshopify.com"
              value={shop}
              onChange={(event) => setShop(event.currentTarget.value)}
              autocomplete="on"
            ></s-text-field>
            <s-button type="submit">Continue</s-button>
          </Form>
        </s-section>
      </s-page>
    </AppProvider>
  );
}
