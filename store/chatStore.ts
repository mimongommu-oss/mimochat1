
import { create } from 'zustand';
import type { Chat, Message, UserProfile, GroupProfile } from '../types/index';
import { MessageStatus } from '../types/index';
import { MOCK_CHATS, MOCK_CONTACTS, USER_INFO, AI_CONTACT_INFO } from '../data/mock';
import * as api from '../api/client';
import { useUIStore } from './uiStore';

// Helper for more robust ID generation
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

interface ChatState {
  chats: Chat[];
  contacts: UserProfile[];
  userInfo: UserProfile;
  isLoading: boolean;
  isSuggesting: boolean;
  suggestions: string[] | null;
  initializeChat: (chatId: string) => void;
  sendMessage: (text: string, image: string | null, audio: string | null) => Promise<void>;
  startNewChat: (contact: UserProfile) => void;
  createGroup: (groupName: string, members: UserProfile[]) => void;
  deleteChat: (chatId: string) => void;
  updateMessageStatus: (chatId: string, messageId: string, status: MessageStatus) => void;
  updateMessageReaction: (chatId: string, messageId: string, reaction: string | null) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  setContactStatus: (contactId: string, status: string | undefined) => void;
  getSuggestions: (prompt: string) => Promise<void>;
  clearSuggestions: () => void;
  clearUnread: (chatId: string) => void;
  reset: () => void;
}

const initialState = {
  chats: MOCK_CHATS,
  contacts: MOCK_CONTACTS,
  userInfo: USER_INFO,
  isLoading: false,
  isSuggesting: false,
  suggestions: null,
};

