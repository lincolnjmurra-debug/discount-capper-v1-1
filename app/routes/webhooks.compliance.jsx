import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  let webhookData;

  try {
    // If the request fails HMAC verification, return 401.
    webhookData = await authenticate.webhook(request);
  } catch (error) {
    console.error("Compliance webhook verification failed", error);
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { topic, shop } = webhookData;
    console.log(`Received ${topic} compliance webhook for ${shop}`);

    // Remove persisted shop data for shop redact requests.
    if (topic === "SHOP_REDACT" && shop) {
      await db.session.deleteMany({ where: { shop } });
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Compliance webhook processing failed", error);
    return new Response(null, { status: 200 });
  }
};
