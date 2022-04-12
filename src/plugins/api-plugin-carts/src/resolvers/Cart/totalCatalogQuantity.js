/**
 * @param {Object} collections Map of Mongo collections
 * @param {Object} catalogs Cart catalogs
 * @returns {Number} Total quantity of all catalogs in the cart
 */
async function xformTotalCatalogQuantity(collections, catalogs) {
  // Total catalog quantity comes from the sum of the quantities of each catalog
  return (catalogs || []).reduce((sum, catalog) => (sum + catalog.quantity), 0);
}

/**
 * @name Cart/totalCatalogQuantity
 * @method
 * @memberof Cart/GraphQL
 * @summary Calculates the total quantity of catalogs in the cart and returns a number
 * @param {Object} cart - Result of the parent resolver, which is a Cart object in GraphQL schema format
 * @param {Object} connectionArgs - Connection args. (not used for this resolver)
 * @param {Object} context - An object containing the per-request state
 * @returns {Promise<Number>} A promise that resolves to the number of the total catalog quantity
 */
export default async function totalCatalogQuantity(cart, connectionArgs, context) {
  if (!Array.isArray(cart.catalogs)) return 0;

  return xformTotalCatalogQuantity(context.collections, cart.catalogs);
}
