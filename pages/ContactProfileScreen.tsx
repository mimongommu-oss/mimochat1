
import React, { useState } from 'react';
// Fix: Corrected import path for type definitions.
import type { CallType } from '../types/index';
import { ChevronLeftIcon, PhoneIcon, VideoIcon, SendIcon, BellIcon, MediaIcon, BlockIcon } from '../constants/icons';
import { useUIStore } from '../store/uiStore';
import { useChatStore } from '../store/chatStore';

const ContactProfileScreen: React.FC = () => {
    const [isMuted, setIsMuted] = useState(false);
    const { profileContact, navigateTo, startCall } = useUIStore((state) => ({
      profileContact: state.profileContact,
      navigateTo: state.navigateTo,
      startCall: state.startCall,
    }));
    const startNewChat = useChatStore((state) => state.startNewChat);

    if (!profileContact) {
      // Could render a loading or error state, or navigate back
      return null;
    }

    const handleMessage = () => {
      startNewChat(profileContact);
    };

    const handleInitiateCall = (type: CallType) => {
      startCall(profileContact, type);
    };

    return (
        <div className="h-full flex flex-col bg-gray-100 dark:bg-black text-black dark:text-white">
            <header className="bg-gray-50 dark:bg-gray-900 p-3 flex items-center border-b border-gray-200 dark:border-gray-800 shadow-sm">
                <button onClick={() => navigateTo('chat')} className="text-blue-500 p-2" aria-label="Back">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold ml-2">Contact Info</h1>
            </header>
            
            <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <img src={profileContact.avatar} alt={profileContact.name} className="w-24 h-24 rounded-full object-cover shadow-lg" />
                    <h2 className="text-2xl font-bold mt-4">{profileContact.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{profileContact.status}</p>
                    <div className="flex space-x-6 mt-6">
                        <button onClick={handleMessage} className="flex flex-col items-center text-blue-500 hover:text-blue-600">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full"><SendIcon className="w-6 h-6" /></div>
                            <span className="text-xs mt-1">Message</span>
                        </button>
                        <button onClick={() => handleInitiateCall('audio')} className="flex flex-col items-center text-blue-500 hover:text-blue-600">
                             <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full"><PhoneIcon className="w-6 h-6" /></div>
                            <span className="text-xs mt-1">Call</span>
                        </button>
                        <button onClick={() => handleInitiateCall('video')} className="flex flex-col items-center text-blue-500 hover:text-blue-600">
                             <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full"><VideoIcon className="w-6 h-6" /></div>
                            <span className="text-xs mt-1">Video</span>
                        </button>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="bg-white dark:bg-gray-900">
                        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center">
                                <BellIcon className="w-6 h-6 text-gray-500 mr-4" />
                                <p>Mute Notifications</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={isMuted} onChange={() => setIsMuted(!isMuted)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="bg-white dark:bg-gray-900">
                         <div className="p-4 flex justify-between items-center border-y border-gray-200 dark:border-gray-800">
                            <div className="flex items-center">
                                <MediaIcon className="w-6 h-6 text-gray-500 mr-4" />
                                <p>Shared Media</p>
                            </div>
                            <span className="text-sm text-gray-500">0 ></span>
                        </div>
                    </div>
                </div>
                 <div className="mt-4">
                    <div className="bg-white dark:bg-gray-900">
                         <button className="p-4 flex items-center w-full text-left text-red-500 border-y border-gray-200 dark:border-gray-800">
                            <BlockIcon className="w-6 h-6 mr-4" />
                            <p>Block {profileContact.name}</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactProfileScreen;
