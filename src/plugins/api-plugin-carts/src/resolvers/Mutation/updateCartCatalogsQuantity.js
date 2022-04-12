import { decodeCartCatalogOpaqueId, decodeCartOpaqueId } from "../../xforms/id.js";

/**
 * @name Mutation/updateCartCatalogsQuantity
 * @method
 * @memberof Cart/GraphQL
 * @summary resolver for the updateCartCatalogsQuantity GraphQL mutation
 * @param {Object} parentResult - unused
 * @param {Object} args.input - an object of all mutation arguments that were sent by the client
 * @param {String} args.input.cartId - The ID of the cart in which all of the catalogs exist
 * @param {String} args.input.catalogs - Array of catalogs to update
 * @param {Number} args.input.catalogs.cartCatalogId - The cart catalog ID
 * @param {Object} args.input.catalogs.quantity - The new quantity, which must be an integer of 0 or greater
 * @param {String} args.input.cartToken - The cartToken if the cart is an anonymous cart
 * @param {String} [args.input.clientMutationId] - An optional string identifying the mutation call
 * @param {Object} context - an object containing the per-request state
 * @returns {Promise<Object>} UpdateCartCatalogsQuantityPayload
 */
export default async function updateCartCatalogsQuantity(parentResult, { input }, context) {
  const { cartId: opaqueCartId, clientMutationId = null, catalogs, cartToken } = input;

  const cartId = decodeCartOpaqueId(opaqueCartId);
  // const catalogs = catalogsInput.map((catalog) => ({ cartCatalogId: decodeCartCatalogOpaqueId(catalog.cartCatalogId), quantity: catalog.quantity }));

  const { cart } = await context.mutations.updateCartCatalogsQuantity(context, {
    cartId,
    catalogs,
    cartToken
  });

  return { cart, clientMutationId };
}
