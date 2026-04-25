import { useLoaderData } from "react-router";
import {
  BILLING_PLANS,
  authenticate,
  getBillingTestMode,
} from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin, billing, session } = await authenticate.admin(request);
  const isTest = await getBillingTestMode(admin);
  const billingStatus = await billing.check({
    plans: BILLING_PLANS,
    isTest,
  });
  const shopName = session.shop.replace(".myshopify.com", "");
  const appsSettingsUrl = `https://admin.shopify.com/store/${shopName}/settings/apps`;

  return {
    appsSettingsUrl,
    currentPlanName: billingStatus.appSubscriptions?.[0]?.name || null,
    hasActivePayment: billingStatus.hasActivePayment,
    isTest,
  };
};

export default function SelectPlan() {
  const {
    appsSettingsUrl,
    currentPlanName,
    hasActivePayment,
    isTest,
  } = useLoaderData();

  return (
    <s-page heading="Choose a plan">
      <s-section heading="Select billing in Shopify">
        <s-paragraph>
          To continue using Discount Capper, open the app settings page and
          choose a billing plan from Shopify Admin.
        </s-paragraph>
        {currentPlanName && (
          <s-banner tone="info">{`Current plan: ${currentPlanName}`}</s-banner>
        )}
        {isTest && (
          <s-banner tone="info">
            This store will use Shopify test billing.
          </s-banner>
        )}
        {hasActivePayment && (
          <s-banner tone="success">
            Billing is active. Open the app to continue.
          </s-banner>
        )}
        <s-stack direction="block" gap="base">
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-heading>Shopify billing settings</s-heading>
            <s-paragraph>Available plans: $1/month or $10/year.</s-paragraph>
            <s-ordered-list>
              <s-list-item>Open this app in Shopify Admin settings.</s-list-item>
              <s-list-item>Choose Billing.</s-list-item>
              <s-list-item>Select the plan you want.</s-list-item>
              <s-list-item>Open Discount Capper again.</s-list-item>
            </s-ordered-list>
            <s-stack direction="inline" gap="base">
              <s-link href={appsSettingsUrl} target="_top">
                Open apps settings
              </s-link>
              <s-link href="/app">Open app</s-link>
            </s-stack>
          </s-box>
        </s-stack>
      </s-section>
    </s-page>
  );
}
