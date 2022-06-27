import Random from "@reactioncommerce/random";
import ReactionError from "@reactioncommerce/reaction-error";
import { Branch } from "../../simpleSchemas.js";

/**
 * @name shop/createShop
 * @memberof Mutations/Shop
 * @method
 * @summary Creates a new branch
 * @param {Object} context - App context
 * @param {Object} input - an object of all mutation arguments that were sent
 * @param {String} [input.currencyCode] Currency in which all money values should be assumed to be. Default "USD"
 * @param {String} [input.defaultLanguage] Default language for translation and localization. Default "en"
 * @param {String} [input.defaultTimezone] Primary timezone. Default "US/Pacific"
 * @param {String} input.name A unique name for the shop
 * @param {String} [input.type] The shop type. Default is "primary", but there may be only one primary shop.
 * @returns {Promise<Object>} with updated shop
 */
export default async function createBranch(context, input) {
  Branch.validate(input || {});

  const { collections } = context;

  await context.validatePermissions("reaction:legacy:shops", "create", {
    shopId: null
  });

  const checkShop = await collections.Shops.findOne({ _id: input.shopId });
  if (!checkShop) {
    throw new ReactionError("invalid-shop", "The shop must be exist");
  }

  const now = new Date();
  const branch = {
    _id: Random.id(),
    active: true,
    createdAt: now,
    updatedAt: now,
    ...input
  };
  const { result } = await collections.Branches.insertOne(branch);

  if (result.ok !== 1) {
    throw new ReactionError("server-error", "Unable to create branch");
  }
  return branch;
}
