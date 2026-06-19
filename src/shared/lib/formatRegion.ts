export function formatRegion(region: string, address: string | null): string {
  if (region !== "지점 외 장소" || !address) return region;
  const [city = "", district = ""] = address.split(" ");
  const shortCity = city.replace(
    /(특별자치시|특별자치도|광역시|특별시|도)$/,
    ""
  );
  return district ? `${shortCity} ${district}` : shortCity;
}
