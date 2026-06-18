"use client";
import { useEffect, useRef } from "react";
import { Dagym } from "../../model/types";

interface Props {
  dagym: Dagym;
}

const DagymLocation = ({ dagym }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.kakao || !mapRef.current) return;

    window.kakao.maps.load(() => {
      const lat = dagym.latitude;
      const lng = dagym.longitude;

      if (lat == null || lng == null) return;

      const center = new window.kakao.maps.LatLng(lat, lng);

      const map = new window.kakao.maps.Map(mapRef.current!, {
        center,
        level: 2,
      });

      new window.kakao.maps.Marker({
        position: center,
        map,
      });
    });
  }, [dagym.latitude, dagym.longitude]);

  return (
    <section className="mb-20">
      <h2 className="text-2xl-semibold mb-5">모임 장소</h2>

      <div className="rounded-4xl border border-gray-200 bg-white px-4 py-3.5 sm:px-8 sm:py-5.5">
        <div className="-mx-4 -my-3.5 mb-3.5 overflow-hidden rounded-t-4xl sm:-mx-8 sm:-my-5.5 sm:mb-5.5">
          <div ref={mapRef} className="h-[280px] w-full" />
        </div>

        <p className="text-base-regular text-gray-700">{dagym.address}</p>
      </div>
    </section>
  );
};

export default DagymLocation;
