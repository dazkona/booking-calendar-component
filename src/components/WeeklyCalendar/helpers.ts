import {
  type Booking,
  type ExtendedBooking,
  type Station,
  type Stations,
  type EventType,
  EventTypes,
} from "../../types/types";

//-------------------------------------------------------------------
export const getWeekDates = (week: number, year: number) => {
  // Create a date for January 1st of the given year
  const firstDayOfYear = new Date(year, 0, 1);

  // Calculate the date of the first Monday of the year
  // If Jan 1 is Sunday (0), we add 1 day to get Monday
  // If Jan 1 is Monday (1), we don't need to add
  // Otherwise, we need to go to next Monday
  const firstMonday = new Date(firstDayOfYear);
  firstMonday.setDate(
    firstDayOfYear.getDate() + (firstDayOfYear.getDay() === 0 ? 1 : (8 - firstDayOfYear.getDay()) % 7)
  );

  // Calculate the start date of the desired week (Monday)
  const weekStartDate = new Date(firstMonday);
  weekStartDate.setDate(firstMonday.getDate() + week * 7);

  // Create an array for all 7 days of the week
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStartDate);
    date.setDate(weekStartDate.getDate() + i);
    weekDates.push(date);
  }

  return weekDates;
};

//-------------------------------------------------------------------
export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

//-------------------------------------------------------------------
export const getWeekRange = (weekDates: Date[]) => {
  if (weekDates.length === 0) return "";
  const start = weekDates[0];
  const end = weekDates[6];
  return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
};

//-------------------------------------------------------------------
export const isToday = (date: Date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

//-------------------------------------------------------------------
export const getCurrentYear = () => {
  const today = new Date();
  return today.getFullYear();
};

//-------------------------------------------------------------------
export const getCurrentWeek = () => {
  const today = new Date();
  const year = today.getFullYear();

  // January 1st of current year
  const firstDayOfYear = new Date(year, 0, 1);

  // Calculate days offset to first Monday
  // 0 = Sunday, 1 = Monday, etc.
  const firstDayOfWeek = firstDayOfYear.getDay();
  const daysToFirstMonday = firstDayOfWeek === 0 ? 1 : (8 - firstDayOfWeek) % 7;

  // First Monday of the year
  const firstMonday = new Date(firstDayOfYear);
  firstMonday.setDate(firstDayOfYear.getDate() + daysToFirstMonday);

  // If today is before first Monday, it's week 0
  if (today < firstMonday) {
    return 0;
  }

  // Calculate difference in days
  const diffInTime = today.getTime() - firstMonday.getTime();
  const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

  // Calculate week number (0-based)
  const weekNumber = Math.floor(diffInDays / 7);

  // Ensure week number doesn't exceed 52
  return Math.min(weekNumber, 52);
};

// d1 comes as ISO
//-------------------------------------------------------------------
export const sameDate = (d1: string, d2: Date): boolean => {
  // Truncate both dates to midnight (00:00:00)
  const date1 = new Date(d1.split("T")[0]);
  date1.setHours(0, 0, 0, 0);
  const date2 = new Date(d2);
  date2.setHours(0, 0, 0, 0);

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() == date2.getDate()
  );
};

//-------------------------------------------------------------------
export const convertToExtendedBooking = (booking: Booking, station: Station): ExtendedBooking => {
  return {
    ...booking,
    station: {
      id: station.id,
      name: station.name,
    },
  };
};

//-------------------------------------------------------------------
export const getPrettyHour = (dateISO: string | null) => {
  if (!dateISO) return "";
  const date = new Date(dateISO);
  const minutes = date.getMinutes();
  return `${date.getHours()}:${minutes < 10 ? "0" + minutes : minutes}`;
};

//-------------------------------------------------------------------
export const getBookingInfo = (date: Date, booking: Booking) => {
  if (sameDate(booking.startDate, date)) {
    return {
      type: EventTypes.pickup,
      date: booking.startDate,
    };
  } else if (sameDate(booking.endDate, date)) {
    return {
      type: EventTypes.return,
      date: booking.endDate,
    };
  }

  return {
    type: EventTypes.booking,
    date: null,
  };
};

//-------------------------------------------------------------------
export const getBookingsForDate = (date: Date, selectedStationId: string, stations: Stations) => {
  if (selectedStationId) {
    const station = stations.find((s) => s.id === selectedStationId);
    if (station) {
      const todayBookings = station.bookings.filter(
        (booking) => sameDate(booking.startDate, date) || sameDate(booking.endDate, date)
      );
      return todayBookings.map((tb) => convertToExtendedBooking(tb, station));
    }
  } else {
    let todayBookings: ExtendedBooking[] = [];
    stations.forEach((station) => {
      const _todayBookings = station.bookings.filter(
        (booking) => sameDate(booking.startDate, date) || sameDate(booking.endDate, date)
      );
      todayBookings = [...todayBookings, ..._todayBookings.map((tb) => convertToExtendedBooking(tb, station))];
    });
    return todayBookings;
  }

  return null;
};

//-------------------------------------------------------------------
export const getEventTypeStyle = (type: EventType): string => {
  const styles: any = {
    generic: "bg-blue-100 border-l-4 border-blue-500 text-blue-800",
    return: "bg-purple-100 border-l-4 border-purple-500 text-purple-800",
    pickup: "bg-green-100 border-l-4 border-green-500 text-green-800",
    booking: "bg-gray-100 border-l-4 border-gray-500 text-gray-800",
  };
  return styles[type] || styles.booking;
};

//-------------------------------------------------------------------
export const prettyDuration = (booking: Booking) => {
  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);
  const durationMs = end.getTime() - start.getTime();
  const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
  const durationHours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  let durationString = "";
  if (durationDays > 0) durationString += `${durationDays} day${durationDays > 1 ? "s" : ""} `;
  if (durationHours > 0) durationString += `${durationHours} hour${durationHours > 1 ? "s" : ""} `;
  if (durationMinutes > 0) durationString += `${durationMinutes} minute${durationMinutes > 1 ? "s" : ""}`;
  durationString = durationString.trim() || "< 1 minute";
  return durationString;
};
