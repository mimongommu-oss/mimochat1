import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { useChatStore } from '../store/chatStore';
import { useUIStore } from '../store/uiStore';
import { AI_CONTACT_INFO } from '../data/mock';

const ChatWindow: React.FC = () => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  const activeChatId = useUIStore((state) => state.activeChatId);
  const { activeChat, isLoading } = useChatStore((state) => ({
    activeChat: state.chats.find(c => c.id === activeChatId),
    isLoading: state.isLoading,
  }));
  
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isLoading]);

  if (!activeChat) return null;

  const typingContact = activeChat.contact || AI_CONTACT_INFO;

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-800">
      <div className="flex flex-col space-y-4">
        {activeChat.messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            message={msg}
            chatId={activeChat.id}
          />
        ))}
        {isLoading && <TypingIndicator avatar={typingContact.avatar} />}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default ChatWindow;