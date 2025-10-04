
import { create } from 'zustand';
import type { UserProfile, CallType, Message, ModalContent } from '../types/index';
import { useChatStore } from './chatStore';

type Page = 'home' | 'chat' | 'new-chat' | 'contacts' | 'contact-profile' | 'new-group' | 'call' | 'settings' | 'user-profile';
type Theme = 'light' | 'dark';

interface UIState {
  currentPage: Page;
  activeChatId: string | null;
  profileContact: UserProfile | null;
  callInfo: { user: UserProfile, type: CallType } | null;
  theme: Theme;
  replyingTo: Message | null;
  isModalOpen: boolean;
  modalContent: ModalContent | null;

  navigateTo: (page: Page) => void;
  setActiveChat: (chatId: string | null) => void;
  viewProfile: (contact: UserProfile) => void;
  startCall: (user: UserProfile, type: CallType) => void;
  endCall: () => void;
  toggleTheme: () => void;
  setReplyTo: (message: Message | null) => void;
  cancelReply: () => void;
  openModal: (content: ModalContent) => void;
  closeModal: () => void;
  reset: () => void;
}

const initialState = {
  currentPage: 'home' as Page,
  activeChatId: null,
  profileContact: null,
  callInfo: null,
  theme: 'light' as Theme,
  replyingTo: null,
  isModalOpen: false,
  modalContent: null,
};

export const useUIStore = create<UIState>((set) => ({
  ...initialState,

  navigateTo: (page) => set({ currentPage: page }),
  setActiveChat: (chatId) => {
    if (chatId) {
      useChatStore.getState().clearUnread(chatId);
    }
    useChatStore.getState().clearSuggestions();
    set({ activeChatId: chatId });
  },
  viewProfile: (contact) => set({ profileContact: contact, currentPage: 'contact-profile' }),
  startCall: (user, type) => set({ callInfo: { user, type }, currentPage: 'call' }),
  endCall: () => set({ callInfo: null, currentPage: 'chat' }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setReplyTo: (message) => set({ replyingTo: message }),
  cancelReply: () => set({ replyingTo: null }),
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
  reset: () => set(initialState),
}));
