import decodeOpaqueIdForNamespace from "@reactioncommerce/api-utils/decodeOpaqueIdForNamespace.js";
import encodeOpaqueId from "@reactioncommerce/api-utils/encodeOpaqueId.js";

const namespaces = {
  Account: "reaction/account",
  Address: "reaction/address",
  Cart: "reaction/cart",
  CartCatalog: "reaction/cartCatalog",
  CartItem: "reaction/cartItem",
  FulfillmentGroup: "reaction/fulfillmentGroup",
  Product: "reaction/product",
  Shop: "reaction/shop",
};

export const encodeAccountOpaqueId = encodeOpaqueId(namespaces.Account);
export const encodeAddressOpaqueId = encodeOpaqueId(namespaces.Address);
export const encodeCartCatalogOpaqueId = encodeOpaqueId(namespaces.CartCatalog);
export const encodeCartItemOpaqueId = encodeOpaqueId(namespaces.CartItem);
export const encodeCartOpaqueId = encodeOpaqueId(namespaces.Cart);
export const encodeFulfillmentGroupOpaqueId = encodeOpaqueId(namespaces.FulfillmentGroup);
export const encodeShopOpaqueId = encodeOpaqueId(namespaces.Shop);
export const encodeProdcutOpaqueId = encodeOpaqueId(namespaces.Prodcut);

export const decodeAccountOpaqueId = decodeOpaqueIdForNamespace(namespaces.Account);
export const decodeAddressOpaqueId = decodeOpaqueIdForNamespace(namespaces.Address);
export const decodeCartCatalogOpaqueId = decodeOpaqueIdForNamespace(namespaces.CartCatalog);
export const decodeCartItemOpaqueId = decodeOpaqueIdForNamespace(namespaces.CartItem);
export const decodeCartOpaqueId = decodeOpaqueIdForNamespace(namespaces.Cart);
export const decodeFulfillmentGroupOpaqueId = decodeOpaqueIdForNamespace(namespaces.FulfillmentGroup);
export const decodeProductOpaqueId = decodeOpaqueIdForNamespace(namespaces.Product);
export const decodeShopOpaqueId = decodeOpaqueIdForNamespace(namespaces.Shop);

/**
 * @param {Object[]} items Array of CartItemInput
 * @returns {Object[]} Same array with all IDs transformed to internal
 */
export function decodeCartItemsOpaqueIds(items) {
  return items.map((item) => ({
    ...item,
    productConfiguration: {
      productId: decodeProductOpaqueId(item.productConfiguration.productId),
      productVariantId: decodeProductOpaqueId(item.productConfiguration.productVariantId),
    },
  }));
}
export function decodeCartCatalogsOpaqueIds(catalogs) {
  return catalogs.map((catalog) => ({
    ...catalog,
    productId: decodeProductOpaqueId(catalog.productId),
  }));
}
