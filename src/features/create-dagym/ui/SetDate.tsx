"use client";

import {
  DatePicker,
  TimePicker,
  toISOStringFromLocal,
} from "@/shared/ui/datePicker";
import Input from "@/shared/ui/input/Input";
import InputField from "@/shared/ui/input/InputFiled";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { calculateRegistrationEnd } from "@/shared/lib/calculateRegistrationEnd";
import { CAPACITY_MAX, CAPACITY_MIN } from "../constants";

export default function SetDate() {
  const { register, setValue } = useFormContext();

  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [capacityMessage, setCapacityMessage] = useState("");

  const handleCapacityBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (value < CAPACITY_MIN) {
      setValue("capacity", CAPACITY_MIN);
      setCapacityMessage(
        `모집 정원은 최소 ${CAPACITY_MIN}명 부터 설정 가능합니다.`
      );
    } else if (value > CAPACITY_MAX) {
      setValue("capacity", CAPACITY_MAX);
      setCapacityMessage(
        `모집 정원은 최대 ${CAPACITY_MAX}명까지 설정 가능합니다.`
      );
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
    if (!formattedDateTime) return;

    const formattedRegistrationEnd = calculateRegistrationEnd(formattedDateTime);

    setValue("dateTime", formattedDateTime);
    setValue("registrationEnd", formattedRegistrationEnd);
  }, [date, time, setValue]);

  return (
    <div className="set-date">
      <InputField label="다짐 일정" htmlFor="">
        <p className="-mt-1 mb-1 ml-1 text-xs text-gray-500">
          - 당일 다짐 생성은 3시간 뒤부터 진행 가능합니다.
          <br />- 참여 모집은 다짐 시작 2시간 전에 자동 마감됩니다.
        </p>
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
          min={CAPACITY_MIN}
          max={CAPACITY_MAX}
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
