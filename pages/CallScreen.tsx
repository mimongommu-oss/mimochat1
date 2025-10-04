import React, { useState, useEffect } from 'react';
import { MuteIcon, SpeakerIcon, PhoneIcon } from '../constants/icons';
import { useUIStore } from '../store/uiStore';
import ChatScreen from './ChatScreen';

const CallScreen: React.FC = () => {
  const [status, setStatus] = useState('Calling...');
  const [duration, setDuration] = useState(0);
  const { callInfo, endCall } = useUIStore((state) => ({
    callInfo: state.callInfo,
    endCall: state.endCall,
  }));

  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setStatus('Connected');
    }, 2500);
    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    let interval: number | null = null;
    if (status === 'Connected') {
      interval = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  if (!callInfo) {
    return <ChatScreen />; // Fallback if call screen is rendered without call info
  }
  const { user } = callInfo;

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white justify-between p-8">
      <div className="flex flex-col items-center text-center mt-12">
        <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full object-cover ring-4 ring-white/20" />
        <h1 className="text-3xl font-bold mt-6">{user.name}</h1>
        <p className="text-lg text-gray-300 mt-2">
            {status === 'Connected' ? formatDuration(duration) : status}
        </p>
      </div>
      <div className="flex justify-center items-center space-x-8 mb-12">
        <button className="flex flex-col items-center space-y-2 text-gray-300 bg-white/10 p-3 rounded-full hover:bg-white/20">
            <MuteIcon className="w-7 h-7" />
            <span className="text-xs">Mute</span>
        </button>
        <button 
            onClick={endCall}
            className="p-5 bg-red-500 rounded-full transform scale-125 hover:bg-red-600 transition-all duration-200"
            aria-label="End call"
        >
            <PhoneIcon className="w-8 h-8 rotate-[135deg]" />
        </button>
         <button className="flex flex-col items-center space-y-2 text-gray-300 bg-white/10 p-3 rounded-full hover:bg-white/20">
            <SpeakerIcon className="w-7 h-7" />
            <span className="text-xs">Speaker</span>
        </button>
      </div>
    </div>
  );
};

export default CallScreen;