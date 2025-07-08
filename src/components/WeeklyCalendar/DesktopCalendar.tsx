import type { ExtendedBookings, ExtendedBooking, EventType } from "../../types/types";
import { formatDate, getBookingInfo, getEventTypeStyle, getPrettyHour, isToday } from "./helpers";

interface DesktopCalendarProps {
  specificStation: boolean;
  weekDates: Date[];
  weekBookings: ExtendedBookings[];

  onBookingClick: (booking: ExtendedBooking) => void;
}

export const DesktopCalendar = ({
  specificStation = false,
  weekDates,
  weekBookings,
  onBookingClick,
}: DesktopCalendarProps) => {
  const getDescription = (type: EventType, booking: ExtendedBooking) => {
    if (specificStation) return type;
    else return `${type}@${booking.station.name}`;
  };

  return (
    <div className="hidden md:block">
      <div className="grid grid-cols-7 gap-0 border-b border-gray-200">
        {weekDates.map((date, index) => (
          <div
            key={index}
            className={`p-3 text-center border-r border-gray-200 last:border-r-0 ${
              isToday(date) ? "bg-blue-50" : "bg-gray-50"
            }`}
          >
            <h3 className={`font-semibold text-sm ${isToday(date) ? "text-blue-900" : "text-gray-900"}`}>
              {formatDate(date)}
            </h3>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0 min-h-96">
        {weekDates.map((date, index) => {
          const dayBookings = weekBookings[index] || [];
          return (
            <div key={index} className="border-r border-gray-200 last:border-r-0 p-3 md:p-1">
              <div className="space-y-2">
                {dayBookings.length === 0 ? (
                  <p className="text-gray-400 text-xs italic">No bookings</p>
                ) : (
                  dayBookings.map((booking) => {
                    const { type, date: bookingDate } = getBookingInfo(date, booking);
                    return (
                      <div
                        key={booking.id}
                        className={`booking-line pl-3 md:pl-1 pr-3 md:pr-1 pt-1 pb-1 rounded-lg ${getEventTypeStyle(
                          type
                        )}`}
                        onClick={() => onBookingClick(booking)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="flex flex-col justify-between items-start text-sm">
                          <div className="customer-name font-medium text-nowrap overflow-hidden text-ellipsis max-w-full">
                            {booking.customerName}
                          </div>
                          <div className="flex flex-row  items-baseline">
                            <div className="text-xs overflow-hidden text-ellipsis max-w-[50%] lg:max-w-[8vw] md:max-w-[7vw]">
                              {getDescription(type, booking)}
                            </div>

                            <div className="ml-1 opacity-75 font-medium">{getPrettyHour(bookingDate)}</div>
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
    </div>
  );
};
