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
  const [capacityMessage, setCapacityMessage] = useState("");

  const handleCapacityBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (value < 2) {
      setValue("capacity", 2);
      setCapacityMessage("모집 정원은 최소 3명 부터 설정 가능합니다.");
    } else if (value > 20) {
      setValue("capacity", 20);
      setCapacityMessage("모집 정원은 최대 20명까지 설정 가능합니다.");
    } else {
      setValue("capacity", value);
      setCapacityMessage("");
    }
  };

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

      <InputField label="모집 정원" htmlFor="capacity" error={capacityMessage}>
        <Input
          type="number"
          id="capacity"
          placeholder="숫자만 입력해주세요."
          min="2"
          max="20"
          {...register("capacity", {
            valueAsNumber: true,
            onBlur: handleCapacityBlur,
          })}
        />
      </InputField>
      {/* <button onClick={handleSubmit}>[콘솔에 찍어보기]</button> */}
    </div>
  );
}
