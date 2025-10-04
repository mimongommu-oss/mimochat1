
import React, { useState, useRef } from 'react';
// Fix: Corrected import path for type definitions.
import type { Message } from '../types/index';
import { MessageStatusIcon, REACTION_EMOJIS, ReplyIcon, CopyIcon, TrashIcon } from '../constants/icons';
import AudioPlayer from './AudioPlayer';
import { useChatStore } from '../store/chatStore';
import { useUIStore } from '../store/uiStore';
import { formatTimestamp } from '../utils/time';

interface MessageBubbleProps {
  message: Message;
  chatId: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, chatId }) => {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const longPressTimer = useRef<number | null>(null);
  const paletteTimer = useRef<number | null>(null);

  const { userInfo, updateMessageReaction, deleteMessage } = useChatStore((state) => ({
    userInfo: state.userInfo,
    updateMessageReaction: state.updateMessageReaction,
    deleteMessage: state.deleteMessage,
  }));
  const setReplyTo = useUIStore((state) => state.setReplyTo);
  
  const isUser = message.sender.id === userInfo.id;

  const bubbleClasses = isUser
    ? 'bg-blue-500 text-white self-end rounded-l-2xl rounded-tr-2xl'
    : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white self-start rounded-r-2xl rounded-tl-2xl';

  const containerClasses = isUser ? 'flex items-end justify-end' : 'flex items-end justify-start';
  
  const hasContent = message.text || message.image || message.audio;

  const handlePointerDown = () => {
    longPressTimer.current = window.setTimeout(() => {
      setIsPaletteOpen(true);
    }, 500);
  };

  const handlePointerUp = () => {
    if(longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const handleMouseEnter = () => {
    paletteTimer.current = window.setTimeout(() => setIsPaletteOpen(true), 300);
  };

  const handleMouseLeave = () => {
    if(paletteTimer.current) clearTimeout(paletteTimer.current);
    paletteTimer.current = window.setTimeout(() => setIsPaletteOpen(false), 200);
  };

  const handleReactionSelect = (emoji: string) => {
    updateMessageReaction(chatId, message.id, message.reaction === emoji ? null : emoji);
    setIsPaletteOpen(false);
  };

  const handleReplySelect = () => {
    setReplyTo(message);
    setIsPaletteOpen(false);
  }
  
  const handleCopyText = () => {
    if(message.text) {
        navigator.clipboard.writeText(message.text).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
    setIsPaletteOpen(false);
  }

  const handleDeleteMessage = () => {
    deleteMessage(chatId, message.id);
    setIsPaletteOpen(false);
  }
  
  const renderReplyContent = (reply: Message['replyTo']) => {
    if(!reply) return null;
    if(reply.image) return "🖼️ Image";
    if(reply.audio) return "🎤 Voice Message";
    return reply.text;
  }

  return (
    <div className={`${containerClasses} relative group`}>
       {!isUser && (
        <img src={message.sender.avatar} alt={message.sender.name} className="w-8 h-8 rounded-full mr-2 object-cover self-end mb-6" />
      )}
      <div 
        className="flex flex-col" 
        style={{ maxWidth: '75%' }}
        onMouseLeave={handleMouseLeave}
      >
        {!isUser && message.sender.name && <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-2">{message.sender.name}</p>}
        {isPaletteOpen && hasContent && (
          <div
            onMouseEnter={() => {if(paletteTimer.current) clearTimeout(paletteTimer.current)}}
            className={`absolute z-20 flex items-center p-1 space-x-0.5 bg-white dark:bg-gray-800 rounded-full shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 -top-5 transform transition-opacity duration-200 ${isUser ? 'right-0' : 'left-8'}`}
          >
            {REACTION_EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => handleReactionSelect(emoji)}
                className="text-xl p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transform transition-transform hover:scale-125"
                aria-label={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
            <button
                onClick={handleReplySelect}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transform transition-transform hover:scale-110"
                aria-label="Reply to message"
              >
                <ReplyIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
            </button>
            {message.text && (
                 <button
                    onClick={handleCopyText}
                    className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transform transition-transform hover:scale-110"
                    aria-label="Copy message"
                >
                    <CopyIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                </button>
            )}
            <button
                onClick={handleDeleteMessage}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transform transition-transform hover:scale-110"
                aria-label="Delete message"
            >
                <TrashIcon className="w-5 h-5 text-red-500"/>
            </button>
          </div>
        )}
        {hasContent && (
          <div
            className={`shadow-md ${bubbleClasses} ${message.image ? 'p-2' : 'px-4 py-2'}`}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onMouseEnter={handleMouseEnter}
            onContextMenu={(e) => e.preventDefault()}
          >
            {message.replyTo && (
                <div className="p-2 mb-2 border-l-4 border-blue-300 dark:border-blue-700 bg-black/10 dark:bg-white/10 rounded-md">
                    <p className="font-bold text-sm">{message.replyTo.author}</p>
                    <p className="text-sm opacity-80 truncate">{renderReplyContent(message.replyTo)}</p>
                </div>
            )}
            {message.image && (
              <img src={message.image} alt="User upload" className={`rounded-lg max-w-full h-auto ${message.text ? 'mb-2' : ''}`} />
            )}
            {message.audio && (
              <AudioPlayer src={message.audio} isUser={isUser} />
            )}
            {message.text && (
              <p className={`text-sm whitespace-pre-wrap ${message.audio ? 'mt-2' : ''}`}>{message.text}</p>
            )}
          </div>
        )}
        {message.reaction && (
            <div className={`absolute -bottom-3 z-10 bg-gray-200 dark:bg-gray-700 rounded-full px-1.5 py-0.5 text-xs shadow ${isUser ? 'right-10' : 'left-10'}`}>
                {message.reaction}
            </div>
        )}
        <div className={`flex items-center mt-1 px-1 space-x-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTimestamp(message.timestamp)}
          </span>
          {isUser && <MessageStatusIcon status={message.status} />}
        </div>
      </div>
      {isUser && (
        <img src={message.sender.avatar} alt="User" className="w-8 h-8 rounded-full ml-2 object-cover self-end mb-6" />
      )}
    </div>
  );
};

export default MessageBubble;
