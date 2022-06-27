/**
 * @name sendOrderEmail
 * @summary A mutation that compiles and server-side renders the email template with order data, and sends the email
 * @param {Object} context GraphQL context
 * @param {Object} input Data for email: action, dataForEmail, fromShop, to
 * @returns {Undefined} no return
 */
export default async function sendOrderPaymentEmail(context, input) {
  //inputSchema.validate(input);

  const { dataForEmail, fromShop, language, to } = input;

  // Compile email
  const templateName = "payment";
  await context.mutations.sendEmail(context, {
    data: dataForEmail,
    fromShop,
    templateName,
    language,
    to,
  });
}
