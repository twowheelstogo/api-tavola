import resolveAccountFromAccountId from "@reactioncommerce/api-utils/graphql/resolveAccountFromAccountId.js";
import resolveShopFromShopId from "@reactioncommerce/api-utils/graphql/resolveShopFromShopId.js";
import { encodeCartOpaqueId } from "../../xforms/id.js";
import xformCartItems from "../../xforms/xformCartItems.js";
import checkout from "./checkout.js";
import items from "./items.js";
import catalogs from "./catalogs.js";
import totalItemQuantity from "./totalItemQuantity.js";
import totalCatalogQuantity from "./totalCatalogQuantity.js";

export default {
  _id: (node) => encodeCartOpaqueId(node._id),
  account: resolveAccountFromAccountId,
  checkout,
  items,
  catalogs,
  missingItems: (cart, _, context) => xformCartItems(context, cart.missingItems || []),
  shop: resolveShopFromShopId,
  totalItemQuantity,
  totalCatalogQuantity,
};
