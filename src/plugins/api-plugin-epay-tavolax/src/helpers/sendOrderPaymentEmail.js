/**
 * @summary Sends an email about an order.
 * @param {Object} context App context
 * @param {Object} order - The order document
 * @param {String} [action] - The action triggering the email
 * @returns {Boolean} True if sent; else false
 */
export default async function sendOrderPaymentEmail(
  context,
  payment,
  email,
  shopId
) {
  // anonymous account orders without emails.
  const to = email;
  const shop = await context.collections.Shops.findOne({ _id: shopId });
  payment.shop = shop;

  const language = "es";

  await context.mutations.sendOrderPaymentEmail(context, {
    dataForEmail: payment,
    fromShop: payment.shop,
    language,
    to,
  });

  return true;
}
