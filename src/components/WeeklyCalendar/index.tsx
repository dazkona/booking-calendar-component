import { useState, useEffect } from "react";
import { Calendar, Eraser } from "lucide-react";
import { getCurrentWeek, getWeekDates, getCurrentYear, getWeekRange, getBookingsForDate } from "./helpers";
import { DesktopCalendar } from "./DesktopCalendar";
import { MobileCalendar } from "./MobileCalendar";
import { WeekPicker } from "./WeekPicker";
import { Pagination } from "./Pagination";
import { useStations } from "../../hooks/useStations";
import type { ExtendedBooking, ExtendedBookings } from "../../types/types";
import { BookingDetail } from "./BookingDetail";
import { Autocomplete } from "../Autocomplete";

const WeeklyCalendar = () => {
  const [visibleWeek, setVisibleWeek] = useState<number>(getCurrentWeek());
  const [visibleYear, setVisibleYear] = useState<number>(getCurrentYear());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [weekBookings, setWeekBookings] = useState<ExtendedBookings[]>([]);
  const [showWeekPicker, setShowWeekPicker] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<ExtendedBooking | null>(null);

  const { stations } = useStations();

  //-------------------------------------------------------
  useEffect(() => {
    const _weekDates = getWeekDates(visibleWeek, visibleYear);
    setWeekDates(_weekDates);

    const weekDailyBookings = _weekDates.map((weekDate: Date) => {
      return getBookingsForDate(weekDate, selectedStationId, stations) || [];
    });

    setWeekBookings(weekDailyBookings);
  }, [visibleWeek, visibleYear]);

  //-------------------------------------------------------
  const toogleWeekPicker = () => setShowWeekPicker((prev) => !prev);
  const closeWeekPicker = () => setShowWeekPicker(false);
  const onPickedWeekChange = (week: number, year: number) => {
    setVisibleWeek(week);
    setVisibleYear(year);
    toogleWeekPicker();
  };

  //-------------------------------------------------------
  const handleBookingClick = (booking: ExtendedBooking) => setSelectedBooking(booking);
  const handleCloseBookingDetail = () => setSelectedBooking(null);

  //-------------------------------------------------------
  const cleanSelectedStation = () => setSelectedStationId("");
  const cleanSelectedBooking = () => setSelectedBooking(null);

  //-------------------------------------------------------
  const getStationName = (id: string) => {
    const station = stations.find((s) => s.id === id);
    if (station) return station.name;

    return "";
  };

  return (
    <div
      className="weekly-calendar-container 
	  	w-screen lg:w-w-9/12 lg:min-w-[1024px] lg:max-w-7xl
		md:min-h-screen min-h-screen md:min-h-full md:h-full
		mx-auto p-4 
		bg-gray-50 "
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Weekly Bookings
          </h1>
          <div
            className="week-range text-sm text-gray-600 font-medium ml-3 cursor-pointer relative inline-block bg-white border border-gray-300 rounded px-3 py-1 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
            onClick={() => {
              cleanSelectedBooking();
              toogleWeekPicker();
            }}
          >
            {getWeekRange(weekDates)}
            {showWeekPicker && (
              <WeekPicker
                selectedWeek={visibleWeek}
                selectedYear={visibleYear}
                onPickedWeekChange={onPickedWeekChange}
                onClosePicker={closeWeekPicker}
              />
            )}
          </div>
        </div>

        <div className="relative filter-container">
          {selectedStationId !== "" ? (
            <div className="text-xl font-medium text-gray-500 flex flex-row gap-1 items-baseline">
              <div>Bookings for </div>
              <div className="selected-station-container font-bold ml-1 mr-1 text-blue-600">
                {getStationName(selectedStationId)}
              </div>
              <Eraser
                className="icon-remove-selected-station w-4 h-4 hover:cursor-pointer text-red-300"
                aria-label="icon-remove-selected-station"
                onClick={() => {
                  cleanSelectedBooking();
                  cleanSelectedStation();
                }}
              />
            </div>
          ) : (
            <Autocomplete
              url={`${import.meta.env.VITE_API_URL}/stations`}
              onSelectValue={(id: string) => {
                cleanSelectedBooking();
                setSelectedStationId(id);
              }}
            />
          )}
        </div>
      </div>

      <div className="calendar-container bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        {selectedBooking ? (
          <BookingDetail booking={selectedBooking} onClose={handleCloseBookingDetail} />
        ) : (
          <>
            <MobileCalendar
              specificStation={selectedStationId !== ""}
              weekDates={weekDates}
              weekBookings={weekBookings}
              onBookingClick={handleBookingClick}
            />

            <DesktopCalendar
              specificStation={selectedStationId !== ""}
              weekDates={weekDates}
              weekBookings={weekBookings}
              onBookingClick={handleBookingClick}
            />
          </>
        )}
      </div>

      <Pagination
        selectedWeek={visibleWeek}
        setSelectedWeek={(selected: number) => {
          cleanSelectedBooking();
          setVisibleWeek(selected);
        }}
      />
    </div>
  );
};

export default WeeklyCalendar;
