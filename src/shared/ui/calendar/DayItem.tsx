import React from "react";

type DayItemProps = {
  day: {
    date: Date;
    dateKey: string;
    dayNumber: string;
  };

  isSelected: boolean;
  isDone: boolean;
  isReserved: boolean;

  onSelect: (date: Date) => void;
  pickerType: string;
};

function DayItem({
  day,
  isSelected,
  isDone,
  isReserved,
  onSelect,
  pickerType,
}: DayItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(day.date)}
      className={`group flex w-full flex-col items-center ${isDone || isReserved ? "cursor-pointer" : "cursor-default"}`}
      aria-label={day.dateKey}
      aria-pressed={isSelected}
    >
      <div
        className={`relative flex items-center justify-center p-2.5 transition-all`}
      >
        {isReserved && (
          <div
            className={`absolute h-1.5 w-1.5 rounded-full bg-blue-700 ${pickerType === "week" || isDone ? "top-0" : "top-1"}`}
          />
        )}
        <div
          className={`h-8 w-8 rounded-full p-1.5 text-center text-gray-600 ${
            isDone ? "bg-blue-500 font-bold text-white" : ""
          }`}
        >
          {day.dayNumber}
        </div>
      </div>
    </button>
  );
}

export default React.memo(DayItem);
