
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, AttachmentIcon, MicrophoneIcon, TrashIcon, SparkleIcon } from '../constants/icons';
// Fix: Corrected import path for type definitions.
import type { Message } from '../types/index';
import { useChatStore } from '../store/chatStore';
import { useUIStore } from '../store/uiStore';

const MessageInput: React.FC = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const { isLoading, sendMessage, suggestions, getSuggestions, isSuggesting, clearSuggestions } = useChatStore((state) => ({
    isLoading: state.isLoading,
    sendMessage: state.sendMessage,
    suggestions: state.suggestions,
    getSuggestions: state.getSuggestions,
    isSuggesting: state.isSuggesting,
    clearSuggestions: state.clearSuggestions,
  }));
  const { replyingTo, cancelReply, userInfo } = useUIStore((state) => ({
    replyingTo: state.replyingTo,
    cancelReply: state.cancelReply,
    userInfo: useChatStore.getState().userInfo,
  }));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const resetAllInputs = () => {
    setText('');
    setImage(null);
    setAudioUrl(null);
    cancelReply();
    clearSuggestions();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = (send: boolean) => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if(recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      setIsRecording(false);
      if(!send) {
        setAudioUrl(null);
      }
    }
  };

  const handleStopAndSend = () => {
    stopRecording(true);
  };
  
  useEffect(() => {
    if (audioUrl && !isRecording) {
      fetch(audioUrl).then(res => res.blob()).then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          sendMessage(text, image, reader.result as string);
          resetAllInputs();
        };
        reader.readAsDataURL(blob);
      });
    }
  }, [audioUrl, isRecording]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(isRecording) { handleStopAndSend(); return; }
    if ((text.trim() || image || audioUrl) && !isLoading) {
      sendMessage(text, image, audioUrl);
      resetAllInputs();
    }
  };
  
  const handleMagicCompose = () => {
    if (text.trim() && !isSuggesting) {
        getSuggestions(text);
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setText(suggestion);
    clearSuggestions();
  }

  const renderReplyContent = (reply: Message | null) => {
    if(!reply) return null;
    if(reply.image) return "🖼️ Image";
    if(reply.audio) return "🎤 Voice Message";
    return reply.text;
  }
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-3 border-t border-gray-200 dark:border-gray-800">
       {suggestions && (
        <div className="mb-2 space-y-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Magic suggestions:</p>
            {suggestions.map((s, i) => (
                <button key={i} onClick={() => handleSuggestionClick(s)} className="block w-full text-left p-2 text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900">
                    {s}
                </button>
            ))}
        </div>
      )}
      {replyingTo && (
        <div className="flex items-center p-2 mb-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
          <div className="border-l-4 border-blue-500 pl-3 flex-1">
            <p className="font-bold text-blue-500 text-sm">Replying to {replyingTo.sender.id === userInfo.id ? 'You' : replyingTo.sender.name}</p>
            <p className="text-sm text-black dark:text-white truncate">{renderReplyContent(replyingTo)}</p>
          </div>
          <button onClick={cancelReply} className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">&times;</button>
        </div>
      )}
      {image && (
        <div className="relative mb-2">
          <img src={image} alt="Preview" className="max-h-24 rounded-lg" />
          <button onClick={() => { setImage(null); if(fileInputRef.current) fileInputRef.current.value = ""; }} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5">
            &times;
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        {isRecording ? (
          <div className="flex-1 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full h-10 px-3">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm font-mono text-red-500">{formatTime(recordingTime)}</span>
            <div className="flex-grow"></div>
            <button type="button" onClick={() => stopRecording(false)} className="p-2 text-gray-500 hover:text-red-500">
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="p-2 text-gray-500 hover:text-blue-500">
              <AttachmentIcon className="w-6 h-6" />
            </button>
            <div className="relative flex-1">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={image ? "Ask about the image..." : "Message..."}
                  className="w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button type="button" onClick={handleMagicCompose} disabled={isLoading || isSuggesting || !text.trim()} className={`absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-purple-500 disabled:opacity-40`}>
                    <SparkleIcon className={`w-5 h-5 ${isSuggesting ? 'animate-pulse' : ''}`} />
                </button>
            </div>
          </>
        )}
        {!text.trim() && !image && !audioUrl && !isRecording ? (
          <button type="button" onClick={startRecording} disabled={isLoading} className="p-2 rounded-full bg-blue-500 text-white transition-colors">
            <MicrophoneIcon className="w-6 h-6" />
          </button>
        ) : (
          <button type="submit" disabled={isLoading} className={`p-2 rounded-full transition-colors ${(text.trim() || image || audioUrl || isRecording) && !isLoading ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'}`}>
            <SendIcon className="w-6 h-6" />
          </button>
        )}
      </form>
    </div>
  );
};

export default MessageInput;