import { EPAY_PACKAGE_NAME } from "./utils/constants.js";
import i18n from "./i18n/index.js";
import schemas from "./schemas/index.js";
import pkg from "../package.json";
import epayCreateAuthorizedPayment from "./utils/createAuthorizedPayment.js";
import epayCapturePayment from "./utils/capturePayment.js";
import epayCreateRefund from "./utils/createRefund.js";
import epayListRefunds from "./utils/listRefunds.js";
import startup from "./startup.js";
import mutations from "./mutations/index.js";

export default async function register(app) {
  await app.registerPlugin({
    label: "ePay Payments",
    name: EPAY_PACKAGE_NAME,
    version: pkg.version,
    i18n,
    graphQL: {
      schemas,
    },
    mutations,
    functionsByType: {
      startup: [startup],
    },
    paymentMethods: [
      {
        name: "epay_card",
        canRefund: true,
        displayName: "EPay Payment",
        functions: {
          createAuthorizedPayment: epayCreateAuthorizedPayment,
          capturePayment: epayCapturePayment,
          listRefunds: epayListRefunds,
          createRefund: epayCreateRefund,
        },
      },
    ],
  });
}
