import React, { useEffect } from 'react';
import Header from '../components/Header';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import { useChatStore } from '../store/chatStore';
import { useUIStore } from '../store/uiStore';
import HomeScreen from './HomeScreen';

const ChatScreen: React.FC = () => {
  const activeChatId = useUIStore((state) => state.activeChatId);
  const initializeChat = useChatStore((state) => state.initializeChat);

  useEffect(() => {
    if (activeChatId) {
      initializeChat(activeChatId);
    }
  }, [activeChatId, initializeChat]);

  if (!activeChatId) {
    // This case should ideally not be hit if navigation is handled correctly,
    // but it's a safe fallback.
    return <HomeScreen />;
  }

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-black">
      <Header />
      <ChatWindow />
      <MessageInput />
    </div>
  );
};

export default ChatScreen;