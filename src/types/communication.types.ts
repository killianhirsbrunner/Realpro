// Communication Types - Shared type definitions for messaging/notifications module

/**
 * Message type enum
 */
export type MessageType =
  | 'TEXT'
  | 'FILE'
  | 'SYSTEM'
  | 'NOTIFICATION';

/**
 * Thread type enum
 */
export type ThreadType =
  | 'DIRECT'
  | 'PROJECT'
  | 'LOT'
  | 'SUPPORT'
  | 'ANNOUNCEMENT';

/**
 * Notification type enum
 */
export type NotificationType =
  | 'INFO'
  | 'WARNING'
  | 'SUCCESS'
  | 'ERROR'
  | 'REMINDER'
  | 'TASK'
  | 'MESSAGE';

/**
 * Message thread
 */
export interface MessageThread {
  id: string;
  project_id?: string;
  lot_id?: string;
  type: ThreadType;
  title: string;
  participants: ThreadParticipant[];
  last_message?: Message;
  unread_count: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Thread participant
 */
export interface ThreadParticipant {
  id: string;
  user_id: string;
  thread_id: string;
  user_name: string;
  user_email: string;
  avatar_url?: string;
  role: string;
  last_read_at?: string;
  is_muted: boolean;
}

/**
 * Message
 */
export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  type: MessageType;
  attachments: MessageAttachment[];
  is_read: boolean;
  read_by: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Message attachment
 */
export interface MessageAttachment {
  id: string;
  message_id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

/**
 * Notification
 */
export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  email_enabled: boolean;
  push_enabled: boolean;
  sms_enabled: boolean;
  categories: {
    messages: boolean;
    tasks: boolean;
    deadlines: boolean;
    payments: boolean;
    documents: boolean;
    system: boolean;
  };
  quiet_hours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

/**
 * Announcement
 */
export interface Announcement {
  id: string;
  project_id?: string;
  organization_id?: string;
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  target_audience: 'all' | 'team' | 'buyers' | 'specific';
  target_users?: string[];
  published_at?: string;
  expires_at?: string;
  created_by: string;
  created_at: string;
}

/**
 * Email template
 */
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'notification' | 'reminder' | 'welcome' | 'invoice' | 'custom';
  variables: string[];
  is_active: boolean;
}

/**
 * Messages summary
 */
export interface MessagesSummary {
  total_threads: number;
  unread_threads: number;
  unread_messages: number;
  recent_threads: MessageThread[];
}

/**
 * Notifications summary
 */
export interface NotificationsSummary {
  total: number;
  unread: number;
  by_type: Record<NotificationType, number>;
  recent: Notification[];
}

/**
 * UseMessages hook return type
 */
export interface UseMessagesReturn {
  threads: MessageThread[];
  loading: boolean;
  error: string | null;
  sendMessage: (threadId: string, content: string, attachments?: File[]) => Promise<void>;
  createThread: (type: ThreadType, title: string, participants: string[]) => Promise<string>;
  markAsRead: (threadId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * UseNotifications hook return type
 */
export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * UseChat hook return type (real-time)
 */
export interface UseChatReturn {
  messages: Message[];
  isConnected: boolean;
  isTyping: boolean;
  sendMessage: (content: string) => void;
  setTyping: (typing: boolean) => void;
}
