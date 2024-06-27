export interface CourierPricingResponse {
  success: boolean;
  object: string;
  message: string;
  code: number;
  origin: Location;
  stops: any[]; // Define this type if you have more information
  destination: Location;
  pricing: Pricing[];
}

export interface Location {
  location_id: string | null;
  latitude: number | null;
  longitude: number | null;
  postal_code: string;
  country_name: string;
  country_code: string;
  administrative_division_level_1_name: string;
  administrative_division_level_1_type: string;
  administrative_division_level_2_name: string;
  administrative_division_level_2_type: string;
  administrative_division_level_3_name: string;
  administrative_division_level_3_type: string;
  administrative_division_level_4_name: string;
  administrative_division_level_4_type: string;
  address: string | null;
}

export interface Pricing {
  available_collection_method: string[]; // Adjust based on actual type if available
  available_for_cash_on_delivery: boolean;
  available_for_proof_of_delivery: boolean;
  available_for_instant_waybill_id: boolean;
  available_for_insurance: boolean;
  company: string;
  courier_name: string;
  courier_code: string;
  courier_service_name: string;
  courier_service_code: string;
  description: string;
  duration: string;
  shipment_duration_range: string;
  shipment_duration_unit: string;
  service_type: string;
  shipping_type: string;
  price: number;
  type: string;
}

// PAYMENT
interface Action {
  name: string;
  method: string;
  url: string;
}

interface VirtualAccountNumber {
  bank: string;
  va_number: string;
}

export interface Transaction {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  currency: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status: string;
  actions?: Action[];
  va_numbers?: VirtualAccountNumber[];
  expiry_time: string;
}
