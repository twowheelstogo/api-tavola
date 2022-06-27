import { decodeShopOpaqueId } from "../../../xforms/id.js";

/**
 * @name Query.brancchById
 * @method
 * @memberof Branch/GraphQL
 * @summary Get all branches.
 * @param {Object} parentResult - unused
 * @param {ConnectionArgs} args - An object of all arguments that were sent by the client
 * @param {String} args.id - ID of the branch
 * @param {Object} context - An object containing the per-request state
 * @returns {Promise<Object>|undefined} An Branch object
 */
export default async function branchWithoutPagination(
  parentResult,
  args,
  context
) {
  const { shopId } = args;
  const data = await context.queries.branchWithoutPagination(context, {
    shopId: decodeShopOpaqueId(shopId)
  });
  return data;
}
