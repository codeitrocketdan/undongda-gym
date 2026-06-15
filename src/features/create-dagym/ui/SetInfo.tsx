import Input from "@/shared/ui/input/Input";
import InputField from "@/shared/ui/input/InputFiled";
import clsx from "clsx";
import { MapPin } from "lucide-react";
import Script from "next/script";
import { useFormContext } from "react-hook-form";
import { useKakaoMap } from "../lib/useKakaoMap";
import { useKakaoPostcode } from "../lib/useKaKaoPostcode";
import UploadImage from "./UploadImage";

// Todo: 임시 목 데이터 관리 방안 논의, 메인에 지역 필터링과 통일
const centerLists = ["강남", "판교", "마곡", "광교", "동탄", "성수", "용산"];

export default function SetInfo() {
  const { register, setValue, watch } = useFormContext();
  const currentRegion = watch("region") || "default";
  const currentAddress = watch("address");
  const debugLat = watch("latitude");
  const debugLng = watch("longitude");

  const { onScriptLoad } = useKakaoMap();

  const {
    isPostcodeOpen,
    postcodeContainerRef,
    handleScriptLoad,
    openPostcode,
    closePostcode,
  } = useKakaoPostcode({
    onCompleteAddress: (address) => setValue("address", address),
  });

  return (
    <div className="set-info">
      <Script
        src="//t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_JS_KEY}&libraries=services&autoload=false`}
        strategy="afterInteractive"
        onLoad={onScriptLoad}
      />

      <InputField label="다짐 이름" htmlFor="dagymName">
        <Input
          type="text"
          id="dagymName"
          placeholder="다짐 이름을 입력해주세요"
          {...register("name")}
        ></Input>
      </InputField>

      <InputField label="지점을 선택하세요" htmlFor="dagymCenter">
        <select
          id="dagymCenter"
          value={currentRegion}
          onChange={(e) => setValue("region", e.target.value)}
          className={clsx(
            "w-full rounded-xl border border-transparent bg-gray-50 p-3 outline-none focus:border-blue-500",
            currentRegion === "default" ? "text-gray-400" : "text-inherit"
          )}
        >
          <option disabled hidden value="default">
            지점선택
          </option>
          {centerLists.map((item) => (
            <option key={item} value={item} className="text-gray-800">
              {item}점
            </option>
          ))}
          <option value="지점 외 장소" className="text-gray-800">
            지점 외 장소
          </option>
        </select>
      </InputField>

      {currentRegion === "지점 외 장소" && (
        <>
          <InputField label="주소" htmlFor="address">
            <div className="relative">
              <Input
                type="text"
                id="address"
                placeholder="건물, 지번 또는 도로명 검색"
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
              {...register("addressDetail")}
            />
          </InputField>
        </>
      )}

      {/* TODO: 테스트용 — 확인 후 삭제 */}
      {process.env.NODE_ENV === "development" && (
        <div className="rounded bg-yellow-50 p-2 text-xs text-gray-500">
          lat: {String(debugLat)} / lng: {String(debugLng)}
        </div>
      )}

      <InputField label="이미지" htmlFor="dagymImage">
        <UploadImage />
      </InputField>

      {isPostcodeOpen && (
        <div className="absolute inset-0 z-50 flex flex-col overflow-hidden rounded-2xl bg-white">
          <div className="flex items-center justify-between border-b p-4">
            <span className="font-semibold">주소 검색</span>
            <button onClick={closePostcode} className="text-gray-500">
              이전
            </button>
          </div>
          <div ref={postcodeContainerRef} className="w-full flex-1" />
        </div>
      )}
    </div>
  );
}
