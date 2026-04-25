import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import {
  BILLING_PLANS,
  authenticate,
  getBillingTestMode,
} from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin, billing, redirect } = await authenticate.admin(request);
  const pathname = new URL(request.url).pathname;
  const isPlanSelectionRoute = pathname === "/app/select-plan";
  const isBillingBypassEnabled = process.env.BYPASS_BILLING === "true";

  if (!isPlanSelectionRoute && !isBillingBypassEnabled) {
    const isTest = await getBillingTestMode(admin);

    await billing.require({
      plans: BILLING_PLANS,
      isTest,
      onFailure: async () => redirect("/app/select-plan"),
    });
  }

  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export const shouldRevalidate = () => true;

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider embedded apiKey={apiKey}>
      <s-app-nav>
        <s-link href="/app">Home</s-link>
        <s-link href="/app/select-plan">Billing</s-link>
        <s-link href="/app/how-to-use">How to use</s-link>
      </s-app-nav>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
