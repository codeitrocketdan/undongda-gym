type ListFilters = {
  type?: string;
  date?: string;
  region?: string;
  sortBy?: string;
  sortOrder?: string;
};

export const meetingQueries = {
  all: ["meetings"] as const,
  list: (filters: ListFilters) => [...meetingQueries.all, filters] as const,
};

export const favoriteQueries = {
  all: ["favorites"] as const,
  list: (filters: ListFilters) => [...favoriteQueries.all, filters] as const,
};

export const userMeetingQueries = {
  all: ["users", "me", "meetings"] as const,
  joined: () => [...userMeetingQueries.all, "joined"] as const,
  created: () => [...userMeetingQueries.all, "created"] as const,
  writable: () => [...userMeetingQueries.all, "writable"] as const,
};

export const userReviewQueries = {
  all: ["users", "me", "reviews"] as const,
};

export const postQueries = {
  all: ["posts"] as const,
  list: (search: string, sort: string, page: number) =>
    [...postQueries.all, search, sort, page] as const,
  detail: (postId: string) => [...postQueries.all, postId] as const,
  hot: ["hot-posts"] as const,
};

export const reviewQueries = {
  all: ["reviews"] as const,
  list: (filters: ListFilters) => [...reviewQueries.all, filters] as const,
  stats: (type?: string) => ["review-stats", type] as const,
};
