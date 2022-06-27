import pkg from "../package.json";
import policies from "./policies.json";
import startup from "./startup.js";
import schemas from "./graphql/schemas/index.js";
import resolvers from "./graphql/resolvers/index.js";
import { Branch } from "./simpleSchemas.js";
import mutations from "./graphql/mutations/index.js";
import queries from "./graphql/queries/index.js";
import i18n from "./i18n/index.js";

/**
 * @summary Import and call this function to add this plugin to your API.
 * @param {ReactionAPI} app The ReactionAPI instance
 * @returns {undefined}
 */
export default async function register(app) {
  await app.registerPlugin({
    label: "Branches",
    name: "branches",
    version: pkg.version,
    i18n,
    collections: {
      Branches: {
        name: "Branches",
        indexes: [
          [{ "geographyData.point": "2dsphere" }],
          [{ "geographyData.polygon": "2dsphere" }],
          [{ shopId: 1 }]
        ]
      }
    },
    functionsByType: {
      startup: [startup]
    },
    policies,
    graphQL: {
      schemas,
      resolvers
    },
    mutations,
    queries,
    simpleSchemas: {
      Branch
    }
  });
}