export const useChatStore = create<ChatState>((set, get) => ({
  ...initialState,

  initializeChat: (chatId: string) => {
    // In a real backend, this would fetch chat history or confirm access.
    // The API handler will manage the chat instance state.
  },

  sendMessage: async (text, image, audio) => {
    const { activeChatId, replyingTo, cancelReply } = useUIStore.getState();
    if (!activeChatId) return;

    set({ isLoading: true, suggestions: null });
    
    const chat = get().chats.find(c => c.id === activeChatId);
    if (!chat) {
        set({isLoading: false});
        return;
    }
    const typingContact = chat.contact || AI_CONTACT_INFO;
    get().setContactStatus(typingContact.id, 'Typing...');

    const newUserMessage: Message = {
      id: generateId('msg'),
      sender: get().userInfo,
      text,
      timestamp: Date.now(),
      image: image ?? undefined,
      audio: audio ?? undefined,
      status: MessageStatus.Sending,
      replyTo: replyingTo ? {
        messageId: replyingTo.id,
        author: replyingTo.sender.name,
        text: replyingTo.text,
        image: replyingTo.image,
        audio: replyingTo.audio,
      } : undefined,
    };
    
    set(state => ({
      chats: state.chats.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, newUserMessage], lastActivity: Date.now() } : c)
    }));
    cancelReply();

    get().updateMessageStatus(activeChatId, newUserMessage.id, MessageStatus.Sent);
    setTimeout(() => get().updateMessageStatus(activeChatId, newUserMessage.id, MessageStatus.Delivered), 1000);

    try {
      const responseStream = await api.streamAiResponse({
        chat,
        text,
        image,
        audio,
      });

      let responseId = generateId('ai-msg');
      let isFirstChunk = true;
      let fullResponse = "";

      for await (const chunk of responseStream) {
        if (isFirstChunk) {
          get().updateMessageStatus(activeChatId, newUserMessage.id, MessageStatus.Read);
          isFirstChunk = false;
        }
        fullResponse += chunk;
        set(state => ({
          chats: state.chats.map(c => {
            if (c.id === activeChatId) {
              const messageExists = c.messages.some(msg => msg.id === responseId);
              if (messageExists) {
                return { ...c, messages: c.messages.map(msg => msg.id === responseId ? { ...msg, text: fullResponse } : msg) };
              } else {
                return { ...c, messages: [...c.messages, {
                  id: responseId,
                  sender: typingContact, // Use the correct contact for the response
                  text: fullResponse,
                  timestamp: Date.now(),
                }], lastActivity: Date.now() };
              }
            }
            return c;
          })
        }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Set the user's message status to Error for clear feedback
      get().updateMessageStatus(activeChatId, newUserMessage.id, MessageStatus.Error);
    } finally {
      set({ isLoading: false });
      const originalStatus = MOCK_CONTACTS.find(c => c.id === typingContact.id)?.status || "Online";
      get().setContactStatus(typingContact.id, originalStatus);
    }
  },

  startNewChat: (contact) => {
    const { chats } = get();
    const existingChat = chats.find(chat => chat.contact && chat.contact.id === contact.id);
    if (existingChat) {
      useUIStore.getState().setActiveChat(existingChat.id);
    } else {
      const newChat: Chat = { id: generateId('chat'), contact, messages: [], lastActivity: Date.now(), unreadCount: 0 };
      set(state => ({ chats: [newChat, ...state.chats] }));
      useUIStore.getState().setActiveChat(newChat.id);
    }
    useUIStore.getState().navigateTo('chat');
  },

  createGroup: (groupName, members) => {
    const { userInfo } = get();
    const newGroupProfile: GroupProfile = {
      id: generateId('group'),
      name: groupName,
      avatar: `https://picsum.photos/seed/${groupName}/100/100`,
      members: [userInfo, ...members, AI_CONTACT_INFO]
    };
    const newChat: Chat = { id: newGroupProfile.id, groupInfo: newGroupProfile, messages: [], lastActivity: Date.now(), unreadCount: 0 };
    set(state => ({ chats: [newChat, ...state.chats] }));
    useUIStore.getState().setActiveChat(newChat.id);
    useUIStore.getState().navigateTo('chat');
  },
  
  deleteChat: (chatId) => {
    set(state => ({
        chats: state.chats.filter(chat => chat.id !== chatId)
    }));
    if(useUIStore.getState().activeChatId === chatId) {
        useUIStore.getState().setActiveChat(null);
        useUIStore.getState().navigateTo('home');
    }
  },

  updateMessageStatus: (chatId, messageId, status) => {
    set(state => ({
      chats: state.chats.map(c => c.id === chatId ? { ...c, messages: c.messages.map(m => m.id === messageId ? { ...m, status } : m) } : c)
    }));
  },

  updateMessageReaction: (chatId, messageId, reaction) => {
    set(state => ({
      chats: state.chats.map(c => c.id === chatId ? { ...c, messages: c.messages.map(m => m.id === messageId ? { ...m, reaction: reaction ?? undefined } : m) } : c)
    }));
  },

  deleteMessage: (chatId, messageId) => {
    set(state => ({
      chats: state.chats.map(c => c.id === chatId ? { ...c, messages: c.messages.filter(m => m.id !== messageId) } : c)
    }));
  },

  setContactStatus: (contactId, status) => {
     set(state => ({
      chats: state.chats.map(chat => {
        if(chat.contact && chat.contact.id === contactId) {
            return { ...chat, contact: { ...chat.contact, status } };
        }
        if(chat.groupInfo) {
            const memberIndex = chat.groupInfo.members.findIndex(m => m.id === contactId);
            if(memberIndex !== -1) {
                const newMembers = [...chat.groupInfo.members];
                newMembers[memberIndex] = { ...newMembers[memberIndex], status };
                return { ...chat, groupInfo: { ...chat.groupInfo, members: newMembers } };
            }
        }
        return chat;
      })
    }));
  },
  
  getSuggestions: async (prompt) => {
    set({ isSuggesting: true, suggestions: null });
    try {
        const suggestions = await api.fetchSuggestions(prompt);
        set({ suggestions });
    } catch(e) {
        console.error("Failed to get suggestions", e);
    } finally {
        set({ isSuggesting: false });
    }
  },

  clearSuggestions: () => set({ suggestions: null }),
  
  clearUnread: (chatId: string) => {
    set(state => ({
      chats: state.chats.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c)
    }));
  },
  
  reset: () => set(initialState),
}));
