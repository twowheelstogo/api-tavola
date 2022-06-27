import { decodeShopOpaqueId } from "../../../xforms/id.js";

/**
 * @name Query.metaddress
 * @method
 * @memberof Branch/GraphQL
 * @summary Get all branches.
 * @param {Object} parentResult - unused
 * @param {ConnectionArgs} args - An object of all arguments that were sent by the client
 * @param {String} args.id - ID of the branch
 * @param {Object} context - An object containing the per-request state
 * @returns {Promise<Object>|undefined} An metaddress object
 */
export default async function metaddress(parentResult, args, context) {
  const { shopId, point } = args;
  const data = await context.queries.metaddress(context, {
    shopId: decodeShopOpaqueId(shopId),
    point
  });
  return data;
}
