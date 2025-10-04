
import React, { useState, useMemo } from 'react';
// Fix: Corrected import path for type definitions.
import type { ChatSummary } from '../types/index';
import { NewChatIcon, SearchIcon, ContactsIcon } from '../constants/icons';
import ChatListItem from '../components/ChatListItem';
import { useChatStore } from '../store/chatStore';
import { useUIStore } from '../store/uiStore';

const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { chats, userInfo } = useChatStore((state) => ({ chats: state.chats, userInfo: state.userInfo }));
  const { navigateTo, setActiveChat } = useUIStore((state) => ({
    navigateTo: state.navigateTo,
    setActiveChat: state.setActiveChat,
  }));

  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId);
    navigateTo('chat');
  };

  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => b.lastActivity - a.lastActivity);
  }, [chats]);
  
  const filteredChats = useMemo(() => {
    return sortedChats.filter(chat => {
        const chatName = chat.contact?.name || chat.groupInfo?.name || '';
        return chatName.toLowerCase().includes(searchQuery.toLowerCase())
    });
  }, [sortedChats, searchQuery]);

  const chatSummaries: ChatSummary[] = useMemo(() => {
    return filteredChats.map(chat => {
      const lastMessage = chat.messages[chat.messages.length - 1];
      let messageText = 'No messages yet';
      if (lastMessage) {
        const senderName = lastMessage.sender.id !== userInfo.id ? lastMessage.sender.name.split(' ')[0] : undefined;
        messageText = lastMessage.text || (lastMessage.image && "🖼️ Image") || (lastMessage.audio && "🎤 Voice Message") || "...";
        if(chat.groupInfo && senderName) {
            messageText = `${senderName}: ${messageText}`;
        }
      }
      return {
        id: chat.id,
        name: chat.contact?.name || chat.groupInfo?.name || 'Unknown',
        avatar: chat.contact?.avatar || chat.groupInfo?.avatar || '',
        lastMessage: messageText,
        timestamp: chat.lastActivity,
        unreadCount: chat.unreadCount,
      };
    });
  }, [filteredChats, userInfo.id]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black text-black dark:text-white relative">
      <header className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <button onClick={() => navigateTo('settings')} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
             <img src={userInfo.avatar} alt="My Profile" className="w-8 h-8 rounded-full object-cover"/>
          </button>
          <h1 className="text-xl font-bold">Chats</h1>
          <button onClick={() => navigateTo('contacts')} className="text-blue-500 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Contacts">
            <ContactsIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        {chatSummaries.length > 0 ? (
            chatSummaries.map((chat, index) => (
              <React.Fragment key={chat.id}>
                <ChatListItem
                  chat={chat}
                  onClick={() => handleSelectChat(chat.id)}
                />
                {index < chatSummaries.length - 1 && <hr className="border-gray-200 dark:border-gray-700 mx-4" />}
              </React.Fragment>
            ))
        ) : (
            <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                <h2 className="text-lg font-semibold">{searchQuery ? 'No Results Found' : 'Welcome!'}</h2>
                <p className="mt-2 text-sm">
                    {searchQuery 
                        ? `Your search for "${searchQuery}" did not match any chats.`
                        : "You don't have any chats yet. Tap the button below to start a new conversation."
                    }
                </p>
            </div>
        )}
      </div>
      <button 
        onClick={() => navigateTo('new-chat')}
        className="absolute bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-transform duration-200 hover:scale-110"
        aria-label="New chat"
      >
        <NewChatIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default HomeScreen;
