import imgBusiness from "../assets/category-ex.png";
export { CENTER_INFO, CENTER_KEYS as centerLists } from "@/shared/constants/centers";

export const mockOptions = [
  { imgUrl: imgBusiness, name: "맨몸운동" },
  { imgUrl: imgBusiness, name: "기구운동" },
  { imgUrl: imgBusiness, name: "런닝" },
  { imgUrl: imgBusiness, name: "클라이밍" },
  { imgUrl: imgBusiness, name: "파워리프팅" },
  { imgUrl: imgBusiness, name: "기타" },
];

export const TOTAL_STEPS = 4;

export const DAGYM_STEP = {
  CATEGORY: 1,
  INFO: 2,
  DESCRIPTION: 3,
  DATE: 4,
} as const;

export const CAPACITY_MIN = 3;
export const CAPACITY_MAX = 20;
