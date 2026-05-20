type DayItemProps = {
  day: {
    date: Date;
    dateKey: string;
    weekday: string;
    dayNumber: string;
  };

  isSelected: boolean;
  isDone: boolean;
  isReserved: boolean;

  onSelect: (date: Date) => void;
};

export default function DayItem({ day, isSelected, isDone, isReserved, onSelect }: DayItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(day.date)}
      className="group flex w-full flex-col items-center"
    >
      {/* 요일 */}
      <span
        className={`mb-3 text-[11px] font-semibold ${
          isSelected ? "text-gray-900" : "text-gray-400"
        }`}
      >
        {day.weekday}
      </span>

      {/* 날짜 */}
      <div
        className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all ${
          isDone ? "bg-green-500 font-bold text-white" : ""
        } ${!isDone && isSelected ? "bg-gray-100 font-bold text-black" : "text-gray-600"}`}
      >
        {day.dayNumber}

        {!isDone && isReserved && (
          <div className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-[#00A378]" />
        )}
      </div>
    </button>
  );
}
