export const EventTypes = {
  generic: "generic",
  return: "return",
  pickup: "pickup",
  booking: "booking",
} as const;
export type EventType = (typeof EventTypes)[keyof typeof EventTypes];

export type ExtendedBooking = {
  id: string;
  pickupReturnStationId: string;
  customerName: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  station: {
    id: string;
    name: string;
  };
};

export type ExtendedBookings = ExtendedBooking[];

export type Booking = {
  id: string;
  pickupReturnStationId: string;
  customerName: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
};

export type Bookings = Booking[];

export type Station = {
  id: string;
  name: string;
  bookings: Bookings;
};

export type Stations = Station[];
