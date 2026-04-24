const MYSHOPIFY_DOMAIN_SUFFIX = ".myshopify.com";

function decodeBase64Url(input) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(base64 + padding, "base64").toString("utf8");
}

function sanitizeShopDomain(candidate) {
  if (!candidate) return null;

  const normalized = candidate
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");

  if (!normalized.endsWith(MYSHOPIFY_DOMAIN_SUFFIX)) {
    return null;
  }

  const domainRegex = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/;
  return domainRegex.test(normalized) ? normalized : null;
}

export function deriveShopFromHost(hostParam) {
  if (!hostParam) return null;

  try {
    const decodedHost = decodeBase64Url(hostParam);
    const shopDomain = decodedHost.split("/")[0];
    return sanitizeShopDomain(shopDomain);
  } catch (error) {
    console.error("Unable to derive shop domain from host parameter", error);
    return null;
  }
}

function deriveShopFromIdToken(idTokenParam) {
  if (!idTokenParam) return null;

  try {
    const [, payloadSegment] = idTokenParam.split(".");
    if (!payloadSegment) return null;
    const payload = JSON.parse(decodeBase64Url(payloadSegment));
    const destination = typeof payload?.dest === "string" ? payload.dest : null;
    if (!destination) return null;

    return sanitizeShopDomain(new URL(destination).hostname);
  } catch (error) {
    console.error("Unable to derive shop domain from id_token", error);
    return null;
  }
}

function deriveShopFromShopifyReload(shopifyReloadParam) {
  if (!shopifyReloadParam) return null;

  try {
    const reloadUrl = new URL(shopifyReloadParam);

    const shopFromQuery = sanitizeShopDomain(reloadUrl.searchParams.get("shop"));
    if (shopFromQuery) return shopFromQuery;

    return deriveShopFromHost(reloadUrl.searchParams.get("host"));
  } catch (error) {
    console.error("Unable to derive shop domain from shopify-reload", error);
    return null;
  }
}

export function deriveShopFromRequestUrl(url) {
  return (
    sanitizeShopDomain(url.searchParams.get("shop")) ||
    deriveShopFromHost(url.searchParams.get("host")) ||
    deriveShopFromShopifyReload(url.searchParams.get("shopify-reload")) ||
    deriveShopFromIdToken(url.searchParams.get("id_token"))
  );
}
