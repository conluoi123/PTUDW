export function LoadingOverlay({ message = "Loading...", description = "" }) {
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md z-50 flex items-center justify-center animate-in fade-in duration-300">
            <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl animate-pulse"></div>
                
                {/* Card */}
                <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-10 shadow-2xl">
                    <div className="flex flex-col items-center gap-6">
                        {/* Modern Spinner with gradient */}
                        <div className="relative w-20 h-20">
                            {/* Outer ring - gradient */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-20"></div>
                            
                            {/* Spinning gradient ring */}
                            <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 animate-spin"
                                 style={{ 
                                     maskImage: 'linear-gradient(transparent 50%, black 50%)',
                                     WebkitMaskImage: 'linear-gradient(transparent 50%, black 50%)'
                                 }}>
                            </div>
                            
                            {/* Inner spinning circle */}
                            <div className="absolute inset-2 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"
                                 style={{ animationDuration: '1s' }}>
                            </div>
                            
                            {/* Center dot */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                            </div>
                        </div>

                        {/* Text */}
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                                {message}
                            </h3>
                            
                            {/* Animated dots */}
                            <div className="flex items-center justify-center gap-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {description}
                                </p>
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                            
                            {/* Progress bar */}
                            <div className="w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse rounded-full"
                                     style={{ 
                                         animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s linear infinite',
                                         backgroundSize: '200% 100%'
                                     }}>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </div>
    );
}
