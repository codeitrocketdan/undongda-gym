import { useRef, useState } from "react";

interface AddressData {
  address: string;
  latitude: number;
  longitude: number;
}

interface UseKakaoPostcodeProps {
  onCompleteAddress: (data: AddressData) => void;
}

export function useKakaoPostcodePopup({
  onCompleteAddress,
}: UseKakaoPostcodeProps) {
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  const postcodeContainerRef = useRef<HTMLDivElement>(null);

  const closePostcode = () => {
    setIsPostcodeOpen(false);
  };

  const openPostcode = () => {
    if (!window.daum?.Postcode) {
      alert("주소 서비스를 불러오는 중입니다.");
      return;
    }

    setIsPostcodeOpen(true);

    requestAnimationFrame(() => {
      if (!postcodeContainerRef.current) return;

      new window.daum.Postcode({
        oncomplete: (data) => {
          let fullAddress = data.address;
          let extraAddress = "";

          if (data.addressType === "R") {
            if (data.bname) extraAddress += data.bname;

            if (data.buildingName) {
              extraAddress += extraAddress
                ? `, ${data.buildingName}`
                : data.buildingName;
            }

            if (extraAddress) {
              fullAddress += ` (${extraAddress})`;
            }
          }

          setIsPostcodeOpen(false);

          if (!window.kakao || !window.kakao.maps) {
            console.log("카카오 지도 SDK 자체를 찾을 수 없음");
            onCompleteAddress({
              address: fullAddress,
              latitude: 0,
              longitude: 0,
            });
            return;
          }

          window.kakao.maps.load(() => {
            if (!window.kakao.maps.services) {
              console.log(
                "설정 에러: Script 태그 url에 &libraries=services가 빠졌는지 확인하세요."
              );
              onCompleteAddress({
                address: fullAddress,
                latitude: 0,
                longitude: 0,
              });
              return;
            }

            const geocoder = new window.kakao.maps.services.Geocoder();

            geocoder.addressSearch(data.address, (result, status) => {
              if (
                status !== window.kakao.maps.services.Status.OK ||
                !result ||
                !result.length
              ) {
                onCompleteAddress({
                  address: fullAddress,
                  latitude: 0,
                  longitude: 0,
                });
                return;
              }

              onCompleteAddress({
                address: fullAddress,
                latitude: Number(result[0].y),
                longitude: Number(result[0].x),
              });
            });
          });
        },
        width: "100%",
        height: "100%",
      }).embed(postcodeContainerRef.current);
    });
  };

  return {
    isPostcodeOpen,
    postcodeContainerRef,
    openPostcode,
    closePostcode,
  };
}
