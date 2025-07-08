import React from "react";
import { EventTypes, type ExtendedBooking } from "../../types/types";
import { getEventTypeStyle, prettyDuration } from "./helpers";
import { useBookingDetails } from "../../hooks/useBookingDetails";

interface BookingDetailProps {
  booking: ExtendedBooking;
  onClose: () => void;
}

export const BookingDetail: React.FC<BookingDetailProps> = ({ booking, onClose }) => {
  const { bookingDetails, loading, error } = useBookingDetails(booking.id, booking.station.id);

  if (!bookingDetails) <div className=""></div>;

  return (
    <div
      className={`booking-detail bg-white rounded-lg p-6 mx-auto relative ${getEventTypeStyle(
        EventTypes.generic
      )} max-w-full`}
    >
      <button
        className="absolute p-2 top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
        onClick={onClose}
        aria-label="Close"
        tabIndex={0}
      >
        ×
      </button>
      <h2 className="text-xl font-bold mb-4">Booking Details</h2>
      {error ? (
        <div className="mb-2 text-red-500 italic">{error}</div>
      ) : loading ? (
        <div className={`mb-2 ${getEventTypeStyle(EventTypes.generic)} italic`}>Loading the information...</div>
      ) : !bookingDetails ? (
        <div className="mb-2 text-red-500 italic">
          Seems that the booking information is incorrect, please contant information.
        </div>
      ) : (
        <>
          <div className="mb-2">
            Customer: <span className="font-semibold">{bookingDetails.customerName}</span>
          </div>
          <div className="mb-2">
            Station: <span className="font-semibold">{booking.station.name}</span>
          </div>
          <div className="mb-2">
            Start Date: <span className="font-semibold">{new Date(bookingDetails.startDate).toLocaleString()}</span>
          </div>
          <div className="mb-2">
            End Date: <span className="font-semibold">{new Date(bookingDetails.endDate).toLocaleString()}</span>
          </div>
          <div className="mb-2">
            Duration: <span className="font-semibold">{prettyDuration(bookingDetails)}</span>
          </div>
          <div className="mb-2">
            Booking ID: <span className="font-semibold">{bookingDetails.id}</span>
          </div>
        </>
      )}
    </div>
  );
};
