"use client";

import "swiper/css";
import "swiper/css/grid";

import { Grid } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useDagymSuggestQuery } from "../../api/useDagymSuggestQuery";

import { getRecommendedMeetings } from "../../lib/getRecommendedMeetings";
import { Dagym } from "../../model/types";
import SuggestItem from "./SuggestItem";

interface PropsType {
  meetingId: string;
  dagym: Dagym;
}

const DagymSuggest = ({ dagym, meetingId }: PropsType) => {
  const { data, isLoading, isError } = useDagymSuggestQuery();

  const meetings = getRecommendedMeetings(
    data?.data ?? [],
    meetingId,
    dagym.type
  );

  if (isLoading) {
    return (
      <div className="py-10 text-center text-slate-400">
        추천 다짐 불러오는 중...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-10 text-center text-red-400">
        추천 다짐을 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <section className="mb-20">
      <h2 className="text-2xl-semibold mb-5">이런 다짐은 어때요?</h2>

      <Swiper
        modules={[Grid]}
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
            grid: {
              rows: 1,
            },
          },
          768: {
            slidesPerView: 4,
            grid: {
              rows: 1,
            },
          },
        }}
      >
        {meetings.map((meeting) => (
          <SwiperSlide key={meeting.id}>
            <SuggestItem meeting={meeting} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default DagymSuggest;
