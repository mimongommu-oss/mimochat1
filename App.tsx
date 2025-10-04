
import React, { useEffect } from 'react';
import MainNavigator from './navigation/MainNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';

const App: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-md h-[90vh] max-h-[800px] flex flex-col bg-white dark:bg-black rounded-3xl shadow-2xl overflow-hidden">
        {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
      </div>
    </div>
  );
};

export default App;