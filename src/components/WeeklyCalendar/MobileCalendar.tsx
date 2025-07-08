import type { ExtendedBookings, ExtendedBooking, EventType } from "../../types/types";
import { formatDate, getBookingInfo, getEventTypeStyle, getPrettyHour, isToday } from "./helpers";

interface MobileCalendarProps {
  specificStation: boolean;
  weekDates: Date[];
  weekBookings: ExtendedBookings[];

  onBookingClick: (booking: ExtendedBooking) => void;
}

export const MobileCalendar = ({
  specificStation = false,
  weekDates,
  weekBookings,
  onBookingClick,
}: MobileCalendarProps) => {
  const getDescription = (type: EventType, booking: ExtendedBooking) => {
    if (specificStation) return type;
    else return `${type}@${booking.station.name}`;
  };

  return (
    <div className="md:hidden">
      {weekDates.map((date, index) => {
        const dayBookings = weekBookings[index] || [];
        return (
          <div key={index} className="border-b border-gray-200 last:border-b-0">
            <div className={`p-3 ${isToday(date) ? "bg-blue-50" : "bg-gray-50"}`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${isToday(date) ? "text-blue-900" : "text-gray-900"}`}>
                  {formatDate(date)}
                </h3>
                {dayBookings.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {dayBookings.length} {dayBookings.length === 1 ? "booking" : "bookings"}
                  </span>
                )}
              </div>
            </div>
            <div className="p-3 space-y-2">
              {dayBookings.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No bookings</p>
              ) : (
                dayBookings.map((booking) => {
                  const { type, date: bookingDate } = getBookingInfo(date, booking);
                  return (
                    <div
                      key={booking.id}
                      className={`booking-line p-3 rounded-lg ${getEventTypeStyle(type)}`}
                      onClick={() => onBookingClick(booking)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-row">
                          <div className="font-medium ">{booking.customerName}</div>
                          <div className="ml-2 flex flex-row justify-self-center items-baseline">
                            {getDescription(type, booking)}
                          </div>
                          <div className="ml-2 font-medium">{getPrettyHour(bookingDate)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
