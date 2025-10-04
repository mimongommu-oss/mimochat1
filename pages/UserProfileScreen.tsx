import React from 'react';
import { ChevronLeftIcon } from '../constants/icons';
import { useUIStore } from '../store/uiStore';
import { useChatStore } from '../store/chatStore';

const UserProfileScreen: React.FC = () => {
  const navigateTo = useUIStore((state) => state.navigateTo);
  const user = useChatStore((state) => state.userInfo);

  return (
    <div className="h-full flex flex-col bg-gray-100 dark:bg-black text-black dark:text-white">
      <header className="bg-gray-50 dark:bg-gray-900 p-3 flex items-center border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <button onClick={() => navigateTo('settings')} className="text-blue-500 p-2" aria-label="Back">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold ml-2">My Profile</h1>
      </header>
      
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-900">
          <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover shadow-lg" />
          <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user.status || 'Available'}</p>
        </div>
        
        <div className="p-4 mt-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
                 <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Display Name</p>
                    <p className="font-semibold">{user.name}</p>
                </div>
                 <div className="p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <p className="font-semibold">{user.status || 'Available'}</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfileScreen;