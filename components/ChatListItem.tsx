
import React, { useRef, useState } from 'react';
import type { ChatSummary } from '../types/index';
import { useUIStore } from '../store/uiStore';
import { useChatStore } from '../store/chatStore';
import { formatTimestamp } from '../utils/time';

interface ChatListItemProps {
  chat: ChatSummary;
  onClick: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, onClick }) => {
  const longPressTimeout = useRef<number | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const openModal = useUIStore((state) => state.openModal);
  const deleteChat = useChatStore((state) => state.deleteChat);

  const handleDelete = () => {
    openModal({
      title: 'Delete Chat',
      description: `Are you sure you want to delete the chat with ${chat.name}? This action cannot be undone.`,
      actions: [
        {
          label: 'Cancel',
          style: 'secondary',
        },
        {
          label: 'Delete',
          style: 'danger',
          action: () => deleteChat(chat.id),
        },
      ],
    });
  };

  const handlePointerDown = () => {
    setIsPressed(true);
    longPressTimeout.current = window.setTimeout(() => {
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      handleDelete();
      longPressTimeout.current = null; // Prevent click after long press
    }, 750);
  };

  const handlePointerUp = () => {
    setIsPressed(false);
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
      onClick();
    }
  };

  const handlePointerLeave = () => {
    setIsPressed(false);
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
       longPressTimeout.current = null;
    }
  }

  return (
    <div
      className={`flex items-center p-3 cursor-pointer transition-colors duration-200 ${isPressed ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      <img
        src={chat.avatar}
        alt={chat.name}
        className="w-14 h-14 rounded-full object-cover mr-4"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{chat.name}</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">{formatTimestamp(chat.timestamp)}</span>
        </div>
        <div className="flex justify-between items-start mt-1">
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate pr-4">{chat.lastMessage}</p>
          {chat.unreadCount && chat.unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
