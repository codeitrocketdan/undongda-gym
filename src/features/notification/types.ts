type NotificationType =
  | "MEETING_CONFIRMED"
  | "MEETING_CANCELED"
  | "MEETING_DELETED"
  | "COMMENT";

interface NotificationData {
  meetingId?: number;
  meetingName?: string;
  postId?: number;
  postTitle?: string;
  commentId?: number;
  commentContent?: string;
  image?: string | null;
}

interface NotificationDTO {
  id: number;
  teamId: string;
  userId: number;
  type: NotificationType;
  message: string;
  data: NotificationData;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  data: NotificationDTO[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface UnreadCountResponse {
  count: number;
}

export interface EnrichedNotification extends NotificationDTO {
  actorName?: string;
  actorImage?: string | null;
}
