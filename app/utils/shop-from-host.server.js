const MYSHOPIFY_DOMAIN_SUFFIX = ".myshopify.com";

function decodeBase64Url(input) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(base64 + padding, "base64").toString("utf8");
}

export function deriveShopFromHost(hostParam) {
  if (!hostParam) return null;

  try {
    const decodedHost = decodeBase64Url(hostParam);
    const shopDomain = decodedHost.split("/")[0]?.toLowerCase();

    if (!shopDomain?.endsWith(MYSHOPIFY_DOMAIN_SUFFIX)) {
      return null;
    }

    return shopDomain;
  } catch (error) {
    console.error("Unable to derive shop domain from host parameter", error);
    return null;
  }
}
