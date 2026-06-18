"use client";

import { useFormContext } from "react-hook-form";

import Input from "@/shared/ui/input/Input";
import InputField from "@/shared/ui/input/InputFiled";

import {
  DatePicker,
  TimePicker,
  toISOStringFromLocal,
} from "@/shared/ui/datePicker";

import { subDays } from "@/shared/lib/date";

export default function DagymScheduleInfo() {
  const { register, setValue, watch } = useFormContext();

  const dateTime = watch("dateTime");

  const date = dateTime ? new Date(dateTime) : undefined;

  const time = dateTime
    ? `${String(new Date(dateTime).getHours()).padStart(2, "0")}:${String(
        new Date(dateTime).getMinutes()
      ).padStart(2, "0")}`
    : "";

  const handleDateChange = (newDate?: Date) => {
    if (!newDate) return;

    const currentTime = time || "00:00";

    const newDateTime = toISOStringFromLocal(newDate, currentTime);

    setValue("dateTime", newDateTime);

    setValue(
      "registrationEnd",
      toISOStringFromLocal(subDays(newDate, 1), "23:59")
    );
  };

  const handleTimeChange = (newTime: string) => {
    if (!date) return;

    const newDateTime = toISOStringFromLocal(date, newTime);

    setValue("dateTime", newDateTime);
  };

  return (
    <>
      <InputField label="다짐 일정" htmlFor="">
        <div className="mb-5 flex items-end gap-4">
          <DatePicker value={date} onChange={handleDateChange} />

          <TimePicker
            value={time}
            selectedDate={date}
            onChange={handleTimeChange}
          />
        </div>
      </InputField>

      <InputField label="모집 정원" htmlFor="capacity">
        <Input
          type="number"
          id="capacity"
          min="3"
          max="20"
          placeholder="숫자만 입력해주세요."
          {...register("capacity", {
            valueAsNumber: true,
          })}
        />
      </InputField>
    </>
  );
}
