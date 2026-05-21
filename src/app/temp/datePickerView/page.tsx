"use client";
import CalendarPicker from "@/shared/ui/DatePicker/CalendarPicker";
import TimePicker from "@/shared/ui/DatePicker/TimePicker";
import { useState } from "react";

const DatePickerView = () => {
  // 달력과 시간을 연동해서 사용할 때
  // DatePicker와 TimePicker가 같은 날짜 상태를 공유해야 하므로
  // 부모 컴포넌트에서 상태를 관리한다.
  const [date, setDate] = useState<Date>();
  return (
    <div>
      {/* 달력과 시간을 연동해서 사용할 때 */}
      <div>
        <CalendarPicker
          label="달력과 시간 연동 사용 *"
          onChange={setDate}
          value={date}
        />
        <TimePicker selectedDate={date} />
      </div>
      <br />
      {/* 달력 컴포넌트만 단독으로 사용할 때 */}
      <CalendarPicker label="단독 사용 *" />
      <br />
      {/* 시간 컴포넌트만 단독으로 사용할 때 */}
      <TimePicker selectedDate={date} />
    </div>
  );
};
export default DatePickerView;
