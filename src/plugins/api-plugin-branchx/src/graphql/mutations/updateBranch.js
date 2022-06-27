import { Branch } from "../../simpleSchemas.js";

/**
 * @name shop/updateShop
 * @memberof Mutations/Shop
 * @method
 * @summary Updates data on the Shop object
 * @param {Object} context - GraphQL execution context
 * @param {Object} input - an object of all mutation arguments that were sent
 * @param {String} input.description - The shop's description
 * @param {Array} input.addressBook - The shop's physical address
 * @param {Boolean} input.allowGuestCheckout - Allow user to checkout without creating an account
 * @param {String} input.brandAssets - A media record id to use as the shop's brand asset
 * @param {Array} input.emails - The shop's primary email address
 * @param {String} input.keywords - The shop's keywords
 * @param {String} input.name - The shop's name
 * @param {String} input.shopId - The shop ID
 * @param {Object} input.shopLogoUrls - An object containing the shop logo urls to update
 * @param {String} input.slug - The shop's slug
 * @param {Object} input.storefrontUrls - An object containing storefront url locations
 * @returns {Promise<Object>} with updated shop
 */
export default async function updateBranch(context, _id, input) {
  const { collections } = context;
  const { Branches } = collections;

  Branch.validate(input || {});

  // Check permission to make sure user is allowed to do this
  // Security check for admin access
  // await context.validatePermissions(`reaction:legacy:shops:${shopId}`, "update", { shopId });

  const { value: updatedBranch } = await Branches.findOneAndUpdate(
    { _id, active: true },
    {
      $set: {
        ...input,
        updatedAt: new Date()
      }
    },
    {
      returnOriginal: false
    }
  );

  return updatedBranch;
}
