import qs from "qs";

interface ListParams {
  type?: string;
  date?: string;
  region?: string;
  sortBy?: string;
  sortOrder?: string;
  size?: number;
  cursor?: unknown;
}

export function buildListParams({
  type,
  date,
  region,
  sortBy,
  sortOrder,
  size = 10,
  cursor,
}: ListParams): string {
  const dateStart = date
    ? new Date(`${date}T00:00:00+09:00`).toISOString()
    : undefined;
  const dateEnd = date
    ? new Date(`${date}T23:59:59.999+09:00`).toISOString()
    : undefined;

  return qs.stringify(
    {
      type: type || undefined,
      dateStart,
      dateEnd,
      region: region || undefined,
      sortBy,
      sortOrder,
      size,
      cursor: cursor || undefined,
    },
    { skipNulls: true }
  );
}
