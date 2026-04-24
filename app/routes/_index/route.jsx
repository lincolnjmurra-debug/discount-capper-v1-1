import { redirect, useLoaderData } from "react-router";
import styles from "./styles.module.css";
import { deriveShopFromRequestUrl } from "../../utils/shop-from-host.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shopParam = deriveShopFromRequestUrl(url);

  if (shopParam) {
    url.searchParams.set("shop", shopParam);
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return null;
};

export default function App() {
  useLoaderData();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>A short heading about [your app]</h1>
        <p className={styles.text}>
          A tagline about [your app] that describes your value proposition.
        </p>
        <p className={styles.text}>
          Open this app from Shopify Admin to install and authenticate.
        </p>
        <ul className={styles.list}>
          <li>
            <strong>Product feature</strong>. Some detail about your feature and
            its benefit to your customer.
          </li>
          <li>
            <strong>Product feature</strong>. Some detail about your feature and
            its benefit to your customer.
          </li>
          <li>
            <strong>Product feature</strong>. Some detail about your feature and
            its benefit to your customer.
          </li>
        </ul>
      </div>
    </div>
  );
}
