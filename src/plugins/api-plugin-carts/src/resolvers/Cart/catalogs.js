import _ from "lodash";
import xformArrayToConnection from "@reactioncommerce/api-utils/graphql/xformArrayToConnection.js";
import xformCartItems from "../../xforms/xformCartItems.js";
import xformCartCatalogs from "../../xforms/xformCartCatalogs.js";

/**
 * @summary Sorts the provided cart items according to the connectionArgs.
 * @param {Object[]} cartItems Array of cart items
 * @param {ConnectionArgs} connectionArgs - An object of all arguments that were sent by the client
 * @returns {Object[]} Sorted list of cart items
 */
function sortCartItems(cartItems, connectionArgs = {}) {
  const { sortOrder = "desc", sortBy } = connectionArgs;

  let sortedItems;
  switch (sortBy) {
    case "addedAt":
      sortedItems = _.orderBy(cartItems, ["addedAt", "_id"], [sortOrder, sortOrder]);
      break;

    // sort alpha by _id
    default:
      sortedItems = _.orderBy(cartItems, ["_id"], [sortOrder]);
      break;
  }

  return sortedItems;
}

/**
 * @name Cart/items
 * @method
 * @memberof Cart/GraphQL
 * @summary converts the `items` prop on the provided cart to a connection
 * @param {Object} cart - result of the parent resolver, which is a Cart object in GraphQL schema format
 * @param {ConnectionArgs} connectionArgs - An object of all arguments that were sent by the client
 * @param {Object} context - The per-request context object
 * @returns {Promise<Object>} A connection object
 */
export default async function catalogs(cart, connectionArgs, context) {
  let { items: cartItems, catalogs: cartCatalogs } = cart;
  if (!Array.isArray(cartCatalogs) || cartCatalogs.length === 0) return xformArrayToConnection(connectionArgs, []);

  // Apply requested sorting
  cartItems = sortCartItems(cartItems, connectionArgs);
  cartCatalogs = sortCartItems(cartCatalogs, connectionArgs).map((c) => ({
    ...c,
    items: xformCartItems(context, cartItems.filter((i) => i.cartCatalogId === c._id)),
  }));

  return xformArrayToConnection(connectionArgs, xformCartCatalogs(context, cartCatalogs));
}
