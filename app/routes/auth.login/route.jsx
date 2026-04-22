import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";

export const loader = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));

  return { errors };
};

export const action = async ({ request }) => {
  // We don't collect manual shop domain input. Installation/authentication
  // should be initiated from Shopify-owned surfaces.
  return loader({ request });
};

export default function Auth() {
  const loaderData = useLoaderData();
  const { errors } = loaderData;

  return (
    <AppProvider embedded={false}>
      <s-page>
        <s-section heading="Open from Shopify Admin">
          <s-paragraph>
            Install and launch Discount Capper from Shopify Admin / App Store.
          </s-paragraph>
          {errors.shop && <s-banner tone="critical">{errors.shop}</s-banner>}
        </s-section>
      </s-page>
    </AppProvider>
  );
}
