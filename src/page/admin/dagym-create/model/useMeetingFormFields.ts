"use client";

import { CAPACITY_MAX, CAPACITY_MIN } from "@/features/create-dagym/constants";
import { useMeetingTypes } from "@/features/dagym/model/useMeetingTypes";
import { CENTER_INFO, CENTER_KEYS } from "@/shared/constants/centers";
import { subDays } from "@/shared/lib/date";
import { parseMeetingTypeDescription } from "@/shared/lib/meetingTypeDescription";
import { toISOStringFromLocal } from "@/shared/ui/datePicker";
import { useState } from "react";

const CAPACITY_DEFAULT = CAPACITY_MAX;

export interface MeetingFormPayload {
  type: string;
  name: string;
  region: string;
  address: string | null;
  latitude: number;
  longitude: number;
  image: string;
  description: string;
  dateTime: string;
  registrationEnd: string;
  capacity: number;
}

export interface MeetingFormInitialValues {
  type: string;
  name: string;
  region: string;
  image: string;
  description: string;
  date?: Date;
  time: string;
  capacity: number;
}

// 다짐 만들기 / 다짐 수정에서 공통으로 쓰는 폼 상태와 검증 로직
export function useMeetingFormFields(initial?: MeetingFormInitialValues) {
  const [type, setType] = useState(initial?.type ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [region, setRegion] = useState(initial?.region ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [isImageEdited, setIsImageEdited] = useState(!!initial?.image);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [date, setDate] = useState<Date | undefined>(initial?.date);
  const [time, setTime] = useState(initial?.time ?? "");
  const [capacity, setCapacity] = useState(initial?.capacity ?? CAPACITY_DEFAULT);
  const [capacityMessage, setCapacityMessage] = useState("");

  const { data: allTypes = [] } = useMeetingTypes();
  // community 타입은 유저가 직접 작성하는 다짐이므로 관리자 생성 폼에서는 제외
  const types = allTypes.filter(
    (t) => parseMeetingTypeDescription(t.description).category === "regular"
  );

  const handleTypeChange = (value: string) => {
    setType(value);
    if (!isImageEdited) {
      // /admin/types에서 등록한 실제 이미지가 있으면 그걸 사용함
      const matchedType = types.find((t) => t.name === value);
      const registeredImage = matchedType
        ? parseMeetingTypeDescription(matchedType.description).imageUrl
        : "";
      setImage(registeredImage || "");
    }
  };

  const handleImageChange = (value: string) => {
    setIsImageEdited(true);
    setImage(value);
  };

  const handleCapacityBlur = (value: number) => {
    if (value < CAPACITY_MIN) {
      setCapacity(CAPACITY_MIN);
      setCapacityMessage(`모집 정원은 최소 ${CAPACITY_MIN}명 부터 설정 가능합니다.`);
    } else if (value > CAPACITY_MAX) {
      setCapacity(CAPACITY_MAX);
      setCapacityMessage(`모집 정원은 최대 ${CAPACITY_MAX}명까지 설정 가능합니다.`);
    } else {
      setCapacity(value);
      setCapacityMessage("");
    }
  };

  const isValid =
    !!type &&
    !!name.trim() &&
    !!region &&
    !!image.trim() &&
    !!description.trim() &&
    !!date &&
    !!time &&
    capacity >= CAPACITY_MIN &&
    capacity <= CAPACITY_MAX;

  const buildPayload = (): MeetingFormPayload | null => {
    if (!isValid || !date) return null;

    const center = CENTER_INFO[region];

    return {
      type,
      name: name.trim(),
      region,
      address: center?.address ?? null,
      latitude: center?.latitude ?? 37.4979,
      longitude: center?.longitude ?? 127.0276,
      image: image.trim(),
      description: description.trim(),
      dateTime: toISOStringFromLocal(date, time),
      registrationEnd: toISOStringFromLocal(subDays(date, 1), "23:59"),
      capacity,
    };
  };

  return {
    types,
    centerKeys: CENTER_KEYS,
    type,
    name,
    region,
    image,
    description,
    date,
    time,
    capacity,
    capacityMessage,
    isValid,
    setName,
    setRegion,
    setDescription,
    setDate,
    setTime,
    setCapacity,
    handleTypeChange,
    handleImageChange,
    handleCapacityBlur,
    buildPayload,
  };
}
