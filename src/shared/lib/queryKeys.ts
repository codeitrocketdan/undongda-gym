export const meetingQueries = {
  all: ["meetings"] as const,
  list: (filters: {
    type?: string;
    region?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => [...meetingQueries.all, filters] as const,
};

export const favoriteQueries = {
  all: ["favorites"] as const,
  list: (filters: {
    type?: string;
    region?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => [...favoriteQueries.all, filters] as const,
};

export const meetingTypeQueries = {
  all: ["meeting-types"] as const,
};

export const userMeetingQueries = {
  all: ["users", "me", "meetings"] as const,
  joined: () => [...userMeetingQueries.all, "joined"] as const,
  created: () => [...userMeetingQueries.all, "created"] as const,
  writable: () => [...userMeetingQueries.all, "writable"] as const,
};
