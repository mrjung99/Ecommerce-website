import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentProvider {
  private secretKey = process.env.ESEWA_SECRET_KEY || '';
  private productCode = process.env.ESEWA_PRODUCT_CODE || '';
  private esewaBaseUrl = process.env.ESEWA_BASE_URL || '';
  private appUrl = process.env.APP_URL;

  private khaltiSecretKey = process.env.KHALTI_SECRET_KEY;
  private khaltiBaseUrl = process.env.KHALTI_BASE_URL;

  private readonly logger = new Logger(PaymentProvider.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  //!=================== ESEWA ============================================
  //* ------------------------- GENERATE SIGNATURE ESEWA ----------------------------
  private generateEsewaSignature(orderid: string, amount: number) {
    const message = `total_amount=${amount},transaction_uuid=${orderid},product_code=${this.productCode.trim()}`;

    console.log('--- ESEWA DEBUG ---');
    console.log('MESSAGE:', message);
    console.log('AMOUNT:', amount);

    return crypto
      .createHmac('sha256', this.secretKey.trim())
      .update(message)
      .digest('base64');
  }

  //* ------------------------- INITIATE PAYMENT ESEWA ----------------------------
  initiateEsewaPayment(orderId: string, amount: number) {
    const signature = this.generateEsewaSignature(orderId, amount);

    console.log('SIGNATURE:', signature);
    console.log('PRODUCT_CODE:', this.productCode);

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
      payment_url: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
    };
  }

  //* ------------------------- VERIFY ESEWA PAYMENT ----------------------------
  async verifyEsewaPayment(encodedData: string) {
    try {
      const decodedData = JSON.parse(
        Buffer.from(encodedData, 'base64').toString('utf-8'),
      );

      this.logger.log(`eSewa decoded response: `, decodedData);

      const response = await axios.get(
        `${this.esewaBaseUrl}/api/epay/transaction/status/?product_code=${this.productCode}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`,
      );

      this.logger.log(`eSewa status response: `, response.data);

      return {
        status: response.data.status,
        ref_id: response.data.ref_id ?? null,
        orderId: decodedData.transaction_uuid,
      };
    } catch (error: any) {
      this.logger.warn('eSewa verification error message:', error?.message);
      this.logger.warn(
        'eSewa verification error response:',
        error?.response?.data,
      );
      this.logger.warn(
        'eSewa verification error status:',
        error?.response?.status,
      );
      throw new BadRequestException(
        error?.response?.data?.message ?? 'eSewa verification failed',
      );
    }
  }

  //!=================== KHALTI ============================================
  async initiateKhaltiPayment(
    orderId: string,
    amount: number,
    customerName: string,
    customerEmail: string,
  ) {
    try {
      const response = await axios.post(
        `${this.khaltiBaseUrl}/epayment/initiate/`,
        {
          return_url: `${this.appUrl}/orders/khalti/verify`,
          website_url: this.appUrl,
          amount: amount * 100,
          purchase_order_id: orderId,
          purchase_order_name: `Order #${orderId}`,
          customer_info: {
            name: customerName,
            email: customerEmail,
          },
        },
        {
          headers: {
            Authorization: `key ${this.khaltiSecretKey}`,
          },
        },
      );

      return response.data;
      // this will return {pidx, payment_url, expires_at}
    } catch (error: any) {
      console.log('Khalti initiation error: ', error?.response?.data);
      throw new BadRequestException('Khalti payment initiation failed.');
    }
  }

  //* ------------------------- VERIFY KHALTI PAYMENT ----------------------------
  async verifyKhaltiPayment(pidx: string) {
    try {
      const response = await axios.post(
        `${this.khaltiBaseUrl}/epayment/lookup/`,
        { pidx },
        {
          headers: {
            Authorization: `Key ${this.khaltiSecretKey}`,
          },
        },
      );

      return response.data;
      // this will return {status, transaction_id, total_amount}
    } catch (error: any) {
      console.log(`Khalti verification error: ${error?.response?.data}`);
      throw new BadRequestException('Khalti verification failed.');
    }
  }

  //* ------------------ REMOVE PAYMENT ------------
  async removePayment(payment: Payment) {
    return await this.paymentRepo.remove(payment);
  }
}
