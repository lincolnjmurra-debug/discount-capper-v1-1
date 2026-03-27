const DEFAULT_CONFIG = {
  percentage: 10,
  maxDiscountAmount: 250,
};

function toPositiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseAmount(amount) {
  const parsed = Number(amount);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toMoneyString(amount) {
  return amount.toFixed(2);
}

function parseConfig(metafield) {
  try {
    const parsed = JSON.parse(metafield?.value ?? "{}");
    return {
      percentage: toPositiveNumber(parsed.percentage, DEFAULT_CONFIG.percentage),
      maxDiscountAmount: toPositiveNumber(
        parsed.maxDiscountAmount,
        DEFAULT_CONFIG.maxDiscountAmount,
      ),
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

/**
 * @typedef {import("../generated/api").CartInput} RunInput
 * @typedef {import("../generated/api").CartLinesDiscountsGenerateRunResult} CartLinesDiscountsGenerateRunResult
 */

/**
 * @param {RunInput} input
 * @returns {CartLinesDiscountsGenerateRunResult}
 */
export function cartLinesDiscountsGenerateRun(input) {
  const { percentage, maxDiscountAmount } = parseConfig(input?.discount?.metafield);
  const subtotal = parseAmount(input?.cart?.cost?.subtotalAmount?.amount ?? 0);

  if (subtotal <= 0 || percentage <= 0 || maxDiscountAmount <= 0) {
    return { operations: [] };
  }

  const uncappedDiscount = subtotal * (percentage / 100);
  const shouldCap = uncappedDiscount > maxDiscountAmount;

  const candidateValue = shouldCap
    ? {
        fixedAmount: {
          amount: toMoneyString(maxDiscountAmount),
        },
      }
    : {
        percentage: {
          value: percentage.toFixed(1),
        },
      };

  return {
    operations: [
      {
        orderDiscountsAdd: {
          candidates: [
            {
              message: shouldCap
                ? `${percentage}% off capped at $${toMoneyString(maxDiscountAmount)}`
                : `${percentage}% off your order`,
              targets: [
                {
                  orderSubtotal: {
                    excludedCartLineIds: [],
                  },
                },
              ],
              value: candidateValue,
            },
          ],
          selectionStrategy: "FIRST",
        },
      },
    ],
  };
}
