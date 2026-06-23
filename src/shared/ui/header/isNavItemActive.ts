// 메뉴 href와 다르지만 같은 메뉴로 취급해야 하는 하위/연관 경로
const ACTIVE_PREFIXES: Record<string, string[]> = {
  "/dagym": ["/dagym", "/dagym-detail"],
};

export function isNavItemActive(pathname: string, href: string) {
  const prefixes = ACTIVE_PREFIXES[href] ?? [href];
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
