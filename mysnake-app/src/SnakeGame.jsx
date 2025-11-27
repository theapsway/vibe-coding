import React, { useEffect, useState, useRef } from 'react';

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 8, y: 8 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const SPEED = 200;

function generateFood(snake) {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
}

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(() => generateFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0); // Track food eaten
  const boardRef = useRef(null);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const newHead = { 
          x: prevSnake[0].x + direction.x, 
          y: prevSnake[0].y + direction.y 
        };

        if (
          newHead.x < 0 || newHead.x >= BOARD_SIZE ||
          newHead.y < 0 || newHead.y >= BOARD_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood(newSnake));
          setScore(prev => prev + 1); // Increase score
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, SPEED);
    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#f0f0f0',
        boxSizing: 'border-box',
      }}
    >
      <h1>Snake Game</h1>
      <div style={{ marginBottom: '10px', fontSize: '18px' }}>
        Score: {score}
      </div>
      <div
        ref={boardRef}
        style={{
          display: 'grid',
          gridTemplateRows: `repeat(${BOARD_SIZE}, 20px)`,
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 20px)`,
          gap: '1px',
          background: '#333',
          marginBottom: '20px',
        }}
      >
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, idx) => {
          const x = idx % BOARD_SIZE;
          const y = Math.floor(idx / BOARD_SIZE);

          const isSnake = snake.some(segment => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={idx}
              style={{
                width: 20,
                height: 20,
                backgroundColor: isSnake ? 'green' : isFood ? 'red' : '#eee',
              }}
            />
          );
        })}
      </div>
      {gameOver && (
        <>
          <h2 style={{ color: 'red' }}>Game Over!</h2>
          <button
            onClick={restartGame}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Restart
          </button>
        </>
      )}
    </div>
  );
}



//Code from Claude:

// import React, { useState, useEffect, useCallback } from 'react';

// const GRID_SIZE = 20;
// const CELL_SIZE = 20;
// const INITIAL_SNAKE = [{ x: 10, y: 10 }];
// const INITIAL_DIRECTION = { x: 1, y: 0 };
// const GAME_SPEED = 150;

// export default function SnakeGame() {
//   const [snake, setSnake] = useState(INITIAL_SNAKE);
//   const [food, setFood] = useState({ x: 15, y: 15 });
//   const [direction, setDirection] = useState(INITIAL_DIRECTION);
//   const [nextDirection, setNextDirection] = useState(INITIAL_DIRECTION);
//   const [gameOver, setGameOver] = useState(false);
//   const [score, setScore] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);

//   const generateFood = useCallback(() => {
//     let newFood;
//     do {
//       newFood = {
//         x: Math.floor(Math.random() * GRID_SIZE),
//         y: Math.floor(Math.random() * GRID_SIZE)
//       };
//     } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
//     return newFood;
//   }, [snake]);

//   const resetGame = () => {
//     setSnake(INITIAL_SNAKE);
//     setFood({ x: 15, y: 15 });
//     setDirection(INITIAL_DIRECTION);
//     setNextDirection(INITIAL_DIRECTION);
//     setGameOver(false);
//     setScore(0);
//     setIsPaused(false);
//   };

//   const moveSnake = useCallback(() => {
//     if (gameOver || isPaused) return;

//     setDirection(nextDirection);

//     setSnake(prevSnake => {
//       const head = prevSnake[0];
//       const newHead = {
//         x: head.x + nextDirection.x,
//         y: head.y + nextDirection.y
//       };

//       // Check wall collision
//       if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
//         setGameOver(true);
//         return prevSnake;
//       }

//       // Check self collision
//       if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
//         setGameOver(true);
//         return prevSnake;
//       }

//       const newSnake = [newHead, ...prevSnake];

//       // Check food collision
//       if (newHead.x === food.x && newHead.y === food.y) {
//         setScore(prev => prev + 10);
//         setFood(generateFood());
//       } else {
//         newSnake.pop();
//       }

//       return newSnake;
//     });
//   }, [nextDirection, food, gameOver, isPaused, generateFood]);

//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (e.key === ' ') {
//         e.preventDefault();
//         setIsPaused(prev => !prev);
//         return;
//       }

//       setNextDirection(prev => {
//         switch (e.key) {
//           case 'ArrowUp':
//             return prev.y !== 1 ? { x: 0, y: -1 } : prev;
//           case 'ArrowDown':
//             return prev.y !== -1 ? { x: 0, y: 1 } : prev;
//           case 'ArrowLeft':
//             return prev.x !== 1 ? { x: -1, y: 0 } : prev;
//           case 'ArrowRight':
//             return prev.x !== -1 ? { x: 1, y: 0 } : prev;
//           default:
//             return prev;
//         }
//       });
//     };

//     window.addEventListener('keydown', handleKeyPress);
//     return () => window.removeEventListener('keydown', handleKeyPress);
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(moveSnake, GAME_SPEED);
//     return () => clearInterval(interval);
//   }, [moveSnake]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-900 to-emerald-950 p-4">
//       <div className="bg-white rounded-lg shadow-2xl p-8">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-3xl font-bold text-green-800">Snake Game</h1>
//           <div className="text-2xl font-bold text-green-600">Score: {score}</div>
//         </div>

//         <div 
//           className="relative bg-gray-900 border-4 border-green-600 rounded"
//           style={{ 
//             width: GRID_SIZE * CELL_SIZE, 
//             height: GRID_SIZE * CELL_SIZE 
//           }}
//         >
//           {snake.map((segment, index) => (
//             <div
//               key={index}
//               className={`absolute ${index === 0 ? 'bg-green-400' : 'bg-green-500'} rounded-sm`}
//               style={{
//                 left: segment.x * CELL_SIZE,
//                 top: segment.y * CELL_SIZE,
//                 width: CELL_SIZE - 2,
//                 height: CELL_SIZE - 2
//               }}
//             />
//           ))}
          
//           <div
//             className="absolute bg-red-500 rounded-full"
//             style={{
//               left: food.x * CELL_SIZE,
//               top: food.y * CELL_SIZE,
//               width: CELL_SIZE - 2,
//               height: CELL_SIZE - 2
//             }}
//           />

//           {gameOver && (
//             <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
//               <div className="text-center">
//                 <div className="text-4xl font-bold text-white mb-4">Game Over!</div>
//                 <div className="text-2xl text-green-400 mb-4">Final Score: {score}</div>
//                 <button
//                   onClick={resetGame}
//                   className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
//                 >
//                   Play Again
//                 </button>
//               </div>
//             </div>
//           )}

//           {isPaused && !gameOver && (
//             <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
//               <div className="text-4xl font-bold text-white">PAUSED</div>
//             </div>
//           )}
//         </div>

//         <div className="mt-4 text-center text-gray-700">
//           <div className="mb-2">Use arrow keys to move</div>
//           <div className="mb-2">Press SPACE to pause</div>
//           <button
//             onClick={resetGame}
//             className="mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
//           >
//             Restart Game
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }