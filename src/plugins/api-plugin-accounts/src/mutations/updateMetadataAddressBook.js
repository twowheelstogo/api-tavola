import ReactionError from "@reactioncommerce/reaction-error";

/**
 * @name accounts/updateGroupsForAccounts
 * @memberof Mutations/Accounts
 * @method
 * @summary Bulk-update group assignments for specified accounts
 * @param {Object} context - GraphQL execution context
 * @param {Object} input - Input arguments
 * @param {String} input.accountIds - The account IDs
 * @param {String} input.groupIds - The group IDs
 * @return {Promise<Object>} accounts with updated groups
 */
export default async function updateMetadataAddressBook(context, input) {
  const { addressId, metaddress } = input;
  const {
    collections: { Accounts },
  } = context;

  const { value: Account } = await Accounts.findOneAndUpdate(
    { "profile.addressBook._id": addressId },
    { $set: { "profile.addressBook.$.metaddress": metaddress } },
    {
      returnOriginal: false,
    }
  );
  const _metaddress = await Account.profile.addressBook.find(
    (x) => x._id === addressId
  );
  return _metaddress;
}
