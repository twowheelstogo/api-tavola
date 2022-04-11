import { encodeProdcutOpaqueId } from "./id.js";
/**
 * @param {Object} context - an object containing the per-request state
 * @param {Object[]} catalogs Array of CartCatalog
 * @returns {Object[]} Same array with GraphQL-only props added
 */
export default async function xformCartCatalogs(context, catalogs) {
  const xformedCatalogs = catalogs.map((catalog) => ({
    ...catalog,
    productId: encodeProdcutOpaqueId(catalog.productId),
  }));

  for (const mutateCatalogs of context.getFunctionsOfType("xformCartCatalogs")) {
    await mutateCatalogs(context, xformedCatalogs, catalogs); // eslint-disable-line no-await-in-loop
  }

  return xformedCatalogs;
}
