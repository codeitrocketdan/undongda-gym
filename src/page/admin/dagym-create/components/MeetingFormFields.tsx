"use client";

import { MeetingTypeDTO } from "@/features/dagym/types";
import { DatePicker, TimePicker } from "@/shared/ui/datePicker";
import Input from "@/shared/ui/input/Input";
import InputField from "@/shared/ui/input/InputFiled";
import Textarea from "@/shared/ui/input/Textarea";

interface MeetingFormFieldsProps {
  types: MeetingTypeDTO[];
  centerKeys: string[];
  type: string;
  name: string;
  region: string;
  image: string;
  description: string;
  date?: Date;
  time: string;
  capacity: number;
  capacityMessage: string;
  setName: (value: string) => void;
  setRegion: (value: string) => void;
  setDescription: (value: string) => void;
  setDate: (value: Date | undefined) => void;
  setTime: (value: string) => void;
  setCapacity: (value: number) => void;
  handleTypeChange: (value: string) => void;
  handleImageChange: (value: string) => void;
  handleCapacityBlur: (value: number) => void;
}

export default function MeetingFormFields({
  types,
  centerKeys,
  type,
  name,
  region,
  image,
  description,
  date,
  time,
  capacity,
  capacityMessage,
  setName,
  setRegion,
  setDescription,
  setDate,
  setTime,
  setCapacity,
  handleTypeChange,
  handleImageChange,
  handleCapacityBlur,
}: MeetingFormFieldsProps) {
  return (
    <>
      <InputField label="타입 선택" htmlFor="meetingType">
        <select
          id="meetingType"
          value={type}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="w-full rounded-xl border border-transparent bg-gray-50 p-3 text-gray-800 outline-none focus:border-blue-500"
        >
          <option value="" disabled hidden>
            타입을 선택해주세요
          </option>
          {types.map((t) => (
            <option key={t.id} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
      </InputField>

      <InputField label="다짐 이름" htmlFor="meetingName">
        <Input
          type="text"
          id="meetingName"
          placeholder="각 운동 타입에 맞는 적절한 수업 타이틀을 지정해주세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </InputField>

      <InputField label="지점 선택" htmlFor="meetingRegion">
        <select
          id="meetingRegion"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full rounded-xl border border-transparent bg-gray-50 p-3 text-gray-800 outline-none focus:border-blue-500"
        >
          <option value="" disabled hidden>
            지점을 선택해주세요
          </option>
          {centerKeys.map((center) => (
            <option key={center} value={center}>
              {center}점
            </option>
          ))}
        </select>
      </InputField>

      <InputField label="이미지" htmlFor="meetingImage">
        <Input
          type="text"
          id="meetingImage"
          placeholder="타입 선택 시 대표 이미지가 자동으로 채워집니다"
          value={image}
          onChange={(e) => handleImageChange(e.target.value)}
        />
      </InputField>

      <InputField label="다짐 설명" htmlFor="meetingDescription">
        <Textarea
          id="meetingDescription"
          placeholder="다짐을 설명해주세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </InputField>

      <InputField label="다짐 일정" htmlFor="">
        <div className="flex flex-row items-end gap-4">
          <DatePicker value={date} onChange={setDate} />
          <TimePicker selectedDate={date} value={time} onChange={setTime} />
        </div>
      </InputField>

      <InputField
        label="모집 정원"
        htmlFor="meetingCapacity"
        error={capacityMessage}
      >
        <Input
          type="number"
          id="meetingCapacity"
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          onBlur={(e) => handleCapacityBlur(Number(e.target.value))}
        />
      </InputField>
    </>
  );
}
