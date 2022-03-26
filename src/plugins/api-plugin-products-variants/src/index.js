import pkg from "../package.json";
/* import policies from "./policies.json";
import queries from "./queries/index.js";
import resolvers from "./resolvers/index.js"; */
import schemas from "./schemas/index.js";
import startup from "./startup.js";
import publishProductToCatalog from "./publishProductToCatalog.js";
/**
 * @summary Import and call this function to add this plugin to your API.
 * @param {ReactionAPI} app The ReactionAPI instance
 * @returns {undefined}
 */
export default async function register(app) {
  await app.registerPlugin({
    label: "Products Variants",
    name: "products-variants", 
    version: pkg.version,
    graphQL: {
    /*   resolvers, */
      schemas
    },
    functionsByType: {
      startup: [startup] ,
      publishProductToCatalog: [publishProductToCatalog]
    },
/*     policies,
    queries */
  });

  
}
