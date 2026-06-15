import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export function useKakaoMap() {
  const { watch, setValue } = useFormContext();
  const address = watch("address");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!address || !isLoaded || !window.kakao?.maps) return;

    window.kakao.maps.load(() => {
      if (!window.kakao.maps.services?.Geocoder) return;

      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setValue("latitude", parseFloat(result[0].y));
          setValue("longitude", parseFloat(result[0].x));
        }
      });
    });
  }, [address, isLoaded, setValue]);

  return { onScriptLoad: () => setIsLoaded(true) };
}
