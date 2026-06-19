const QUICK_START_ITEMS = [
  {
    step: 1,
    description: "다짐 타입을 먼저 설정하세요",
    buttonLabel: "다짐 타입 관리로 이동",
    href: "/admin/types",
  },
  {
    step: 2,
    description: "새로운 다짐을 생성하세요",
    buttonLabel: "다짐 만들기로 이동",
    href: "/admin/create",
  },
  {
    step: 3,
    description: "다짐을 관리하세요",
    buttonLabel: "다짐 리스트로 이동",
    href: "/admin/dagyms",
  },
];

export function useAdminDashboardViewModel() {
  return { quickStartItems: QUICK_START_ITEMS };
}
