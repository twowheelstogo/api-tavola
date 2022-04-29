import { decodeAccountOpaqueId, decodeGroupOpaqueId } from "../../xforms/id.js";

/**
 * @name Mutation/updateGroupsForAccounts
 * @method
 * @memberof Accounts/GraphQL
 * @summary resolver for the updateGroupsForAccounts GraphQL mutation
 * @param {Object} parentResult - unused
 * @param {Object} args.input - an object of all mutation arguments that were sent by the client
 * @param {Array|String} args.input.accountIds - The account IDs
 * @param {Array|String} args.input.groupIds - The group IDs to assign to the accounts
 * @param {String} [args.input.clientMutationId] - An optional string identifying the mutation call
 * @param {Object} context - an object containing the per-request state
 * @returns {Object} UpdateGroupsForAccountsPayload
 */
export default async function updateMetadataAddressBook(
  parentResult,
  input,
  context
) {
  const { addressId, metaddress } = input;

  const _metaddress = await context.mutations.updateMetadataAddressBook(
    context,
    {
      addressId,
      metaddress,
    }
  );

  return _metaddress;
}
