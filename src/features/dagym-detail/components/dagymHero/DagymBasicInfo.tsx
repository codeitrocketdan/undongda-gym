"use client";

import { CENTER_INFO } from "@/shared/constants/centers";
import Input from "@/shared/ui/input/Input";
import InputField from "@/shared/ui/input/InputFiled";
import clsx from "clsx";
import { MapPin } from "lucide-react";
import Script from "next/script";
import { useFormContext } from "react-hook-form";
import { useKakaoPostcodePopup } from "../../lib/useKakaoPostcodePopup";
import UploadImage from "./UploadImage";

const centerLists = ["강남", "판교", "마곡", "광교", "동탄", "성수", "용산"];

export default function DagymBasicInfo() {
  const { register, setValue, watch } = useFormContext();

  const currentRegion = watch("region") || "default";
  const currentAddress = watch("address");
  const { isPostcodeOpen, postcodeContainerRef, openPostcode, closePostcode } =
    useKakaoPostcodePopup({
      onCompleteAddress: ({ address, latitude, longitude }) => {
        setValue("address", address);
        setValue("latitude", latitude);
        setValue("longitude", longitude);
      },
    });

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value;
    setValue("region", region);
    setValue("addressDetail", "");

    const center = CENTER_INFO[region];
    if (center) {
      setValue("address", center.address);
      setValue("latitude", center.latitude);
      setValue("longitude", center.longitude);
    } else {
      setValue("address", "");
      setValue("latitude", undefined);
      setValue("longitude", undefined);
    }
  };

  return (
    <>
      <Script
        src="//t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="lazyOnload"
      />

      <InputField label="다짐 이름" htmlFor="dagymName">
        <Input
          id="dagymName"
          placeholder="다짐 이름을 입력해주세요"
          {...register("name")}
        />
      </InputField>

      <InputField label="지점을 선택하세요" htmlFor="dagymCenter">
        <select
          value={currentRegion}
          onChange={handleRegionChange}
          className={clsx(
            "w-full rounded-xl border border-transparent bg-gray-50 p-3 outline-none focus:border-blue-500",
            currentRegion === "default" ? "text-gray-400" : "text-inherit"
          )}
        >
          <option hidden disabled value="default">
            지점선택
          </option>

          {centerLists.map((item) => (
            <option key={item} value={item}>
              {item}점
            </option>
          ))}

          <option value="지점 외 장소">지점 외 장소</option>
        </select>
      </InputField>

      {currentRegion === "지점 외 장소" && (
        <>
          <InputField label="주소" htmlFor="address">
            <div className="relative">
              <Input
                id="address"
                value={currentAddress || ""}
                onClick={openPostcode}
                readOnly
                {...register("address")}
              />

              <MapPin className="absolute top-1/2 right-3 -translate-y-1/2" />
            </div>
          </InputField>

          <InputField label="상세주소" htmlFor="addressDetail" required={false}>
            <Input
              id="addressDetail"
              placeholder="상세주소"
              {...register("addressDetail")}
            />
          </InputField>
        </>
      )}

      {isPostcodeOpen && (
        <div className="absolute inset-0 z-50 flex flex-col overflow-hidden rounded-2xl bg-white">
          <div className="flex items-center justify-between border-b p-4">
            <span className="font-semibold">주소 검색</span>

            <button type="button" onClick={closePostcode}>
              이전
            </button>
          </div>

          <div ref={postcodeContainerRef} className="w-full flex-1" />
        </div>
      )}

      <InputField label="이미지" htmlFor="dagymImage">
        <UploadImage />
      </InputField>
    </>
  );
}
