import { ArrowLeft, Volume2, Settings, RotateCcw, VolumeX, Zap, Star } from 'lucide-react';
import { ReactNode, memo, useState } from 'react';



export function GamePlayContainer({
    gameName,
    score,
    time,
    onBack,
    onReset,
    children,
    statusInfo,
}) {
    const [isMuted, setIsMuted] = useState(false);

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/5 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-primary/5 blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 animate-in fade-in duration-500">
                <div className="max-w-7xl mx-auto">
                    {/* Header Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <button
                            onClick={onBack}
                            className="group relative px-4 sm:px-5 py-2.5 sm:py-3 bg-card hover:bg-accent rounded-xl transition-all border shadow-lg hover:shadow-xl active:scale-95 backdrop-blur-md"
                        >
                            <div className="relative flex items-center justify-center sm:justify-start gap-2">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-semibold text-sm sm:text-base">Back to Games</span>
                            </div>
                        </button>

                        <div className="flex items-center gap-2">
                            {onReset && (
                                <button
                                    onClick={onReset}
                                    className="group relative flex-1 sm:flex-none p-2.5 sm:p-3.5 bg-green-500/10 hover:bg-green-500/20 rounded-xl text-green-500 hover:text-green-400 transition-all border border-green-500/30 hover:border-green-500/50 shadow-lg active:scale-95"
                                    title="Reset Game"
                                >
                                    <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
                                </button>
                            )}
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className={`group relative flex-1 sm:flex-none p-2.5 sm:p-3.5 rounded-xl transition-all border shadow-lg active:scale-95 ${isMuted
                                    ? 'bg-muted border-border text-muted-foreground'
                                    : 'bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30 hover:border-yellow-500/50 text-yellow-500 hover:text-yellow-400'
                                    }`}
                                title={isMuted ? "Unmute" : "Mute"}
                            >
                                {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                            </button>
                            <button
                                className="group relative flex-1 sm:flex-none p-2.5 sm:p-3.5 bg-primary/10 hover:bg-primary/20 rounded-xl text-primary hover:text-primary/80 transition-all border border-primary/30 hover:border-primary/50 shadow-lg active:scale-95"
                                title="Settings"
                            >
                                <Settings className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>

                    {/* Game Title & Status Bar */}
                    <div className="relative bg-card/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border shadow-2xl mb-4 sm:mb-6 backdrop-blur-xl overflow-hidden animate-in slide-in-from-top duration-700">
                        {/* Glow effect */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 blur-3xl rounded-full"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-foreground animate-in slide-in-from-left duration-700 flex items-center gap-2 sm:gap-3">
                                    <Zap className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-yellow-500 animate-pulse flex-shrink-0" />
                                    <span className="truncate">{gameName}</span>
                                </h1>
                            </div>

                            {/* Status Info */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                                <div className="group relative bg-primary/5 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-primary/20 hover:border-primary/40 transition-all hover:scale-105 backdrop-blur-sm">
                                    <Star className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 text-primary/30 group-hover:text-primary/60 transition-colors" />
                                    <p className="relative text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2 font-medium uppercase tracking-wider">Score</p>
                                    <p className="relative text-2xl sm:text-3xl lg:text-4xl font-black text-foreground">{score.toLocaleString()}</p>
                                </div>

                                {time && (
                                    <div className="group relative bg-purple-500/5 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-105 backdrop-blur-sm">
                                        <Zap className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 text-purple-500/30 group-hover:text-purple-500/60 transition-colors" />
                                        <p className="relative text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2 font-medium uppercase tracking-wider">Time</p>
                                        <p className="relative text-2xl sm:text-3xl lg:text-4xl font-black text-foreground">{time}</p>
                                    </div>
                                )}

                                {statusInfo}
                            </div>
                        </div>
                    </div>

                    {/* Game Board Container */}
                    <div className="relative bg-card/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-700">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}