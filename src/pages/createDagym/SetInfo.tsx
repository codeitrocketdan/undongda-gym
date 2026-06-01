import Input from "@/shared/ui/input/Input";
import InputField from "@/shared/ui/input/InputFiled";
import clsx from "clsx";
import { MapPin } from "lucide-react";
import Script from "next/script";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useKakaoPostcode } from "./hooks/useKaKaoPostcode";
import UploadImage from "./UploadImage";

export default function SetInfo() {
  const { register } = useFormContext();
  const { setValue, watch } = useFormContext();
  const [centerValue, setCenterValue] = useState("default");
  const [detailAddress, setDetailAddress] = useState("");
  const { isPostcodeOpen, postcodeContainerRef, handleScriptLoad, openPostcode, closePostcode } =
    useKakaoPostcode({
      onCompleteAddress: (fullAddress) => setValue("address", fullAddress),
    });
  const currentAddress = watch("address");
  console.log("🔥 Step2 실시간 입력값 상태:", currentAddress);
  // 임시 목 데이터
  const centerLists = ["강남", "판교", "마곡", "광교", "동탄", "성수", "용산"];

  return (
    <div>
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
          name="dagymCenter"
          value={centerValue}
          onChange={(e) => setCenterValue(e.target.value)}
          className={clsx(
            "w-full rounded-xl border border-transparent bg-gray-50 p-3 outline-none focus:border-blue-500",
            centerValue === "default" ? "text-gray-400" : "text-inherit"
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
      {centerValue === "address" && (
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
          <InputField label="상세주소" htmlFor="addressDetail">
            <Input
              type="text"
              id="addressDetail"
              placeholder="상세주소"
              value={detailAddress}
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
