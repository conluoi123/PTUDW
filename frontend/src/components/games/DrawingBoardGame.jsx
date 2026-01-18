import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Eraser, Download, Trash2, Undo, Redo, 
  Palette, Circle, Square, Minus, MousePointer2 
} from 'lucide-react';
import { Button, Box, Typography, Paper, Card, CardContent, Slider, Tooltip } from '@mui/material';
import { GameWithRating } from './GameWithRating';
import { QuickSaveButtons } from './QuickSaveButtons';
import { GameService } from '@/services/game.services';


const COLORS = [
  '#000000', '#ffffff', '#1877f2', '#42b72a', '#f02849', '#ff9800', 
  '#9c27b0', '#2196f3', '#4caf50', '#ffeb3b', '#ff5722', '#795548',
];

const BRUSH_SIZES = [2, 5, 10, 15, 20, 30];

export function DrawingBoardGame() {

  const navigate = useNavigate();
  const location = useLocation();
  const [gameId, setGameId] = useState(location.state?.gameId); 
  // const { gameId, gameName } = location.state || {}; // Get ID passed from GamePage
  
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('pen'); // pen, eraser, line, circle, rectangle
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [startPos, setStartPos] = useState(null);

  useEffect(() => {
    const fetchGameId = async () => {
        if (!gameId) {
            try {
                const response = await GameService.getAllGames();
                const games = response?.data || [];
                const drawingGame = games.find(g => g.name === 'Bảng vẽ tự do' || g.name === 'Drawing Board');
                if (drawingGame) {
                    setGameId(drawingGame.id || drawingGame._id);
                }
            } catch (error) {
                console.error("Failed to fetch game ID:", error);
            }
        }
    };
    fetchGameId();
  }, [gameId]);
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;
          
          // Fill with white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Save initial state if empty
          if (history.length === 0) {
            saveToHistory();
          }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Save canvas state to history
  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL();
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  // Undo
  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      restoreFromHistory(historyStep - 1);
    }
  };

  // Redo
  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      restoreFromHistory(historyStep + 1);
    }
  };

  // Restore canvas from history
  const restoreFromHistory = (step) => {
    const canvas = canvasRef.current;
    if (!canvas || !history[step]) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = history[step];
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  // Download canvas
  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // Get mouse position
  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Start drawing
  const startDrawing = (e) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  // Draw
  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getMousePos(e);

    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'pen' || tool === 'eraser') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  // Stop drawing
  const stopDrawing = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getMousePos(e);

    if (tool === 'line') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
      );
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (tool === 'rectangle') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.strokeRect(
        startPos.x,
        startPos.y,
        pos.x - startPos.x,
        pos.y - startPos.y
      );
    }

    setIsDrawing(false);
    saveToHistory();
  };

  // Save/Load Logic
  const gameState = {
    canvasData: canvasRef.current ? canvasRef.current.toDataURL() : null,
    color,
    brushSize,
    tool
  };

  const handleLoad = (loadedState) => {
      setColor(loadedState.color);
      setBrushSize(loadedState.brushSize);
      setTool(loadedState.tool);
      
      if (loadedState.canvasData && canvasRef.current) {
          const img = new Image();
          img.src = loadedState.canvasData;
          img.onload = () => {
              const ctx = canvasRef.current.getContext('2d');
              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              ctx.drawImage(img, 0, 0);
              saveToHistory();
          };
      }
  };

  return (
    <GameWithRating gameName="Drawing Board" gameId={gameId}>
      <Box className="h-full flex flex-col">
        {/* Header */}
        <Box className="flex items-center justify-between mb-4">
          <Button
            onClick={() => navigate('/games')}
            variant="outlined"
            size="small"
            startIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Games
          </Button>

          <Typography variant="h4" className="font-bold">Drawing Board</Typography>

          <Box className="flex gap-2">

            <Tooltip title="Undo">
                <span>
                    <Button onClick={undo} variant="outlined" size="small" disabled={historyStep <= 0}>
                        <Undo className="w-4 h-4" />
                    </Button>
                </span>
            </Tooltip>
             <Tooltip title="Redo">
                <span>
                    <Button onClick={redo} variant="outlined" size="small" disabled={historyStep >= history.length - 1}>
                        <Redo className="w-4 h-4" />
                    </Button>
                </span>
            </Tooltip>
            <Button onClick={clearCanvas} variant="outlined" color="error" size="small" startIcon={<Trash2 className="w-4 h-4"/>}>
                Clear
            </Button>
            <QuickSaveButtons 
                gameName="drawing-board" 
                gameState={gameState} 
                onLoad={handleLoad} 
            />
          </Box>
        </Box>

        <Box className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-hidden">
          {/* Toolbar */}
          <Paper className="lg:col-span-1 p-4 overflow-y-auto">
              <Box className="space-y-6">
                 {/* Tools */}
                <Box>
                    <Typography variant="subtitle2" className="mb-2 font-bold flex items-center gap-2">
                        <MousePointer2 className="w-4 h-4"/> Tools
                    </Typography>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: 'pen', icon: <Minus className="w-4 h-4 rotate-45"/>, label: 'Pen' },
                            { id: 'eraser', icon: <Eraser className="w-4 h-4"/>, label: 'Eraser' },
                            { id: 'line', icon: <Minus className="w-4 h-4"/>, label: 'Line' },
                            { id: 'circle', icon: <Circle className="w-4 h-4"/>, label: 'Circle' },
                            { id: 'rectangle', icon: <Square className="w-4 h-4"/>, label: 'Rect' },
                        ].map((t) => (
                            <Button
                                key={t.id}
                                variant={tool === t.id ? 'contained' : 'outlined'}
                                onClick={() => setTool(t.id)}
                                className="flex flex-col gap-1 p-3 h-auto"
                            >
                                {t.icon}
                                <span className="text-xs">{t.label}</span>
                            </Button>
                        ))}
                    </div>
                </Box>

                {/* Colors */}
                <Box>
                    <Typography variant="subtitle2" className="mb-2 font-bold flex items-center gap-2">
                        <Palette className="w-4 h-4"/> Colors
                    </Typography>
                    <div className="grid grid-cols-4 gap-2">
                        {COLORS.map((c) => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-primary border-transparent' : 'border-gray-200'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </Box>

                 {/* Use Slider for Brush Size */}
                 <Box>
                    <Typography variant="subtitle2" className="mb-2 font-bold">Brush Size: {brushSize}px</Typography>
                    <Slider
                        value={brushSize}
                        onChange={(e, val) => setBrushSize(val)}
                        min={1}
                        max={50}
                        valueLabelDisplay="auto"
                    />
                 </Box>

                 <Button 
                    fullWidth 
                    variant="contained" 
                    color="success" 
                    onClick={downloadCanvas}
                    startIcon={<Download className="w-4 h-4"/>}
                 >
                    Download Art
                 </Button>
              </Box>
          </Paper>

          {/* Canvas Area */}
          <Paper className="lg:col-span-3 overflow-hidden border-2 border-dashed relative flex flex-col">
              <div className="flex-1 w-full h-full relative cursor-crosshair">
                   <canvas
                      ref={canvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="w-full h-full block touch-none"
                    />
              </div>
          </Paper>
        </Box>
      </Box>
    </GameWithRating>
  );
}
