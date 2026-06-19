"use client";

import { parseAsString, useQueryStates } from "nuqs";

export function useListQueryParams() {
  const [queryParams] = useQueryStates({
    type: parseAsString.withDefault(""),
    date: parseAsString.withDefault(""),
    region: parseAsString.withDefault(""),
    sortBy: parseAsString.withDefault("createdAt"),
    sortOrder: parseAsString.withDefault("desc"),
  });

  return {
    selectedCategory: queryParams.type,
    date: queryParams.date,
    region: queryParams.region,
    sortBy: queryParams.sortBy,
    sortOrder: queryParams.sortOrder,
  };
}
