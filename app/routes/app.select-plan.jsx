import { Form, redirect, useLoaderData } from "react-router";
import {
  MONTHLY_PLAN,
  YEARLY_PLAN,
  authenticate,
  isBillingTestMode,
} from "../shopify.server";

export const loader = async ({ request }) => {
  const { billing } = await authenticate.admin(request);
  const billingStatus = await billing.check({
    plans: [MONTHLY_PLAN, YEARLY_PLAN],
    isTest: isBillingTestMode,
  });

  return {
    monthlyPlan: MONTHLY_PLAN,
    yearlyPlan: YEARLY_PLAN,
    currentPlanName: billingStatus.appSubscriptions?.[0]?.name || null,
  };
};

export const action = async ({ request }) => {
  const { billing } = await authenticate.admin(request);
  const formData = await request.formData();
  const selectedPlan = formData.get("plan");

  const allowedPlans = new Set([MONTHLY_PLAN, YEARLY_PLAN]);
  if (!allowedPlans.has(selectedPlan)) {
    return new Response("Invalid plan selected", { status: 400 });
  }

  const billingStatus = await billing.check({
    plans: [MONTHLY_PLAN, YEARLY_PLAN],
    isTest: isBillingTestMode,
  });
  const currentPlanName = billingStatus.appSubscriptions?.[0]?.name || null;
  if (currentPlanName === selectedPlan) {
    return redirect("/app");
  }

  const appUrl = process.env.SHOPIFY_APP_URL || new URL(request.url).origin;
  const returnUrl = new URL("/app", appUrl).toString();

  return billing.request({
    plan: selectedPlan,
    isTest: isBillingTestMode,
    returnUrl,
  });
};

export default function SelectPlan() {
  const { monthlyPlan, yearlyPlan, currentPlanName } = useLoaderData();

  return (
    <s-page heading="Choose a plan">
      <s-section heading="Select billing plan">
        <s-paragraph>
          To continue using Discount Capper, choose one of the plans below.
        </s-paragraph>
        {currentPlanName && (
          <s-banner tone="info">{`Current plan: ${currentPlanName}`}</s-banner>
        )}
        <s-stack direction="block" gap="base">
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-heading>Monthly Plan</s-heading>
            <s-paragraph>$1 per month</s-paragraph>
            <Form method="post">
              <input type="hidden" name="plan" value={monthlyPlan} />
              <s-button type="submit">Choose Monthly</s-button>
            </Form>
          </s-box>

          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-heading>Yearly Plan</s-heading>
            <s-paragraph>$10 per year</s-paragraph>
            <Form method="post">
              <input type="hidden" name="plan" value={yearlyPlan} />
              <s-button type="submit">Choose Yearly</s-button>
            </Form>
          </s-box>
        </s-stack>
      </s-section>
    </s-page>
  );
}
