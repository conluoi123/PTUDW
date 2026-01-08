import { GameBoard } from '../GameBoard';
import { ArrowLeft, Settings, Volume2 } from 'lucide-react';

export function GamePlayPage({ onBack }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black py-8 px-4">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors border border-gray-700"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Games</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <button className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors border border-gray-700">
                            <Volume2 className="w-5 h-5" />
                        </button>
                        <button className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors border border-gray-700">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Game Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
                        Color Match Challenge
                    </h1>
                    <p className="text-gray-400">Match colors to score points and level up!</p>
                </div>
            </div>

            {/* Game Board */}
            <GameBoard rows={8} cols={8} />

            {/* Game Instructions */}
            <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <h3 className="text-white mb-3">How to Play</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-cyan-400">1</span>
                            </div>
                            <p>Click on any cell or use Left/Right buttons to navigate the grid</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-cyan-400">2</span>
                            </div>
                            <p>Select a color from the color palette below the board</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-cyan-400">3</span>
                            </div>
                            <p>Press ENTER to fill the selected cell with your chosen color</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-cyan-400">4</span>
                            </div>
                            <p>Use Back to clear a cell or Hint for helpful suggestions</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
