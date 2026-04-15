import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="h-screen w-screen grid grid-cols-[300px_1fr_260px] grid-rows-[100px_1fr_120px] gap-[2px] bg-black selection:bg-magenta-glitch/50 overflow-hidden relative font-sans">
      {/* CRT Scanline Effect */}
      <div className="crt-line pointer-events-none" />
      <div className="static-noise absolute inset-0 pointer-events-none z-40" />

      {/* Header Area */}
      <header className="panel-glitch col-span-3 flex items-center justify-between px-8 border-b border-cyan-glitch/50">
        <div className="flex flex-col">
          <h1 className="glitch-text font-heading text-5xl uppercase tracking-tighter text-cyan-glitch" data-text="NEURAL_SNAKE_v2.0">
            NEURAL_SNAKE_v2.0
          </h1>
          <div className="text-[10px] font-mono text-magenta-glitch uppercase tracking-[0.3em] animate-pulse">
            SYSTEM_STATUS: COMPROMISED // UPLINK_ACTIVE
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="h-2 w-32 bg-cyan-glitch/10 rounded-full overflow-hidden relative">
            <motion.div 
              animate={{ x: [-128, 128] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-0 w-1/2 bg-cyan-glitch shadow-[0_0_10px_#00ffff]"
            />
          </div>
          <div className="font-mono text-[10px] text-cyan-glitch/50">
            LOAD_AVG: 0.82 0.91 0.88
          </div>
        </div>
      </header>

      {/* Sidebar Left: Data Streams */}
      <aside className="panel-glitch p-6 flex flex-col gap-6 border-r border-cyan-glitch/30">
        <div className="text-[10px] font-mono text-cyan-glitch/40 uppercase tracking-[2px] border-b border-cyan-glitch/20 pb-2">
          DATA_STREAM_QUEUE
        </div>
        <div className="space-y-6">
          <div className="group cursor-pointer">
            <div className="text-magenta-glitch font-bold text-lg tracking-tight group-hover:animate-pulse">CYBER_PULSE.bin</div>
            <div className="text-[10px] text-cyan-glitch/60 font-mono">SIZE: 4.2MB // TYPE: AUDIO/PCM</div>
          </div>
          <div className="group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
            <div className="text-cyan-glitch font-bold text-lg tracking-tight">SYNTH_HORIZON.raw</div>
            <div className="text-[10px] text-cyan-glitch/60 font-mono">SIZE: 3.8MB // TYPE: AUDIO/PCM</div>
          </div>
          <div className="group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
            <div className="text-cyan-glitch font-bold text-lg tracking-tight">GLITCH_DRIFT.sys</div>
            <div className="text-[10px] text-cyan-glitch/60 font-mono">SIZE: 5.1MB // TYPE: AUDIO/PCM</div>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-cyan-glitch/20">
          <div className="text-[9px] font-mono text-cyan-glitch/30 leading-tight">
            [LOG] 18:24:59 - INITIALIZING_KERNEL...<br/>
            [LOG] 18:25:01 - MEMORY_ALLOCATION_OK<br/>
            [LOG] 18:25:05 - LOADING_SNAKE_MODULE...
          </div>
        </div>
      </aside>

      {/* Main Content: Neural Interface */}
      <main className="panel-glitch flex items-center justify-center bg-black relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <SnakeGame />
      </main>

      {/* Sidebar Right: Metrics */}
      <aside className="panel-glitch p-6 flex flex-col gap-8 border-l border-cyan-glitch/30">
        <div>
          <div className="text-[10px] font-mono text-cyan-glitch/40 uppercase tracking-[2px] mb-2">SCORE_METRIC</div>
          <div id="current-score-display" className="font-heading text-6xl text-cyan-glitch drop-shadow-[0_0_8px_#00ffff]">0000</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-magenta-glitch/40 uppercase tracking-[2px] mb-2">PEAK_EFFICIENCY</div>
          <div className="font-heading text-6xl text-magenta-glitch drop-shadow-[0_0_8px_#ff00ff]">0450</div>
        </div>
        <div className="pt-4 border-t border-cyan-glitch/20">
          <div className="text-[10px] font-mono text-cyan-glitch/40 uppercase tracking-[2px] mb-2">THREAT_LEVEL</div>
          <div className="text-xl font-bold text-cyan-glitch animate-pulse">CRITICAL_OVERLOAD</div>
        </div>
      </aside>

      {/* Footer: Audio Processor */}
      <footer className="panel-glitch col-span-3 grid grid-cols-[300px_1fr_260px] items-center px-8 border-t border-magenta-glitch/50">
        <MusicPlayer />
      </footer>
    </div>
  );
}

