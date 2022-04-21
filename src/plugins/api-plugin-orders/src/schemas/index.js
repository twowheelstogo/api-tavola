import importAsString from "@reactioncommerce/api-utils/importAsString.js";

const schema = importAsString("./schema.graphql");
const catalog = importAsString("./catalog.graphql");

export default [schema,catalog];
