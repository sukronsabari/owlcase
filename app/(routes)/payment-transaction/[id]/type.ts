interface VirtualAccountNumber {
  bank: string;
  va_number: string;
}

export interface TransactionStatus {
  status_code: string;
  transaction_id: string;
  gross_amount: string;
  currency: string;
  order_id: string;
  payment_type: string;
  signature_key: string;
  transaction_status: string;
  fraud_status: string;
  status_message: string;
  merchant_id: string;
  va_numbers?: VirtualAccountNumber[];
  payment_amounts?: [];
  transaction_time: string;
  expiry_time: string;
}
