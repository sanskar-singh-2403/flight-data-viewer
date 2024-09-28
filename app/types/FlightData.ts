export interface FlightData {
    booking_id: number;
    flight_id: number;
    flight_number: string;
    airline_name: string;
    departure_airport: string;
    arrival_airport: string;
    departure_time: string;
    arrival_time: string;
    passenger_id: number;
    passenger_first_name: string;
    passenger_last_name: string;
    passenger_email: string;
    passenger_phone: string;
    booking_date: string;
    total_price: number;
    payment_status: string;
    baggage_weight: number;
    baggage_type: string;
    booking_status: string;
    airline_code: string;
    duration: number;
    country: string;
    city: string;
  }

export type CSVRow = { [key: string]: string };