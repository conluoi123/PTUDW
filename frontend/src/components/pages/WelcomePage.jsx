import { Gamepad2, Sun, Moon, CheckCircle2, ChevronRight, Zap, Trophy, Users, ArrowRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '@mui/material';
import { GameService } from '../../services/game.services.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Fallback images
const DEFAULT_IMAGES = [
    "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611195974226-a6a9be9dd90d?q=80&w=2600&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1628277613967-6ab5814525b9?q=80&w=3270&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop"
];

export function WelcomePage({onShowRegister}) {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const [games, setGames] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchGames = async () => {
            const res = await GameService.getAllGames();
            setGames(res?.data ?? []);
        };
        fetchGames();
    }, []);

    const getGameImg = (game, idx) => {
        if (game.config && game.config.image) return game.config.image;
        if (game.image) return game.image;
        return DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length];
    };

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f1115] text-gray-900 dark:text-white transition-colors duration-300 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
        {/* Animated Background Mesh */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Ẩn hoặc làm rất nhạt ở Light Mode để không bị ám màu */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] opacity-0 dark:opacity-100 transition-opacity" />
          <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] opacity-0 dark:opacity-100 transition-opacity" />
        </div>

        {/* Navigation Bar */}
        <header className="fixed top-0 inset-x-0 h-20 z-50 transition-all duration-300 backdrop-blur-md border-b border-gray-200/50 dark:border-white/5 bg-white/70 dark:bg-[#0f1115]/70">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-400">
                GameHub
              </span>
            </div>

            <div className="flex items-center gap-4">
              {toggleDarkMode && (
                <button
                  onClick={toggleDarkMode}
                  className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-all active:scale-95"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              )}
              <Button
                variant="text"
                className="hidden sm:flex font-semibold text-gray-600 dark:text-gray-300 hover:bg-transparent hover:text-indigo-600 dark:hover:text-white px-4"
                onClick={() => navigate("/login")}
              >
                Log in
              </Button>
              <Button
                variant="contained"
                className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-bold px-6 py-2.5 rounded-full shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
                onClick={onShowRegister}
              >
                Get Started
              </Button>
            </div>
          </div>
        </header>

        <main className="relative pt-32 pb-10 px-6 z-10">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto text-center mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-8 animate-fade-in-up">
              <Zap className="w-4 h-4 fill-current" />
              <span>Next Gen Gaming Platform</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-[1.1] text-gray-900 dark:text-white">
              Play. Compete. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                Conquer.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Chinh phục thử thách, leo bảng xếp hạng và khẳng định vị thế của
              bạn.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
              <button
                onClick={onShowRegister}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Start Playing Now
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-10 border-t border-gray-200/50 dark:border-white/5">
              {[
                { label: "Active Players", value: "10K+", icon: Users },
                { label: "Tournaments", value: "50+", icon: Trophy },
                { label: "Mini Games", value: "7+", icon: Gamepad2 },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <stat.icon className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                    {stat.value}
                  </span>
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ZIGZAG GAMES SECTION */}
          <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white">
                Featured Games
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                Bộ sưu tập trò chơi đa dạng, từ chiến thuật đến giải đố.
              </p>
            </div>

            {
              games.map((game, index) => {
                const isEven = index % 2 === 0;
                const config = game.config || {};
                const image = getGameImg(game, index);

                return (
                  <div
                    key={game.id}
                    className={`flex flex-col md:flex-row items-center gap-10 md:gap-20 ${!isEven ? "md:flex-row-reverse" : ""}`}
                  >
                    {/* Image Section */}
                    <div className="flex-1 w-full group perspective-1000">
                      <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10 dark:shadow-black/50 border border-gray-200 dark:border-white/10 transform transition-transform duration-700 group-hover:rotate-y-2 group-hover:scale-[1.02] bg-white dark:bg-gray-800">
                        <div className="aspect-[16/10]">
                          <img
                            src={image}
                            alt={game.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2671&auto=format&fit=crop";
                            }}
                          />
                        </div>
                      </div>
                      {/* Decorative Blob - Hidden in Light Mode */}
                      <div
                        className={`absolute -z-10 -top-10 -left-10 w-full h-full bg-gradient-to-r ${isEven ? "from-purple-500/10 to-pink-500/10" : "from-indigo-500/10 to-blue-500/10"} rounded-3xl blur-3xl transform scale-110 opacity-0 dark:opacity-40 transition-opacity`}
                      ></div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 space-y-6 text-center md:text-left">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wide border border-indigo-100 dark:border-indigo-500/20">
                        <Gamepad2 className="w-4 h-4" />
                        {config.tagline || "Popular"}
                      </div>

                      <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                        {game.name}
                      </h3>

                      <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        {game.description ||
                          "Trải nghiệm đỉnh cao. Thử thách bản thân và tranh tài cùng bạn bè."}
                      </p>

                      {/* Features */}
                      <div className="space-y-3 pt-2">
                        {(
                          config.howToPlay || [
                            "Challenge friends",
                            "Global leaderboard",
                          ]
                        )
                          .slice(0, 3)
                          .map((feature, i) => (
                            <div
                              key={i}
                              className={`flex items-center gap-3 text-gray-700 dark:text-gray-400 justify-center md:justify-start`}
                            >
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                      </div>

                      <div className="pt-6">
                        <button
                          onClick={onShowRegister}
                          className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-indigo-600 dark:hover:bg-gray-200 transition-all shadow-lg flex items-center gap-2 mx-auto md:mx-0 group"
                        >
                          Play now
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Footer simple */}
          <footer className="mt-8 border-t border-gray-200 dark:border-white/5 pt-8 pb-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © 2026 GameHub Platform. Built with passion for gamers.
            </p>
          </footer>
        </main>
      </div>
    );
}
