// Message-related types for the ChatScreen module

export interface Message {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  timestamp: string;
  status: MessageStatus;
  type: MessageType;
  metadata?: MessageMetadata;
  replyTo?: string; // ID of the message being replied to
  editedAt?: string;
  deletedAt?: string;
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export type MessageType = 'text' | 'image' | 'location' | 'document' | 'audio' | 'video' | 'sticker';

export interface MessageMetadata {
  imageUrl?: string;
  fileSize?: number;
  fileName?: string;
  mimeType?: string;
  duration?: number; // for audio/video
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  thumbnailUrl?: string; // for video/image preview
}

export interface MessageGroup {
  senderId: string;
  messages: Message[];
  timestamp: string;
  isConsecutive: boolean; // messages sent in quick succession
}

export interface MessageInputState {
  text: string;
  isTyping: boolean;
  showAttachments: boolean;
  replyTo?: Message;
  editingMessage?: Message;
}

export interface MessageActions {
  onSendMessage: (content: string, type?: MessageType, metadata?: MessageMetadata) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReplyToMessage: (message: Message) => void;
  onRetryMessage: (messageId: string) => void;
  onCopyMessage: (content: string) => void;
  onShareMessage: (message: Message) => void;
}

export interface MessageProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  showTimestamp: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  onReply?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface MessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onAttach: () => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  replyTo?: Message;
  editingMessage?: Message;
  onCancelReply?: () => void;
  onCancelEdit?: () => void;
}

export interface AttachmentMenuProps {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
  onDocument: () => void;
  onLocation: () => void;
  onAudio?: () => void;
  onVideo?: () => void;
}

export interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showTimestamp: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}

export interface MessageStatusProps {
  status: MessageStatus;
  timestamp: string;
  isOwn: boolean;
}
