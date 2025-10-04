import React from 'react';
import { ChevronLeftIcon, PaletteIcon, LogoutIcon } from '../constants/icons';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { useChatStore } from '../store/chatStore';

const SettingsScreen: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const { theme, toggleTheme, navigateTo } = useUIStore((state) => ({
    theme: state.theme,
    toggleTheme: state.toggleTheme,
    navigateTo: state.navigateTo,
  }));
  const userInfo = useChatStore((state) => state.userInfo);

  return (
    <div className="h-full flex flex-col bg-gray-100 dark:bg-black text-black dark:text-white">
      <header className="bg-gray-50 dark:bg-gray-900 p-3 flex items-center border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <button onClick={() => navigateTo('home')} className="text-blue-500 p-2" aria-label="Back">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold ml-2">Settings</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 bg-white dark:bg-gray-900">
           <button onClick={() => navigateTo('user-profile')} className="flex items-center w-full text-left">
            <img src={userInfo.avatar} alt="My Profile" className="w-16 h-16 rounded-full object-cover" />
            <div className="ml-4">
              <h2 className="text-lg font-semibold">{userInfo.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">View Profile</p>
            </div>
          </button>
        </div>

        <div className="mt-4">
          <div className="bg-white dark:bg-gray-900">
            <div className="p-4 flex justify-between items-center border-y border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <PaletteIcon className="w-6 h-6 text-gray-500 mr-4" />
                <p>Dark Mode</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

         <div className="mt-4">
            <div className="bg-white dark:bg-gray-900">
                 <button onClick={logout} className="p-4 flex items-center w-full text-left text-red-500 border-y border-gray-200 dark:border-gray-800">
                    <LogoutIcon className="w-6 h-6 mr-4" />
                    <p>Logout</p>
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsScreen;