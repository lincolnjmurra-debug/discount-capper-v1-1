import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  try {
    const { topic, shop } = await authenticate.webhook(request);

    console.log(`Received ${topic} compliance webhook for ${shop}`);

    // Remove persisted shop data for shop redact requests.
    if (topic === "SHOP_REDACT") {
      await db.session.deleteMany({ where: { shop } });
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Compliance webhook verification failed", error);
    return new Response("Unauthorized", { status: 401 });
  }
};
