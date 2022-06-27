import {
  decodeShopOpaqueId,
  decodeBranchOpaqueId
} from "../../../xforms/id.js";

/**
 * @name Mutation/updateBranch
 * @method
 * @memberof Branch/GraphQL
 * @summary resolver for the deleteBranch GraphQL mutation
 * @param {Object} _ - unused
 * @param {Object} args.input - an object of all mutation arguments that were sent by the client
 * @param {Object} context - an object containing the per-request state
 * @returns {Promise<Object>} DeleteBranchPayload
 */
export default async function deleteBranch(_, { input }, context) {
  const { branchId, shopId } = input;
  const deletedBranch = await context.mutations.deleteBranch(context, {
    branchId: decodeBranchOpaqueId(branchId),
    shopId: decodeShopOpaqueId(shopId)
  });

  return deletedBranch;
}
