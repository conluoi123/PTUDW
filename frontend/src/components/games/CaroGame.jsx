import { GameBoard } from '../GameBoard';

export function CaroGame({ onBack, winCondition }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-950">
            <div className="w-full max-w-4xl mb-6 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                    Back to Games
                </button>
                <h1 className="text-2xl font-bold text-white">Caro (First to {winCondition})</h1>
                <div className="w-[100px]"></div> {/* Spacer */}
            </div>
            <GameBoard rows={15} cols={15} />
        </div>
    );
}
