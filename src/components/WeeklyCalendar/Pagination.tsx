import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCurrentWeek } from "./helpers";

interface PaginationProps {
  selectedWeek: number;
  setSelectedWeek: (selected: number) => void;
}

export const Pagination = ({ selectedWeek, setSelectedWeek }: PaginationProps) => {
  const currentWeek = getCurrentWeek();

  return (
    <div className="pagination-container flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <button
        onClick={() => setSelectedWeek(selectedWeek - 1)}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous Week</span>
        <span className="sm:hidden">Prev</span>
      </button>

      {selectedWeek !== currentWeek && (
        <div className="text-center">
          <button
            onClick={() => setSelectedWeek(currentWeek)}
            className={`px-4 py-2 rounded-lg transition-colors ${"bg-blue-500 text-white"}`}
          >
            Current Week
          </button>
        </div>
      )}

      <button
        onClick={() => setSelectedWeek(selectedWeek + 1)}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <span className="hidden sm:inline">Next Week</span>
        <span className="sm:hidden">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
