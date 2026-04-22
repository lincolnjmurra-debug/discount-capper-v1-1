import { LoginErrorType } from "@shopify/shopify-app-react-router/server";

export function loginErrorMessage(loginErrors) {
  if (loginErrors?.shop === LoginErrorType.MissingShop) {
    return { shop: "Please open the app from Shopify Admin to continue." };
  } else if (loginErrors?.shop === LoginErrorType.InvalidShop) {
    return { shop: "Shop authentication failed. Please relaunch from Shopify Admin." };
  }

  return {};
}
