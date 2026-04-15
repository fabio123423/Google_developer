import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: INITIAL_DIRECTION,
    score: 0,
    isGameOver: false,
    isPaused: true,
  });

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    setGameState((prev) => {
      const head = { ...prev.snake[0] };
      switch (prev.direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collisions
      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        prev.snake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        return { ...prev, isGameOver: true };
      }

      const newSnake = [head, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;

      // Check food
      if (head.x === prev.food.x && head.y === prev.food.y) {
        newScore += 10;
        newFood = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        };
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
      };
    });
  }, [gameState.isGameOver, gameState.isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (gameState.direction !== 'DOWN') setGameState(p => ({ ...p, direction: 'UP' })); break;
        case 'ArrowDown': if (gameState.direction !== 'UP') setGameState(p => ({ ...p, direction: 'DOWN' })); break;
        case 'ArrowLeft': if (gameState.direction !== 'RIGHT') setGameState(p => ({ ...p, direction: 'LEFT' })); break;
        case 'ArrowRight': if (gameState.direction !== 'LEFT') setGameState(p => ({ ...p, direction: 'RIGHT' })); break;
        case ' ': setGameState(p => ({ ...p, isPaused: !p.isPaused })); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid (subtle)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw food (magenta glitch)
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      gameState.food.x * cellSize + cellSize / 2,
      gameState.food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake (cyan glitch)
    gameState.snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffff' : '#008888';
      ctx.shadowBlur = index === 0 ? 10 : 0;
      ctx.shadowColor = '#00ffff';
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    });
    ctx.shadowBlur = 0;

    // Sync score with sidebar display if it exists
    const scoreDisplay = document.getElementById('current-score-display');
    if (scoreDisplay) {
      scoreDisplay.innerText = gameState.score.toString().padStart(4, '0');
    }
  }, [gameState]);

  const resetGame = () => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: { x: 5, y: 5 },
      direction: INITIAL_DIRECTION,
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          className="border border-cyan-glitch/50 shadow-[0_0_30px_rgba(0,255,255,0.1)] bg-black"
        />
        
        <AnimatePresence>
          {(gameState.isGameOver || gameState.isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
            >
              {gameState.isGameOver ? (
                <>
                  <h2 className="glitch-text text-7xl font-heading text-magenta-glitch mb-4 tracking-tighter" data-text="FATAL_ERROR">
                    FATAL_ERROR
                  </h2>
                  <p className="text-cyan-glitch mb-6 font-mono text-xl uppercase tracking-widest">RECOVERY_SCORE: {gameState.score}</p>
                  <Button onClick={resetGame} className="bg-magenta-glitch hover:bg-magenta-glitch/80 text-black px-10 py-6 text-2xl font-heading rounded-none border-none shadow-[0_0_20px_#ff00ff]">
                    REBOOT_SYSTEM
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="glitch-text text-7xl font-heading text-cyan-glitch mb-4 tracking-tighter" data-text="HALT_STATE">
                    HALT_STATE
                  </h2>
                  <Button onClick={() => setGameState(p => ({ ...p, isPaused: false }))} className="bg-cyan-glitch hover:bg-cyan-glitch/80 text-black px-10 py-6 text-2xl font-heading rounded-none border-none shadow-[0_0_20px_#00ffff]">
                    RESUME_LINK
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => setGameState(p => ({ ...p, isPaused: !p.isPaused }))}
          className="border-cyan-glitch/30 text-cyan-glitch hover:bg-cyan-glitch/10 rounded-none font-mono uppercase tracking-widest text-xs"
        >
          {gameState.isPaused ? 'UPLINK' : 'HALT'}
        </Button>
        <Button
          variant="outline"
          onClick={resetGame}
          className="border-magenta-glitch/30 text-magenta-glitch hover:bg-magenta-glitch/10 rounded-none font-mono uppercase tracking-widest text-xs"
        >
          PURGE
        </Button>
      </div>
    </div>
  );
};

