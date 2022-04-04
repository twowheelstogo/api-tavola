import accounting from "accounting-js";
import getCurrencyDefinitionByCode from "@reactioncommerce/api-utils/getCurrencyDefinitionByCode.js";
import getDisplayPrice from "../util/getDisplayPrice.js";

export default async (node, context) => {
  const { Shops } = context.collections;
  const shop = await Shops.findOne({ _id: node.shopId }, { projection: { currency: 1 } });
  const currencyDefinition = getCurrencyDefinitionByCode(shop.currency);

  let pricing = {};
  const { price, maxFreeQty, maxQty, minQty } = node;
  if (price && typeof price === "object") {
    pricing = {
      compareAtPrice: null,
      displayPrice: getDisplayPrice(price.min || 0, price.max || 0, currencyDefinition),
      maxPrice: price.max,
      minPrice: price.min,
      price: null,
      maxFreeQty: maxFreeQty || null,
      maxQty: maxQty || null,
      minQty: minQty || null,
    };
  } else {
    pricing = {
      compareAtPrice: node.compareAtPrice || 0,
      displayPrice: accounting.formatMoney(price, currencyDefinition.symbol),
      maxPrice: price || 0,
      minPrice: price || 0,
      price: price || 0,
      maxFreeQty: maxFreeQty || null,
      maxQty: maxQty || null,
      minQty: minQty || null,
    };
  }

  return pricing;
};
