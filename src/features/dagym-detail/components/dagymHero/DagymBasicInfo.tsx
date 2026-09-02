"use client";

import clsx from "clsx";
import { MapPin } from "lucide-react";
import Script from "next/script";
import { useFormContext } from "react-hook-form";
import { CENTER_INFO } from "@/shared/constants/centers";
import Input from "@/shared/ui/input/Input";
import InputField from "@/shared/ui/input/InputFiled";
import { useKakaoPostcodePopup } from "../../lib/useKakaoPostcodePopup";
import UploadImage from "./UploadImage";

const centerLists = ["강남", "판교", "마곡", "광교", "동탄", "성수", "용산"];

export default function DagymBasicInfo() {
  const { register, setValue, watch } = useFormContext();

  const region = watch("region");

  const { isPostcodeOpen, postcodeContainerRef, openPostcode, closePostcode } =
    useKakaoPostcodePopup({
      onCompleteAddress: ({ address, latitude, longitude }) => {
        setValue("address", address, { shouldDirty: true });
        setValue("latitude", latitude, { shouldDirty: true });
        setValue("longitude", longitude, { shouldDirty: true });
      },
    });

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setValue("region", value, { shouldDirty: true });
    setValue("addressDetail", "", { shouldDirty: true });

    const center = CENTER_INFO[value];

    if (center) {
      setValue("address", center.address, { shouldDirty: true });
      setValue("latitude", center.latitude, { shouldDirty: true });
      setValue("longitude", center.longitude, { shouldDirty: true });
    } else {
      setValue("address", "", { shouldDirty: true });
      setValue("latitude", null, { shouldDirty: true });
      setValue("longitude", null, { shouldDirty: true });
    }
  };

  return (
    <>
      <Script
        src="//t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="lazyOnload"
      />
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_JS_KEY}&libraries=services&autoload=false`}
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
          value={region || "default"}
          onChange={handleRegionChange}
          className={clsx(
            "w-full rounded-xl border bg-gray-50 p-3 outline-none focus:border-blue-500",
            region === "default" ? "text-gray-400" : "text-inherit"
          )}
        >
          <option hidden value="default">
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

      {region === "지점 외 장소" && (
        <>
          <InputField label="주소" htmlFor="address">
            <div className="relative">
              <Input
                id="address"
                onClick={openPostcode}
                readOnly
                {...register("address")}
              />
              <MapPin className="absolute top-1/2 right-3 -translate-y-1/2" />
            </div>
          </InputField>

          <InputField label="상세주소" htmlFor="addressDetail">
            <Input id="addressDetail" {...register("addressDetail")} />
          </InputField>
        </>
      )}

      {isPostcodeOpen && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white">
          <div className="flex justify-between border-b p-4">
            <span>주소 검색</span>
            <button type="button" onClick={closePostcode}>
              닫기
            </button>
          </div>

          <div ref={postcodeContainerRef} className="flex-1" />
        </div>
      )}

      <InputField label="이미지" htmlFor="dagymImage">
        <UploadImage />
      </InputField>
    </>
  );
}
