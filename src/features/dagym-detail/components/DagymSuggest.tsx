"use client";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";

import { Grid, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const MOCK = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
}));

const DagymSuggest = () => {
  return (
    <section className="mb-20">
      <h2 className="text-2xl-semibold mb-5">이런 모임은 어때요?</h2>

      <Swiper
        modules={[Navigation, Grid]}
        spaceBetween={20}
        breakpoints={{
          0: {
            slidesPerView: 2,
            grid: {
              rows: 2,
              fill: "row",
            },
          },
          640: {
            slidesPerView: 2.5,
          },

          768: {
            slidesPerView: 4,
          },
        }}
      >
        {MOCK.map((mock) => (
          <SwiperSlide key={mock.id}>
            <div className="flex h-40 items-center justify-center rounded-4xl bg-red-100">
              {mock.id}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default DagymSuggest;
