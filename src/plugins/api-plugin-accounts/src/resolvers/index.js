import getConnectionTypeResolvers from "@reactioncommerce/api-utils/graphql/getConnectionTypeResolvers.js";
import {encodeAddressOpaqueId} from "../xforms/id.js";
import Account from "./Account/index.js";
import AddAccountAddressBookEntryPayload from "./AddAccountAddressBookEntryPayload.js";
import Group from "./Group/index.js";
import Invitation from "./Invitation/index.js";
import Mutation from "./Mutation/index.js";
import Query from "./Query/index.js";
import Shop from "./Shop/index.js";

/**
 * Account-related GraphQL resolvers
 * @namespace Accounts/GraphQL
 */

export default {
  Account,
  AddAccountAddressBookEntryPayload,
  Group,
  Invitation,
  Mutation,
  Query,
  Shop,
  CustomAddress: { _id: (node) => encodeAddressOpaqueId(node._id) },
  ...getConnectionTypeResolvers("Account"),
  ...getConnectionTypeResolvers("Group"),
};
