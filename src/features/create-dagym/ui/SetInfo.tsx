import Input from "@/shared/ui/input/Input";
import InputField from "@/shared/ui/input/InputFiled";
import clsx from "clsx";
import { MapPin } from "lucide-react";
import Script from "next/script";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useKakaoPostcode } from "../lib/useKaKaoPostcode";
import UploadImage from "./UploadImage";

// 임시 목 데이터
const centerLists = ["강남", "판교", "마곡", "광교", "동탄", "성수", "용산"];
export default function SetInfo() {
  const { register, setValue, watch } = useFormContext();
  const currentCenter = watch("dagymCenter") || "default";
  const currentAddress = watch("address");
  const [detailAddress, setDetailAddress] = useState("");

  const { isPostcodeOpen, postcodeContainerRef, handleScriptLoad, openPostcode, closePostcode } =
    useKakaoPostcode({
      onCompleteAddress: (fullAddress) => setValue("address", fullAddress),
    });

  const handleCenterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setValue("dagymCenter", selected);

    if (selected === "address") {
      // '지점 외 장소'를 누르면 기존 주소값을 비워줌
      setValue("address", "지점 외 장소");
    } else {
      // 일반 지점("강남" 등)을 누르면 지점 이름을 address 값으로 설정
      setValue("address", `${selected}점`);
    }
  };
  console.log("currentAddress", currentAddress);
  return (
    <div className="set-info">
      {/* 주소 검색 */}
      <Script
        src="//t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />

      {/* 모임 이름 */}
      <InputField label="다짐 이름" htmlFor="dagymName">
        <Input
          type="text"
          id="dagymName"
          placeholder="다짐 이름을 입력해주세요"
          {...register("title")}
        ></Input>
      </InputField>

      {/* 모임 장소 */}
      {/* 지점 선택 */}
      <InputField label="지점을 선택하세요" htmlFor="dagymCenter">
        <select
          id="dagymCenter"
          //name="dagymCenter"
          value={currentCenter}
          //onChange={(e) => setCenterValue(e.target.value)}
          onChange={handleCenterChange}
          className={clsx(
            "w-full rounded-xl border border-transparent bg-gray-50 p-3 outline-none focus:border-blue-500",
            currentCenter === "default" ? "text-gray-400" : "text-inherit"
          )}
        >
          <option disabled hidden value="default">
            지점선택
          </option>
          {centerLists.map((item) => {
            return (
              <option key={item} value={item} className="text-gray-800">
                {item}점
              </option>
            );
          })}
          <option value="address" className="text-gray-800">
            지점 외 장소
          </option>
        </select>
      </InputField>

      {/* 주소 검색 */}
      {currentCenter === "address" && (
        <>
          <InputField label="주소" htmlFor="address">
            <div className="relative">
              <Input
                type="text"
                id="address"
                placeholder="건물, 지번 또는 도로명 검색"
                // value={address}
                value={currentAddress || ""}
                onClick={openPostcode}
                readOnly
              />
              <MapPin className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-800" />
            </div>
          </InputField>
          <InputField label="상세주소" htmlFor="addressDetail" required={false}>
            <Input
              type="text"
              id="addressDetail"
              placeholder="상세주소"
              onChange={(e) => setDetailAddress(e.target.value)}
            />
          </InputField>
        </>
      )}

      <InputField label="이미지" htmlFor="dagymImage">
        <UploadImage />
      </InputField>

      {/* 주소 검색 레이어 */}
      {isPostcodeOpen && (
        <div className="absolute inset-0 z-50 flex flex-col overflow-hidden rounded-2xl bg-white">
          <div className="flex items-center justify-between border-b p-4">
            <span className="font-semibold">주소 검색</span>
            <button onClick={closePostcode} className="text-gray-500">
              이전
            </button>
          </div>
          {/* 6. 카카오 UI가 주입될 Ref 연결 */}
          <div ref={postcodeContainerRef} className="w-full flex-1" />
        </div>
      )}
    </div>
  );
}
