
import { RestCollectorClient } from "rest-collector";
import AhoraRestCollector from "./base";

export interface PaymentFormDetails {
    token: string;
}
export interface PaymentData {
    cardHolderName: string;
    token: string;
    binCategory: string
    ccBin: string
    cardSubType: string
    ccType: string;
    isRegulatedCard: string;
    issuingCountry: string;
    last4Digits: string;
    exp: string;
}


const paymentClient: RestCollectorClient = new AhoraRestCollector("/api/payments");
const setOrgPayment: RestCollectorClient = new AhoraRestCollector("/api/organizations/{organizationId}/payment");

export const getPaymentToken = async (): Promise<PaymentFormDetails> => {
    const result = await paymentClient.get();
    return result.data;
}

export const setOrgPaymentData = async (paymentInfo: PaymentData): Promise<void> => {
    const result = await setOrgPayment.post({
        data: paymentInfo
    });
    return result.data;
}



export const getOrgPaymentData = async (): Promise<PaymentData | null> => {
    const result = await setOrgPayment.get()
    return result.data;
}

