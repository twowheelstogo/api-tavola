/*import soapRequest from "easy-soap-request";
import {SERVICE_DOMAIN} from "../utils/constants.js";
async function CreateEpayPayment(xml){
    const url = 'https://epaytestvisanet.com.gt/paymentcommerce.asmx?WSDL';
    const req_headers ={
        'user-agent': 'EpayCharge',
        'Content-Type': 'application/soap+xml; charset=utf-8'
        // 'soapAction': 'https://graphical.weather.gov/xml/DWMLgen/wsdl/ndfdXML.wsdl#LatLonListZipCode',
      };
  const { response } = await soapRequest({ url: url, headers: req_headers, xml: xml, timeout: 1000,method:'POST' }); // Optional timeout parameter(milliseconds)
  const { headers, body, statusCode } = response;
    console.log("jaaaa");
  return response;
}
export{
    CreateEpayPayment
}*/
