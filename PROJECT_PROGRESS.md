# Discount Capper v1.1/v1.2 Progress Log

Last updated: April 24, 2026

## Project goal
Build and deploy a Shopify app discount function that applies a percentage discount with a maximum dollar cap.

Example target behavior:
- 10% off on $5,000 cart -> capped to $250 (not $500)
- 10% off on $2,500 cart -> full $250 (no cap impact)

## Current status
- App is running and discount capping logic is working.
- GitHub repo is connected and pushes are deploying via Render.
- Home page now includes a practical "Generate a discount" flow to the store Discounts page.
- In-app documentation page ("How to use") has been added.
- Shopify app version deployment is active and publishing to client id `cff692...`.

## Active app/config references
- Repository: `discount-capper-v1-1`
- Active branch: `main`
- Active Shopify app config file: `shopify.app.toml`
- Active app client id prefix: `cff692...`
- Hosted app URL: `https://discount-capper-v1-1.onrender.com`

## Standard deployment procedure
1. Commit and push to GitHub `main`.
2. Wait for Render auto-deploy to finish and confirm app health.
3. Deploy Shopify app version (required):
   - `npm run shopify -- app deploy -c shopify.app.toml --allow-updates`
4. Verify new active version timestamp:
   - `npm run shopify -- app versions list -c shopify.app.toml`
5. Smoke test in dev store:
   - Open app from Shopify Admin
   - Create discount via the app flow
   - Confirm capped discount behavior

## Major milestones completed
1. Initial discount cap app scaffold created.
2. Discount function implemented with configurable percentage + max cap.
3. Discount UI settings wired to app metafield `"$app" / "function-configuration"`.
4. Render deployment setup and environment troubleshooting completed.
5. Shopify app config alignment completed for correct target app (`cff692...`).
6. Compliance webhook route added and webhook subscriptions configured for review requirements.
7. Discount metafield permission block added in app config for function settings access.
8. Shopify CLI local preference corruption fixed (cleanup of `~/Library/Preferences/shopify-cli-app-nodejs`).
9. In-app "How to use" manual page added.
10. Home page product-template actions removed/replaced with discount-focused UX.
11. Discount creation navigation simplified to store Discounts page (stable behavior).

## Recent deployed commits
- `17f988b` Fix embedded auth fallback by deriving shop from host param
- `a5a9e7e` Harden webhook handlers for uninstall and scopes update
- `0b13f98` Point default Shopify config to cff692 app
- `4a221bb` Link generate discount button to store discounts page
- `230eabc` Fix discount creation 404 with server-side App Bridge redirect
- `a1b830c` Use app discount createPath for Generate a discount action
- `50f0a09` Open discount type selector from home action
- `ea4da82` Replace product demo action with generate discount navigation
- `e93a904` Add in-app How to use manual page and update app nav
- `90f65fc` Update v12 app config for webhooks and discount metafield access

## Key files edited during stabilization
- `shopify.app.discount-capper-v12.toml`
- `app/routes/webhooks.compliance.jsx`
- `app/routes/webhooks.app.uninstalled.jsx`
- `app/routes/webhooks.app.scopes_update.jsx`
- `app/routes/app.jsx`
- `app/routes/app._index.jsx`
- `app/routes/app.how-to-use.jsx`

## Known resolved issues
- GitHub push auth errors (password auth/token flow) resolved.
- Render build typo (`rpm run build`) resolved.
- Missing `SHOPIFY_APP_URL` style runtime config errors resolved.
- "Access to this namespace and key on Metafields..." resolved by proper app config metafield declaration + deploy.
- Compliance webhook checks failing resolved with required route + webhook config.
- App/CLI targeting wrong Shopify app resolved by explicit `--config` usage and config cleanup.
- Discount creation button misrouting/404 resolved by simplifying to store Discounts page navigation.

## Recommended next steps
1. Continue using explicit config when running Shopify CLI commands:
   - `npm run shopify -- app deploy -c shopify.app.toml --allow-updates`
2. Keep Render env vars in sync with Shopify app settings.
3. Remove remaining generic template copy from any screens not needed for production.
4. Re-run Shopify automated checks after each release candidate and capture screenshots/logs for submission.
