import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class PaymentProvider {
  private secretKey = process.env.ESEWA_SECRET_KEY || '';
  private productCode = process.env.ESEWA_PRODUCT_CODE || '';
  private esewaBaseUrl = process.env.ESEWA_BASE_URL || '';
  private appUrl = process.env.APP_URL;

  //!=================== ESEWA ============================================
  //* ------------------------- GENERATE SIGNATURE ESEWA ----------------------------
  private generateEsewaSignature(orderid: string, amount: number) {
    const message = `total_amount=${amount},transaction_uuid=${orderid},product_code=${this.productCode}`;

    return crypto
      .createHmac('sha256', this.secretKey)
      .update(message)
      .digest('base64');
  }

  //* ------------------------- INITIATE PAYMENT ESEWA ----------------------------
  initiateEsewaPayment(orderId: string, amount: number) {
    const signature = this.generateEsewaSignature(orderId, amount);

    return {
      amount,
      tax_amount: 0,
      total_amount: amount,
      transaction_uuid: orderId,
      product_code: this.productCode,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: `${this.appUrl}/orders/esewa/verify`,
      failure_url: `${this.appUrl}/orders/esewa/failure`,
      signed_field_names: `total_amount,transaction_uuid,product_code`,
      signature,
      payment_url: `${this.esewaBaseUrl}/api/epay/main/v2/form/`,
    };
  }

  //* ------------------------- VERIFY ESEWA PAYMENT ----------------------------
  async verifyEsewaPayment(encodedData: string) {
    try {
      const decodedData = JSON.parse(
        Buffer.from(encodedData, 'base64').toString('utf-8'),
      );

      console.log(`eSewa decoded response: `, decodedData);

      const response = await axios.get(
        `${this.esewaBaseUrl}/api/epay/transaction/status/`,
        {
          params: {
            product_code: this.productCode,
            transaction_uuid: decodedData.transaction_uuid,
            total_amount: decodedData.total_amount,
          },
        },
      );

      return {
        ...response.data,
        orderId: decodedData.transaction_uuid,
      };
    } catch (error) {
      console.log(`eSewa verification error: `, error.response.data);
      throw new BadRequestException('eSewa verification failed.');
    }
  }
}
