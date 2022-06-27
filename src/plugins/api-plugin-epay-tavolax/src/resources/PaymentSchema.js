export default class PaymentSchema{
    constructor(props){
        this.posEntryMode = props.posEntryMode;
        this.pan = props.pan;
        this.expdate = props.expdate;
        this.amount = props.amount;
        this.track2Data = props.track2Data;
        this.cvv2 = props.cvv2;
        this.paymentgwIP = props.paymentgwIP;
        this.shopperIP = props.shopperIP;
        this.merchantServerIP = props.merchantServerIP;
        this.merchantUser = props.merchantUser;
        this.merchantPasswd = props.merchantPasswd;
        this.terminalId = props.terminalId;
        this.merchant = props.merchant;
        this.messageType = props.messageType;
        this.auditNumber = props.auditNumber;
        this.additionalData = props.additionalData;
    }
    toXml(){
        return `<?xml version="1.0" encoding="utf-8"?>
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
          <soap12:Body>
            <AuthorizationRequest xmlns="http://general_computing.com/paymentgw/types">
              <AuthorizationRequest>
                <posEntryMode>${this.posEntryMode}</posEntryMode>
                <pan>${this.pan}</pan>
                <expdate>${this.expdate}</expdate>
                <amount>${this.amount}</amount>
                <track2Data>${this.track2Data}</track2Data>
                <cvv2>${this.cvv2}</cvv2>
                <paymentgwIP>${this.paymentgwIP}</paymentgwIP>
                <shopperIP>${this.shopperIP}</shopperIP>
                <merchantServerIP>${this.merchantServerIP}</merchantServerIP>
                <merchantUser>${this.merchantUser}</merchantUser>
                <merchantPasswd>${this.merchantPasswd}</merchantPasswd>
                <terminalId>${this.terminalId}</terminalId>
                <merchant>${this.merchant}</merchant>
                <messageType>${this.messageType}</messageType>
                <auditNumber>${this.auditNumber}</auditNumber>
                <additionalData>${this.additionalData}</additionalData>
              </AuthorizationRequest>
            </AuthorizationRequest>
          </soap12:Body>
        </soap12:Envelope>`;
    }
}