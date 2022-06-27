const getModel = (
  shopperIP,
  auditNumber = "",
  email = "",
  cardNumber = "",
  cardExpiry = "",
  amount = 0,
  cvv2 = "",
  cardName = ""
) => {
  let pan = cardNumber && cardNumber.replace(/ /g, "");
  cardExpiry = cardExpiry.replace(/[^\d]/g, "");
  let expvalues =
    cardExpiry &&
    `${cardExpiry[2]}${cardExpiry[3]}${cardExpiry[0]}${cardExpiry[1]}`;
  let expdate = expvalues;
  let metaPan = pan.replace(/\d(?=\d{4})/gm, "x");
  auditNumber = auditNumber.toString();
  auditNumber = auditNumber.padStart(6, "0");

  const _epayModel = {
    shopperIP,
    pan,
    expdate,
    amount,
    cvv2,
    auditNumber,
    email,
    cardName,
    metadata: {
      pan: metaPan,
      cardName,
      amount,
      email,
    },
  };
  return _epayModel;
};

const ENTRY_MODE = "012";
const TO_AUTHORIZE = "0200";
const TO_REFUND = "0202";
const TO_REVERSE = "0400";

const modelToXml = (model, action, isReverse = false) => {
  const epayPaymentIP = process.env.EPAY_PAYMENT_IP;
  const epayMerchantIP = process.env.EPAY_MERCHANT_IP;
  const epayMerchantUser = process.env.EPAY_MERCHANT_USER;
  const epayMerchantPassword = process.env.EPAY_MERCHANT_PASSWORD;
  const epayTerminalId = process.env.EPAY_TERMINAL_ID;
  const epayMerchant = process.env.EPAY_MERCHANT;
  const epayShopIP = process.env.EPAY_SHOP_IP;

  let xml =
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://general_computing.com/paymentgw/types">';
  xml += "<soapenv:Header/>";
  xml += "<soapenv:Body>";
  xml += "<typ:AuthorizationRequest>";
  xml += "<typ:AuthorizationRequest>";
  xml += `<typ:posEntryMode>${ENTRY_MODE}</typ:posEntryMode>`;
  xml += `<typ:paymentgwIP>${epayPaymentIP}</typ:paymentgwIP>`;
  xml += `<typ:shopperIP>${epayShopIP}</typ:shopperIP>`;
  xml += `<typ:merchantServerIP>${epayMerchantIP}</typ:merchantServerIP>`;
  xml += `<typ:merchantUser>${epayMerchantUser}</typ:merchantUser>`;
  xml += `<typ:merchantPasswd>${epayMerchantPassword}</typ:merchantPasswd>`;
  xml += `<typ:terminalId>${epayTerminalId}</typ:terminalId>`;
  xml += `<typ:merchant>${epayMerchant}</typ:merchant>`;
  xml += `<typ:auditNumber>${model.auditNumber}</typ:auditNumber>`;
  xml += `<typ:track2Data></typ:track2Data>`;
  if (action == 0) {
    if(isReverse){
      xml += `<typ:messageType>${TO_REVERSE}</typ:messageType>`;
    }else{
      xml += `<typ:messageType>${TO_AUTHORIZE}</typ:messageType>`;
    }
    xml += `<typ:pan>${model.pan}</typ:pan>`;
    xml += `<typ:expdate>${model.expdate}</typ:expdate>`;
    xml += `<typ:amount>${parseInt(model.amount * 100)}</typ:amount>`;
    xml += `<typ:cvv2>${model.cvv2}</typ:cvv2>`;
  } else {
    if(isReverse){
      xml += `<typ:messageType>${TO_REVERSE}</typ:messageType>`;
    }else{
      xml += `<typ:messageType>${TO_REFUND}</typ:messageType>`;
    }
    xml += `<typ:pan></typ:pan>`;
    xml += `<typ:expdate></typ:expdate>`;
    xml += `<typ:amount></typ:amount>`;
    xml += `<typ:cvv2></typ:cvv2>`;
  }
  xml += "<typ:additionalData></typ:additionalData>";
  xml += "</typ:AuthorizationRequest>";
  xml += "</typ:AuthorizationRequest>";
  xml += "</soapenv:Body>";
  xml += "</soapenv:Envelope>";
  return xml;
};

const resToJson = async (res) => {
  const xml = await res.text();
  let regex = new RegExp("<auditNumber>(.*?)</auditNumber>");
  const auditNumber = await xml.match(regex)[1];
  regex = new RegExp("<referenceNumber>(.*?)</referenceNumber>");
  const referenceNumber = await xml.match(regex)[1];
  regex = new RegExp("<authorizationNumber>(.*?)</authorizationNumber>");
  const authorizationNumber = await xml.match(regex)[1];
  regex = new RegExp("<messageType>(.*?)</messageType>");
  const messageType = await xml.match(regex)[1];
  regex = new RegExp("<responseCode>(.*?)</responseCode>");
  const responseCode = await xml.match(regex)[1];
  return {
    auditNumber,
    referenceNumber,
    authorizationNumber,
    messageType,
    responseCode,
  };
};

export default {
  getModel,
  modelToXml,
  resToJson,
};
