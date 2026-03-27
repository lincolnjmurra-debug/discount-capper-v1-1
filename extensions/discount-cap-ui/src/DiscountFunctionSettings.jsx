import "@shopify/ui-extensions/preact";
import { render } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

const DEFAULTS = {
  percentage: 10,
  maxDiscountAmount: 250,
};

export default async () => {
  render(<App />, document.body);
};

function App() {
  const { applyMetafieldChange, data, i18n } = shopify;

  const initialConfig = useMemo(() => {
    const metafieldValue = data?.metafields?.find(
      (metafield) => metafield.key === "function-configuration",
    )?.value;
    return parseConfig(metafieldValue);
  }, [data?.metafields]);

  const [percentage, setPercentage] = useState(initialConfig.percentage);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(
    initialConfig.maxDiscountAmount,
  );

  useEffect(() => {
    setPercentage(initialConfig.percentage);
    setMaxDiscountAmount(initialConfig.maxDiscountAmount);
  }, [initialConfig.percentage, initialConfig.maxDiscountAmount]);

  const threshold = calculateThreshold(percentage, maxDiscountAmount);

  async function saveSettings() {
    await applyMetafieldChange({
      type: "updateMetafield",
      namespace: "$app",
      key: "function-configuration",
      value: JSON.stringify({
        percentage: toPositiveNumber(percentage, DEFAULTS.percentage),
        maxDiscountAmount: toPositiveNumber(
          maxDiscountAmount,
          DEFAULTS.maxDiscountAmount,
        ),
      }),
      valueType: "json",
    });
  }

  function resetSettings() {
    setPercentage(initialConfig.percentage);
    setMaxDiscountAmount(initialConfig.maxDiscountAmount);
  }

  return (
    <s-function-settings
      onSubmit={(event) => event.waitUntil?.(saveSettings())}
      onReset={resetSettings}
    >
      <s-heading>{i18n.translate("title")}</s-heading>
      <s-section>
        <s-stack gap="base">
          <s-number-field
            label={i18n.translate("percentageLabel")}
            name="percentage"
            value={String(percentage)}
            defaultValue={String(initialConfig.percentage)}
            min={0}
            max={100}
            step={0.1}
            suffix="%"
            onChange={(event) => setPercentage(Number(event.currentTarget.value))}
          />
          <s-number-field
            label={i18n.translate("maxCapLabel")}
            name="maxDiscountAmount"
            value={String(maxDiscountAmount)}
            defaultValue={String(initialConfig.maxDiscountAmount)}
            min={0}
            step={0.01}
            prefix="$"
            onChange={(event) =>
              setMaxDiscountAmount(Number(event.currentTarget.value))
            }
          />
          <s-text>{`${i18n.translate("thresholdLabel")} $${threshold.toFixed(2)}`}</s-text>
        </s-stack>
      </s-section>
    </s-function-settings>
  );
}

function parseConfig(rawValue) {
  try {
    const parsed = JSON.parse(rawValue ?? "{}");
    return {
      percentage: toPositiveNumber(parsed.percentage, DEFAULTS.percentage),
      maxDiscountAmount: toPositiveNumber(
        parsed.maxDiscountAmount,
        DEFAULTS.maxDiscountAmount,
      ),
    };
  } catch {
    return DEFAULTS;
  }
}

function toPositiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function calculateThreshold(percentage, maxDiscountAmount) {
  const pct = toPositiveNumber(percentage, DEFAULTS.percentage);
  const cap = toPositiveNumber(maxDiscountAmount, DEFAULTS.maxDiscountAmount);
  return cap / (pct / 100);
}
