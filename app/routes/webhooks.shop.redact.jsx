import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { topic, shop } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Required compliance webhook endpoint.
  // This app stores session records by shop, so clear them when requested.
  await db.session.deleteMany({ where: { shop } });

  return new Response(null, { status: 200 });
};
