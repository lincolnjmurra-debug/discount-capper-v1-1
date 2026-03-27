import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { topic, shop } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Required compliance webhook endpoint.
  // Add customer data redaction logic here if you persist customer data.
  return new Response(null, { status: 200 });
};
