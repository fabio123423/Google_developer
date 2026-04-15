import React, { useState, useRef, useEffect } from 'react';
import { Track } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Dreams',
    artist: 'Cyber Synth',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon/400/400',
  },
  {
    id: '2',
    title: 'Midnight Pulse',
    artist: 'Digital Ghost',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/pulse/400/400',
  },
  {
    id: '3',
    title: 'Retro Wave',
    artist: 'Synth Master',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/retro/400/400',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const seekTime = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = seekTime;
      setProgress(value[0]);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      {/* Column 1: Now Playing */}
      <div className="flex items-center gap-4">
        <div className="w-[60px] h-[60px] bg-magenta-glitch flex items-center justify-center font-heading text-black text-3xl shadow-[0_0_15px_rgba(255,0,255,0.5)] relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 animate-pulse" />
          <span className="relative z-10">{currentTrack.title.substring(0, 1)}</span>
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-bold uppercase tracking-tight truncate w-40 text-cyan-glitch">{currentTrack.title}</div>
          <div className="text-[9px] text-magenta-glitch font-mono tracking-[0.2em] animate-pulse">DECODING_STREAM...</div>
        </div>
      </div>

      {/* Column 2: Playback Bar & Buttons */}
      <div className="flex flex-col gap-2 px-10">
        <div className="flex justify-center gap-10 font-mono text-xs uppercase tracking-[3px]">
          <span onClick={handlePrev} className="cursor-pointer hover:text-magenta-glitch transition-colors hover:skew-x-12">PREV</span>
          <span 
            onClick={() => setIsPlaying(!isPlaying)} 
            className="cursor-pointer text-cyan-glitch hover:text-white transition-colors font-bold"
          >
            {isPlaying ? '[ HALT ]' : '[ LINK ]'}
          </span>
          <span onClick={handleNext} className="cursor-pointer hover:text-magenta-glitch transition-colors hover:skew-x-12">NEXT</span>
        </div>
        <div className="relative w-full h-[2px] bg-cyan-glitch/10">
          <motion.div 
            className="absolute left-0 top-0 h-full bg-cyan-glitch shadow-[0_0_10px_#00ffff]"
            style={{ width: `${progress}%` }}
          />
          {/* Glitchy progress marker */}
          <motion.div 
            className="absolute top-[-4px] h-3 w-1 bg-magenta-glitch shadow-[0_0_5px_#ff00ff]"
            style={{ left: `${progress}%` }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between font-mono text-[9px] text-cyan-glitch/40 uppercase tracking-widest">
          <span>{audioRef.current ? Math.floor(audioRef.current.currentTime / 60) + ':' + Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0') : '0:00'}</span>
          <span>{audioRef.current && !isNaN(audioRef.current.duration) ? Math.floor(audioRef.current.duration / 60) + ':' + Math.floor(audioRef.current.duration % 60).toString().padStart(2, '0') : '0:00'}</span>
        </div>
      </div>

      {/* Column 3: Volume */}
      <div className="flex justify-end items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-cyan-glitch/60">
        <span>GAIN</span>
        <div className="relative w-24 h-[1px] bg-cyan-glitch/20">
          <div 
            className="absolute left-0 top-0 h-full bg-magenta-glitch"
            style={{ width: `${volume}%` }}
          />
          <input 
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
        <span className="w-10 text-right text-magenta-glitch">{volume}%</span>
      </div>
    </>
  );
};


