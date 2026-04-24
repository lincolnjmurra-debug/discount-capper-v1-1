import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const startedAt = Date.now();
  let topic;
  let shop;

  try {
    ({ shop, topic } = await authenticate.webhook(request));
  } catch (error) {
    console.error("app/uninstalled webhook verification failed", error);
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Always delete by shop because uninstall webhooks can be retried and session payload can be absent.
    await db.session.deleteMany({ where: { shop } });
  } catch (error) {
    console.error(`Failed to delete sessions for ${shop} after uninstall`, error);
  }

  console.log(
    `Processed ${topic} webhook for ${shop} in ${Date.now() - startedAt}ms`,
  );
  return new Response(null, { status: 200 });
};
