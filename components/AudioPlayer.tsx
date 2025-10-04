
import React, { useState, useRef, useEffect } from 'react';
// Fix: Corrected icon import path.
import { PlayIcon, PauseIcon } from '../constants/icons';

interface AudioPlayerProps {
    src: string;
    isUser: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, isUser }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => {
            setDuration(audio.duration);
        };

        const updateProgress = () => {
            setProgress(audio.currentTime);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
        }

        audio.addEventListener('loadedmetadata', setAudioData);
        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', setAudioData);
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);
    
    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if(audio) {
            audio.currentTime = Number(e.target.value);
            setProgress(audio.currentTime);
        }
    }

    const formatTime = (time: number) => {
        if (isNaN(time) || time === 0) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const progressColor = isUser ? 'range-primary' : 'range-secondary';
    const thumbColor = isUser ? 'thumb-primary' : 'thumb-secondary';

    return (
        <div className="flex items-center space-x-2 w-full max-w-[200px]">
            <audio ref={audioRef} src={src} preload="metadata"></audio>
            <button onClick={togglePlayPause} className={`flex-shrink-0 ${isUser ? 'text-white' : 'text-gray-600 dark:text-gray-200'}`}>
                {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
            </button>
            <div className="flex-grow flex items-center space-x-2">
                <input
                    type="range"
                    value={progress}
                    min={0}
                    max={duration || 0}
                    onChange={handleProgressChange}
                    className={`w-full h-1.5 rounded-full appearance-none cursor-pointer ${isUser ? 'bg-white/30' : 'bg-gray-300 dark:bg-gray-600'}`}
                />
                <style>{`
                    input[type=range]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: ${isUser ? '#FFFFFF' : '#4A5568'};
                        cursor: pointer;
                    }
                     input[type=range]::-moz-range-thumb {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: ${isUser ? '#FFFFFF' : '#4A5568'};
                        cursor: pointer;
                    }
                `}</style>
                <span className={`text-xs w-10 text-right ${isUser ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                    {formatTime(isPlaying ? progress : duration)}
                </span>
            </div>
        </div>
    );
};

export default AudioPlayer;
