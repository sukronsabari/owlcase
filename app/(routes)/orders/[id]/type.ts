interface Courier {
  company: string;
  driver_name: string;
  driver_phone: string;
  driver_photo_url: string;
  driver_plate_number: string;
}

interface Contact {
  contact_name: string;
  address: string;
}

interface HistoryEvent {
  note: string;
  service_type: string;
  updated_at: string;
  status: string;
}

export interface TrackingData {
  success: boolean;
  message: string;
  object: string;
  id: string;
  waybill_id: string;
  courier: Courier;
  origin: Contact;
  destination: Contact;
  history: HistoryEvent[];
  link: string;
  order_id: string;
  status: string;
}
