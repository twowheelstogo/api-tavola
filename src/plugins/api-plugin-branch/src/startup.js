// In this file, everything that requires to be done on startup can be done
// This can be for example setting up a collection or seeding data
// Note that this fuction wil run every single time when starting the project up with docker-compose in dev mode.
import Logger from "@reactioncommerce/logger";

/**
 * @name startup
 * @summary Called on startup
 * @param {Object} context App context
 * @returns {undefined}
 */
export default async function pluginTemplateStartup(context) {
  Logger.info("Reaction-Plugin-Branch startup function started");
}
