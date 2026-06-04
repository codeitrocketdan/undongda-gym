"use client";

import DatePicker from "@/shared/ui/datePicker/DatePicker";
import TimePicker from "@/shared/ui/datePicker/TimePicker";
import { toISOStringFromLocal } from "@/shared/ui/datePicker/utils";
import Input from "@/shared/ui/input/Input";
import InputField from "@/shared/ui/input/InputFiled";
import { subDays } from "date-fns";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function SetDate() {
  const { register, setValue } = useFormContext();

  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");

  // react-hook-form으로 dateTime에 넣어주는 코드
  useEffect(() => {
    if (!date || isNaN(date.getTime())) {
      return;
    }
    const formattedDateTime = toISOStringFromLocal(date, time);
    const formattedRegistrationEnd = toISOStringFromLocal(subDays(date, 1), "23:59");

    setValue("dateTime", formattedDateTime);
    setValue("registrationEnd", formattedRegistrationEnd);
  }, [date, time, setValue]);

  return (
    <div className="set-date">
      <InputField label="다짐 일정" htmlFor="">
        <div className="mb-5 flex flex-row items-end gap-4">
          <DatePicker onChange={setDate} value={date} />
          <TimePicker selectedDate={date} onChange={setTime} value={time} />
        </div>
      </InputField>

      <InputField label="모집 정원" htmlFor="capacity">
        <Input
          type="number"
          id="capacity"
          placeholder="숫자만 입력해주세요."
          {...register("capacity", { valueAsNumber: true })}
        />
      </InputField>
      {/* <button onClick={handleSubmit}>[콘솔에 찍어보기]</button> */}
    </div>
  );
}
