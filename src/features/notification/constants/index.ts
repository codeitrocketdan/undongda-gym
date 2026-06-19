export const NOTIFICATION_QUERY_KEYS = {
  all: ["notifications"] as const,
  unreadCount: ["notifications", "unread-count"] as const,
  postComments: (postId: number) => ["posts", String(postId), "comments"] as const,
};

export const UNREAD_COUNT_POLLING_INTERVAL = 60_000;
