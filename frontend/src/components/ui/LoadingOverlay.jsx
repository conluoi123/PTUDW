export function LoadingOverlay({ message = "Loading...", description = "Please wait while we fetch your data" }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-card dark:bg-card border border-border dark:border-border rounded-2xl p-8 shadow-2xl">
                <div className="flex flex-col items-center gap-4">
                    {/* Spinner */}
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    {/* Text */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {message}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
