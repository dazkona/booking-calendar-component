import React, { useState } from "react";

interface WeekPickerProps {
  selectedWeek: number;
  selectedYear: number;

  onPickedWeekChange: (week: number, year: number) => void;
  onClosePicker: () => void;
}

export const WeekPicker = ({ selectedWeek, selectedYear, onPickedWeekChange, onClosePicker }: WeekPickerProps) => {
  const [year, setYear] = useState<number>(selectedYear);
  const [week, setWeek] = useState<number>(selectedWeek);
  const [closeTimer, setCloseTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Set initial values from props on mount or when props change
  //-------------------------------------------------------
  React.useEffect(() => {
    setYear(selectedYear);
    setWeek(selectedWeek);
  }, [selectedYear, selectedWeek]);

  //-------------------------------------------------------
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => setYear(Number(e.target.value));
  const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => setWeek(Number(e.target.value));

  //-------------------------------------------------------
  const handleGoToWeek = () => {
    if (typeof week === "number" && typeof year === "number") {
      onPickedWeekChange(week, year);
    }
  };

  //-------------------------------------------------------
  const handlePickerMouseLeave = () => {
    if (closeTimer) clearTimeout(closeTimer);
    setCloseTimer(setTimeout(() => onClosePicker(), 5000));
  };
  const handlePickerMouseEnter = () => {
    if (closeTimer) clearTimeout(closeTimer);
  };

  return (
    <div
      className="week-picker absolute z-20 right-0 mt-2"
      onMouseLeave={handlePickerMouseLeave}
      onMouseEnter={handlePickerMouseEnter}
    >
      <div
        className="z-10 mt-2 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 flex flex-col gap-2 min-w-[220px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-2 items-center">
          <label htmlFor="year" className="text-xs text-gray-700">
            Year:
          </label>
          <select
            id="year"
            defaultValue={year}
            onChange={handleYearChange}
            className="border rounded px-2 py-1 text-sm"
          >
            {Array.from({ length: 28 }, (_, i) => 2000 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <label htmlFor="week" className="text-xs text-gray-700 ml-2">
            Week:
          </label>
          <select
            id="week"
            defaultValue={week}
            onChange={handleWeekChange}
            className="border rounded px-2 py-1 text-sm"
          >
            {Array.from({ length: 53 }, (_, i) => i).map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleGoToWeek}
          className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
        >
          Go
        </button>
      </div>
    </div>
  );
};
