import importAsString from "@reactioncommerce/api-utils/importAsString.js";

const schema = importAsString("./schema.graphql");

const updateBranch = importAsString("./updateBranch.graphql");
const createBranch = importAsString("./createBranch.graphql");
const deleteBranch = importAsString("./deleteBranch.graphql");
const queriesBranch = importAsString("./queriesBranch.graphql");

export default [
  schema,
  updateBranch,
  createBranch,
  deleteBranch,
  queriesBranch
];
