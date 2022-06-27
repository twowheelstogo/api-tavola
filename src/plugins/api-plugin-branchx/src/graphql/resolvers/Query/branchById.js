import {
  decodeBranchOpaqueId,
  decodeShopOpaqueId
} from "../../../xforms/id.js";

/**
 * @name Query.brancchById
 * @method
 * @memberof Branch/GraphQL
 * @summary Get an order by ID.
 * @param {Object} parentResult - unused
 * @param {ConnectionArgs} args - An object of all arguments that were sent by the client
 * @param {String} args.id - ID of the branch
 * @param {Object} context - An object containing the per-request state
 * @returns {Promise<Object>|undefined} An Branch object
 */
export default async function branchById(parentResult, args, context) {
  const { branchId, shopId } = args;

  const branch = await context.queries.branchById(context, {
    branchId: decodeBranchOpaqueId(branchId),
    shopId: decodeShopOpaqueId(shopId)
  });

  return branch;
}
