import { useRef, useState } from "react";

interface UseKakaoPostcodeProps {
  onCompleteAddress: (fullAddress: string) => void;
}

export function useKakaoPostcode({ onCompleteAddress }: UseKakaoPostcodeProps) {
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [address, setAddress] = useState("");
  const postcodeContainerRef = useRef(null);

  const handleScriptLoad = () => {};

  // 주소 검색 창 열기
  const openPostcode = () => {
    if (typeof window === "undefined" || !window.daum) {
      alert("주소 서비스가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setIsPostcodeOpen(true);

    // DOM이 업데이트된 후 embed를 실행하기 위한 setTimeout
    setTimeout(() => {
      if (!postcodeContainerRef.current) return;

      new window.daum.Postcode({
        oncomplete: function (data) {
          let fullAddress = data.address;
          let extraAddress = "";

          if (data.addressType === "R") {
            if (data.bname !== "") extraAddress += data.bname;
            if (data.buildingName !== "")
              extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
            fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
          }

          setAddress(fullAddress); // 선택된 주소 저장
          onCompleteAddress(fullAddress);
          setIsPostcodeOpen(false); // 창 닫기
        },
        width: "100%",
        height: "100%",
      }).embed(postcodeContainerRef.current);
    }, 0);
  };

  // 주소 검색 창 수동으로 닫기
  const closePostcode = () => setIsPostcodeOpen(false);

  // 컴포넌트에서 필요한 상태와 함수들을 리턴
  return {
    address,
    isPostcodeOpen,
    postcodeContainerRef,
    handleScriptLoad,
    openPostcode,
    closePostcode,
  };
}
