import ReactionError from "@reactioncommerce/reaction-error";

/**
 * @name orderById
 * @method
 * @memberof Order/NoMeteorQueries
 * @summary Query the Orders collection for an order with the provided orderId
 * @param {Object} context - an object containing the per-request state
 * @param {Object} params - request parameters
 * @param {String} params.orderId - Order ID
 * @param {String} params.shopId - Shop ID for the shop that owns the order
 * @param {String} [params.token] - Anonymous order token
 * @returns {Promise<Object>|undefined} - An Order document, if one is found
 */
export default async function branchById(context, { branchId, shopId }) {
  if (!branchId || !shopId) {
    throw new ReactionError(
      "invalid-param",
      "You must provide orderId and shopId arguments"
    );
  }
  const { collections } = context;
  const { Branches } = collections;
  const branch = await Branches.findOne({
    _id: branchId,
    shopId,
    active: true
  });
  return branch;
}
