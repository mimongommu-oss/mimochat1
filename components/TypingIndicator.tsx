
import React from 'react';

interface TypingIndicatorProps {
  avatar: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ avatar }) => {
  return (
    <div className="flex items-end self-start">
      <img src={avatar} alt="Contact Typing" className="w-8 h-8 rounded-full mr-2 object-cover" />
      <div className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-r-2xl rounded-tl-2xl px-4 py-3 shadow-md">
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
