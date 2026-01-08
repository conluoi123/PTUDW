import { Gamepad2, Grid3x3, Grid2x2, X, Candy, Worm, Sparkles, Moon, Sun, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export function WelcomePage({ onShowLogin, onShowRegister, onViewGames }) {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const games = [
        {
            id: 'caro5',
            name: 'Caro (5 in a row)',
            icon: Grid3x3,
            tagline: 'Classic Gomoku Strategy Game',
            description: 'Trò chơi cờ caro truyền thống với luật 5 quân liên tiếp. Hai người chơi lần lượt đặt quân trên bàn cờ, người đầu tiên tạo được 5 quân liên tiếp theo hàng ngang, dọc hoặc chéo sẽ chiến thắng.',
            howToPlay: [
                'Lần lượt đặt quân X hoặc O lên bàn cờ',
                'Mục tiêu: Tạo 5 quân liên tiếp theo hàng ngang, dọc hoặc chéo',
                'Người chơi đầu tiên đạt được mục tiêu sẽ thắng',
                'Nếu bàn cờ đầy mà không ai thắng thì trận đấu hòa'
            ],
            bgColor: 'bg-blue-500/10',
            iconColor: 'text-blue-500',
            borderColor: 'border-blue-500/20'
        },
        {
            id: 'caro4',
            name: 'Caro (4 in a row)',
            icon: Grid2x2,
            tagline: 'Fast-Paced Connect Four',
            description: 'Phiên bản nhanh hơn của cờ caro với luật 4 quân liên tiếp. Trò chơi diễn ra trên bàn cờ nhỏ hơn, tạo nên những ván đấu kịch tính và nhanh chóng.',
            howToPlay: [
                'Đặt quân lần lượt trên bàn cờ nhỏ gọn',
                'Mục tiêu: Tạo 4 quân liên tiếp',
                'Bàn cờ nhỏ hơn tạo ra tốc độ chơi nhanh hơn',
                'Yêu cầu chiến thuật và tư duy nhanh nhạy'
            ],
            bgColor: 'bg-purple-500/10',
            iconColor: 'text-purple-500',
            borderColor: 'border-purple-500/20'
        },
        {
            id: 'tictactoe',
            name: 'Tic Tac Toe',
            icon: X,
            tagline: 'Timeless Classic Game',
            description: 'Trò chơi O-X kinh điển trên bàn cờ 3x3. Đơn giản nhưng đầy thú vị, phù hợp cho mọi lứa tuổi. Một trò chơi hoàn hảo để thư giãn và rèn luyện tư duy logic.',
            howToPlay: [
                'Bàn cờ 3x3 với 2 người chơi',
                'Lần lượt đặt dấu X hoặc O vào ô trống',
                'Người đầu tiên có 3 dấu liên tiếp sẽ thắng',
                'Trò chơi đơn giản nhưng đầy chiến thuật'
            ],
            bgColor: 'bg-green-500/10',
            iconColor: 'text-green-500',
            borderColor: 'border-green-500/20'
        },
        {
            id: 'candycrush',
            name: 'Candy Crush',
            icon: Candy,
            tagline: 'Sweet Match-3 Puzzle',
            description: 'Trò chơi xếp hình match-3 đầy màu sắc. Hoán đổi các viên kẹo để tạo thành hàng 3 kẹo cùng màu trở lên. Càng nhiều kẹo được ghép, điểm số càng cao!',
            howToPlay: [
                'Hoán đổi 2 viên kẹo kề nhau',
                'Tạo hàng 3 kẹo cùng màu để xóa chúng',
                'Ghép 4-5 kẹo tạo ra combo đặc biệt',
                'Đạt điểm số cao nhất trong thời gian giới hạn'
            ],
            bgColor: 'bg-pink-500/10',
            iconColor: 'text-pink-500',
            borderColor: 'border-pink-500/20'
        },
        {
            id: 'snake',
            name: 'Snake Game',
            icon: Worm,
            tagline: 'Retro Arcade Challenge',
            description: 'Trò chơi rắn săn mồi huyền thoại. Điều khiển con rắn ăn thức ăn để lớn dần lên, nhưng đừng để đầu rắn chạm vào thân hoặc tường. Thử thách phản xạ và kỹ năng của bạn!',
            howToPlay: [
                'Dùng phím mũi tên để điều khiển rắn',
                'Ăn thức ăn để tăng độ dài',
                'Tránh đâm vào tường hoặc thân rắn',
                'Cố gắng đạt điểm số cao nhất'
            ],
            bgColor: 'bg-emerald-500/10',
            iconColor: 'text-emerald-500',
            borderColor: 'border-emerald-500/20'
        }
    ];

    return (
        <div className="min-h-screen flex flex-col mt-16">
            {/* Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-card/98 via-card/95 to-card/98 backdrop-blur-xl border-b border-border/50 z-40 shadow-lg shadow-primary/5">
                <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 max-w-screen-2xl mx-auto">
                    {/* Logo */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                            <Gamepad2 className="text-primary-foreground w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <h1 className="text-sm sm:text-base font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Game Hub</h1>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {/* Dark Mode Toggle */}
                        {toggleDarkMode && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 h-9 w-9 hover:bg-primary/10 transition-colors"
                                onClick={toggleDarkMode}
                                aria-label="Toggle dark mode"
                            >
                                {isDarkMode ? (
                                    <Sun className="w-5 h-5 text-yellow-500 hover:text-yellow-400" />
                                ) : (
                                    <Moon className="w-5 h-5 text-primary hover:text-primary/80" />
                                )}
                            </Button>
                        )}

                        {/* Login Button */}
                        <Button
                            variant="ghost"
                            className="h-9 px-3 sm:px-4 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-all border border-transparent hover:border-primary/20"
                            onClick={onShowLogin}
                        >
                            Đăng nhập
                        </Button>

                        {/* Register Button */}
                        <Button
                            variant="ghost"
                            className="h-9 px-3 sm:px-4 text-sm font-bold text-primary-foreground bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all border-0"
                            onClick={onShowRegister}
                        >
                            Đăng ký
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 px-4 py-8 sm:py-12 pt-24">
                <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
                    {/* Hero Section */}
                    <div className="text-center animate-in fade-in zoom-in duration-700">
                        {/* Logo */}
                        <div className="relative inline-flex mb-6 sm:mb-8">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 border-2 border-primary/20 transform hover:scale-105 transition-all">
                                <Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-primary-foreground" />
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6">
                            <span className="text-foreground">
                                Welcome to
                            </span>
                            <br />
                            <span className="text-primary">
                                Game Hub
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
                            Khám phá 5 mini games thú vị với gameplay đơn giản nhưng đầy thách thức.
                            Đăng ký ngay để bắt đầu chơi!
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 text-primary-foreground sm:text-lg font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105 active:scale-95 border-0"
                                onClick={onShowRegister}
                            >
                                <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                                Đăng ký ngay
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                                onClick={onShowLogin}
                            >
                                Đã có tài khoản? Đăng nhập
                            </Button>
                        </div>
                    </div>

                    {/* Games Showcase */}
                    <div className="space-y-12 sm:space-y-16">
                        <div className="text-center mb-8 sm:mb-12">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                                Khám phá các trò chơi
                            </h2>
                            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                                5 mini games với gameplay độc đáo, từ classic đến hiện đại
                            </p>
                        </div>

                        {games.map((game, index) => {
                            const Icon = game.icon;
                            const isEven = index % 2 === 0;

                            return (
                                <div
                                    key={game.id}
                                    className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center animate-in fade-in duration-700`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Game Icon/Visual */}
                                    <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                                        <Card className={`border-2 ${game.borderColor} overflow-hidden`}>
                                            <CardContent className={`${game.bgColor} p-12 sm:p-16 lg:p-20 flex items-center justify-center`}>
                                                <Icon className={`w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 ${game.iconColor}`} strokeWidth={1.5} />
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Game Info */}
                                    <div className={`space-y-4 sm:space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                                        <div>
                                            <p className={`text-sm sm:text-base font-semibold mb-2 ${game.iconColor}`}>
                                                {game.tagline}
                                            </p>
                                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                                                {game.name}
                                            </h3>
                                            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                                                {game.description}
                                            </p>
                                        </div>

                                        {/* How to Play */}
                                        <div>
                                            <h4 className="text-base sm:text-lg font-bold mb-3">Cách chơi:</h4>
                                            <ul className="space-y-2">
                                                {game.howToPlay.map((step, stepIndex) => (
                                                    <li key={stepIndex} className="flex items-start gap-2 sm:gap-3">
                                                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${game.iconColor}`} />
                                                        <span className="text-sm sm:text-base text-muted-foreground">{step}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* CTA */}
                                        <Button
                                            size="lg"
                                            className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-md hover:shadow-lg hover:scale-105 transition-all"
                                            onClick={onShowRegister}
                                        >
                                            Chơi ngay
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Final CTA */}
                    <div className="text-center py-12 sm:py-16 animate-in fade-in duration-1000 delay-500">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                            Sẵn sàng bắt đầu?
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
                            Tạo tài khoản miễn phí để trải nghiệm toàn bộ 5 mini games và cạnh tranh với người chơi khác!
                        </p>
                        <Button
                            size="lg"
                            className="h-12 sm:h-14 px-8 sm:px-12 text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                            onClick={onShowRegister}
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Tạo tài khoản miễn phí
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
