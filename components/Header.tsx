
import React from 'react';
// Fix: Corrected import path for type definitions.
import type { UserProfile } from '../types/index';
import { PhoneIcon, VideoIcon, MoreIcon, ChevronLeftIcon } from '../constants/icons';
import { useUIStore } from '../store/uiStore';
import { useChatStore } from '../store/chatStore';

const Header: React.FC = () => {
  const { navigateTo, viewProfile, startCall } = useUIStore((state) => ({
    navigateTo: state.navigateTo,
    viewProfile: state.viewProfile,
    startCall: state.startCall,
  }));
  const activeChatId = useUIStore((state) => state.activeChatId);
  const chat = useChatStore((state) => state.chats.find(c => c.id === activeChatId));

  if (!chat) return null;

  const isGroup = !!chat.groupInfo;
  const name = isGroup ? chat.groupInfo?.name : chat.contact?.name;
  const avatar = isGroup ? chat.groupInfo?.avatar : chat.contact?.avatar;
  const status = isGroup 
    ? `${chat.groupInfo?.members.length} members`
    : chat.contact?.status;

  const handleViewProfileClick = () => {
    if (chat.contact) {
      viewProfile(chat.contact);
    }
  };
  
  const handleCallClick = (type: 'audio' | 'video') => {
    if(chat.contact) {
        startCall(chat.contact, type);
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-black dark:text-white p-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center space-x-3">
        <button onClick={() => navigateTo('home')} className="text-blue-500" aria-label="Back">
            <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button 
            onClick={handleViewProfileClick} 
            className="flex items-center space-x-3 text-left"
            disabled={isGroup}
        >
            <img
              src={avatar}
              alt={name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h1 className="text-lg font-bold">{name}</h1>
              {status && (
                <p className={`text-xs ${isGroup ? 'text-gray-400' : 'text-green-500'}`}>{status}</p>
              )}
            </div>
        </button>
      </div>
      <div className="flex items-center space-x-4 text-blue-500">
        <button onClick={() => handleCallClick('audio')} aria-label="Phone call" disabled={isGroup} className={isGroup ? 'opacity-50 cursor-not-allowed' : ''}>
          <PhoneIcon className="w-6 h-6" />
        </button>
        <button onClick={() => handleCallClick('video')} aria-label="Video call" disabled={isGroup} className={isGroup ? 'opacity-50 cursor-not-allowed' : ''}>
          <VideoIcon className="w-6 h-6" />
        </button>
        <button aria-label="More options">
          <MoreIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Header;
