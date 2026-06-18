import { CENTER_KEYS } from "@/shared/constants/centers";

export const BRANCH_OPTIONS = [
  { label: "전체", value: "" },
  ...CENTER_KEYS.map((key) => ({ label: `${key}점`, value: key })),
  { label: "지점 외 장소", value: "지점 외 장소" },
];
