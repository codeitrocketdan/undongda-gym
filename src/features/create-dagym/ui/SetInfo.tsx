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
  const currentRegion = watch("region") || "default";
  const currentAddress = watch("address");
  const [isMapScriptLoaded, setIsMapScriptLoaded] = useState(false);

  const {
    isPostcodeOpen,
    postcodeContainerRef,
    handleScriptLoad,
    openPostcode,
    closePostcode,
  } = useKakaoPostcode({
    onCompleteAddress: (currentAddress) => {
      // 기존 react-hook-form(추정)에 주소 텍스트 저장
      setValue("address", currentAddress);

      // 위경도 임시 저장
      setValue("latitude", 37.4979);
      setValue("longitude", 127.0276);
      /*
        // 위경도 추가 작업 => 추후 승인 받으면 진행
        if (
          isMapScriptLoaded &&
          typeof window !== "undefined" &&
          window.kakao &&
          window.kakao.maps
        ) {
          window.kakao.maps.load(() => {
            const geocoder = new window.kakao.maps.services.Geocoder();

            // 받아온 주소로 위경도 검색
            geocoder.addressSearch(currentAddress, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const lat = parseFloat(result[0].y); // 위도
                const lng = parseFloat(result[0].x); // 경도

                console.log("🔥 [테스트 성공] 위경도 추출 완료!");
                console.log("위도(lat):", lat);
                console.log("경도(lng):", lng);

                setValue("latitude", lat);
                setValue("longitude", lng);
              } else {
                console.error("주소는 가져왔으나 카카오맵 위경도 변환에 실패했습니다.");
              }
            });
          });
        }*/
    },
  });

  const handleCenterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setValue("region", selected);
  };

  return (
    <div className="set-info">
      {/* 주소 검색 */}
      <Script
        src="//t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_JS_KEY}&libraries=services&autoload=false`}
        strategy="lazyOnload"
        onLoad={() => {
          setIsMapScriptLoaded(true);
        }}
      />

      {/* 모임 이름 */}
      <InputField label="다짐 이름" htmlFor="dagymName">
        <Input
          type="text"
          id="dagymName"
          placeholder="다짐 이름을 입력해주세요"
          {...register("name")}
        ></Input>
      </InputField>

      {/* 모임 장소 */}
      {/* 지점 선택 */}
      <InputField label="지점을 선택하세요" htmlFor="dagymCenter">
        <select
          id="dagymCenter"
          //name="dagymCenter"
          value={currentRegion}
          //onChange={(e) => setCenterValue(e.target.value)}
          onChange={handleCenterChange}
          className={clsx(
            "w-full rounded-xl border border-transparent bg-gray-50 p-3 outline-none focus:border-blue-500",
            currentRegion === "default" ? "text-gray-400" : "text-inherit"
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
          <option value="지점 외 장소" className="text-gray-800">
            지점 외 장소
          </option>
        </select>
      </InputField>

      {/* 주소 검색 */}
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
                {...register("address")}
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
          {/* 카카오 UI가 주입될 Ref 연결 */}
          <div ref={postcodeContainerRef} className="w-full flex-1" />
        </div>
      )}
    </div>
  );
}
