import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const startedAt = Date.now();
  let payload;
  let session;
  let topic;
  let shop;

  try {
    ({ payload, session, topic, shop } = await authenticate.webhook(request));
  } catch (error) {
    console.error("app/scopes_update webhook verification failed", error);
    return new Response("Unauthorized", { status: 401 });
  }

  console.log(`Received ${topic} webhook for ${shop}`);
  const current = payload.current;

  if (session?.id) {
    // Use updateMany to avoid throwing if the session no longer exists when Shopify retries webhooks.
    await db.session.updateMany({
      where: {
        id: session.id,
      },
      data: {
        scope: current.toString(),
      },
    });
  }

  console.log(
    `Processed ${topic} webhook for ${shop} in ${Date.now() - startedAt}ms`,
  );
  return new Response(null, { status: 200 });
};
