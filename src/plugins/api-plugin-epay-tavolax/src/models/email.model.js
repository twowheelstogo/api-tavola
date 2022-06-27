const getModel = (epayModel, res, act) => {
  const nameCommerce = process.env.EPAY_NAME_COMMERCE;
  const membership = process.env.EPAY_MEMBERSHIP_COMMERCE;
  const addressCommerce = process.env.EPAY_ADDRESS_COMMERCE;
  const numberCard = epayModel.metadata.pan;
  const nameCard = epayModel.metadata.cardName;
  let now = new Date();
  now = now.toLocaleString("es-GT", { timeZone: "America/Guatemala" });
  const auditNumber = res.auditNumber;
  const referenceNumber = res.referenceNumber;
  const authorizationtNumber = res.authorizationNumber;
  let action = "pago";
  let pastAction = "Pagado";
  if (act != "approved") {
    action = "devolución";
    pastAction = "Devuelto";
    epayModel.amount = epayModel.amount * -1;
  }
  let amount = epayModel.amount.toFixed(2);
  return {
    nameCommerce,
    membership,
    addressCommerce,
    numberCard,
    nameCard,
    now,
    auditNumber,
    referenceNumber,
    authorizationtNumber,
    amount,
    action,
    pastAction,
  };
};

export default {
  getModel,
};
