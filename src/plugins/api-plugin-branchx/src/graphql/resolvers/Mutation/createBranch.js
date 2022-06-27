/**
 * @name Mutation/createBranch
 * @method
 * @memberof Shop/GraphQL
 * @summary resolver for the createBranch GraphQL mutation
 * @param {Object} _ - unused
 * @param {Object} args.input - an object of all mutation arguments that were sent by the client
 * @param {Object} context - an object containing the per-request state
 * @returns {Promise<Object>} CreateBranchPayload
 */
export default async function createBranch(_, { input }, context) {
  const { ...mutationInput } = input;

  const branch = await context.mutations.createBranch(context, {
    ...mutationInput
  });

  return branch;
}
