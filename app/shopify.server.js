import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  BillingInterval,
  BillingReplacementBehavior,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

export const MONTHLY_PLAN = "Discount Capper Monthly";
export const YEARLY_PLAN = "Discount Capper Yearly";
export const LEGACY_MONTHLY_PLAN = "Capora";
export const BILLING_PLANS = [
  MONTHLY_PLAN,
  YEARLY_PLAN,
  LEGACY_MONTHLY_PLAN,
];

const billingTestModeEnv = process.env.SHOPIFY_BILLING_TEST;
export const isBillingTestMode =
  billingTestModeEnv === "true" ||
  (billingTestModeEnv == null && process.env.NODE_ENV !== "production");

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  billing: {
    [MONTHLY_PLAN]: {
      replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
      lineItems: [
        {
          amount: 1,
          currencyCode: "USD",
          interval: BillingInterval.Every30Days,
        },
      ],
    },
    [YEARLY_PLAN]: {
      replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
      lineItems: [
        {
          amount: 10,
          currencyCode: "USD",
          interval: BillingInterval.Annual,
        },
      ],
    },
  },
  future: {
    expiringOfflineAccessTokens: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.October25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
