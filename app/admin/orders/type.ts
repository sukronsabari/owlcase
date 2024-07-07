// Interface for OrderCreated response
export interface OrderCreatedResponse {
  success: true;
  message: string;
  object: string;
  id: string;
  shipper: {
    name: string;
    email: string;
    phone: string;
    organization: string;
  };
  origin: {
    contact_name: string;
    contact_phone: string;
    coordinate: {
      latitude: number;
      longitude: number;
    };
    address: string;
    note: string;
    postal_code: number;
  };
  destination: {
    contact_name: string;
    contact_phone: string;
    contact_email: string;
    address: string;
    note: string;
    proof_of_delivery: {
      use: boolean;
      fee: number;
      note: string | null;
      link: string | null;
    };
    cash_on_delivery: {
      id: string;
      amount: number;
      fee: number;
      note: string | null;
      type: string;
    };
    coordinate: {
      latitude: number;
      longitude: number;
    };
    postal_code: number;
  };
  courier: {
    tracking_id: string;
    waybill_id: string | null;
    company: string;
    name: string | null; // Deprecated
    phone: string | null; // Deprecated
    driver_name: string | null;
    driver_phone: string | null;
    driver_photo_url: string | null;
    driver_plate_number: string | null;
    type: string;
    link: string | null;
    insurance: {
      amount: number;
      fee: number;
      note: string;
    };
    routing_code: string | null;
  };
  delivery: {
    datetime: string;
    note: string | null;
    type: string;
    distance: number;
    distance_unit: string;
  };
  reference_id: string | null;
  items: {
    name: string;
    description: string;
    sku: string | null;
    value: number;
    quantity: number;
    length: number;
    width: number;
    height: number;
    weight: number;
  }[];
  extra: any[]; // or define a specific type if known
  price: number;
  metadata: any; // or define a specific type if known
  note: string;
  status: string;
}

// Interface for order failed response
export interface OrderFailedResponse {
  success: false;
  error: string;
  code: number;
  details: {
    order_id: string;
    waybill_id: string;
    reference_id: string;
  };
}
