
// Fix: Corrected import path for type definitions.
import type { UserProfile, Chat, Message, GroupProfile } from '../types/index';
// Fix: Corrected import path for type definitions.
import { MessageStatus } from '../types/index';

export const USER_INFO: UserProfile = {
    id: 'user-0',
    name: 'You',
    avatar: 'https://picsum.photos/seed/user/100/100',
};

export const AI_CONTACT_INFO: UserProfile = {
  id: 'contact-ai',
  name: 'Gemini Assistant',
  avatar: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d6ebb19973d8b15a5165.gif',
  status: 'Online',
}

export const MOCK_CONTACTS: UserProfile[] = [
    { id: 'contact-1', name: 'Alex Doe', avatar: 'https://picsum.photos/seed/contact/100/100', status: 'Online' },
    { id: 'contact-2', name: 'Samantha Smith', avatar: 'https://picsum.photos/seed/samantha/100/100', status: 'Last seen 2 hours ago' },
    { id: 'contact-3', name: 'John Appleseed', avatar: 'https://picsum.photos/seed/john/100/100', status: 'Typing...' },
    { id: 'contact-4', name: 'Emily Carter', avatar: 'https://picsum.photos/seed/emily/100/100', status: 'Online' },
];

const alexContact = MOCK_CONTACTS[0];
const samanthaContact = MOCK_CONTACTS[1];
const now = Date.now();

const initialMessagesAlex: Message[] = [
    {
      id: '1',
      text: 'Hello! How can I help you today? You can send me images or voice messages!',
      sender: alexContact,
      timestamp: now - 60000 * 5,
    },
];

const initialMessagesSamantha: Message[] = [
    {
      id: '2',
      text: 'Hey, did you get the files I sent yesterday?',
      sender: samanthaContact,
      timestamp: now - 60000 * 60 * 24 * 1.5, // 1.5 days ago
    },
    {
      id: '3',
      text: 'Yes, I got them. Thanks!',
      sender: USER_INFO,
      timestamp: now - 60000 * 60 * 24 * 1.4, // 1.4 days ago
      status: MessageStatus.Read,
      reaction: '👍',
    },
];

const groupInfo: GroupProfile = {
  id: 'group-1',
  name: 'Project Team',
  avatar: 'https://picsum.photos/seed/group/100/100',
  members: [USER_INFO, alexContact, samanthaContact, AI_CONTACT_INFO],
};

const initialMessagesGroup: Message[] = [
  {
    id: 'g-1',
    text: 'Hey everyone, welcome to the project group! The Gemini Assistant is also here to help us.',
    sender: USER_INFO,
    timestamp: now - 60000 * 20,
    status: MessageStatus.Read,
  },
  {
    id: 'g-2',
    text: "Great! Hi everyone. What's the first topic?",
    sender: alexContact,
    timestamp: now - 60000 * 19,
  },
   {
    id: 'g-3',
    text: "I can help with brainstorming, summarizing documents, and answering questions. Just ask!",
    sender: AI_CONTACT_INFO,
    timestamp: now - 60000 * 18,
  },
];


export const MOCK_CHATS: Chat[] = [
    { id: 'chat-1', contact: MOCK_CONTACTS[0], messages: initialMessagesAlex, lastActivity: now - 60000 * 5, unreadCount: 1 },
    { id: 'chat-2', contact: MOCK_CONTACTS[1], messages: initialMessagesSamantha, lastActivity: now - 60000 * 60 * 24 * 1.4, unreadCount: 0 },
    { id: 'chat-3', groupInfo, messages: initialMessagesGroup, lastActivity: now - 60000 * 18, unreadCount: 2 },
];
