
export enum MessageStatus {
  Sending,
  Sent,
  Delivered,
  Read,
  Error,
}

export type CallType = 'audio' | 'video';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  status?: string;
}

export interface GroupProfile {
  id: string;
  name: string;
  avatar: string;
  members: UserProfile[];
}

export interface Message {
  id:string;
  sender: UserProfile;
  text: string;
  timestamp: number;
  image?: string;
  audio?: string;
  status?: MessageStatus;
  reaction?: string;
  replyTo?: {
    messageId: string;
    author: string;
    text: string;
    image?: string;
    audio?: string;
  };
}

export interface ChatSummary {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageSender?: string;
  timestamp: number;
  unreadCount?: number;
}

export interface Chat {
  id: string;
  contact?: UserProfile;
  groupInfo?: GroupProfile;
  messages: Message[];
  lastActivity: number;
  unreadCount?: number;
}

// Types for the new Modal component
export interface ModalAction {
    label: string;
    action?: () => void;
    style: 'primary' | 'secondary' | 'danger';
}

export interface ModalContent {
    title: string;
    description: string;
    actions: ModalAction[];
}
