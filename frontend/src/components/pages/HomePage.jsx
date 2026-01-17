import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Zap, 
  Crown, 
  Flame, 
  LayoutGrid, 
  Play,
  Gamepad2,
  Swords,
  MessageSquareQuote,
  Star
} from 'lucide-react';
import api from '@/services/service';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";
import { ratingService } from "@/services/rating.services";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
export const HomePage = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("Tất cả");
  const CATEGORIES = ["Tất cả", "Trí tuệ", "Chiến thuật", "Đối kháng", "Giải trí"];
  const { user } = useContext(AuthContext);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [gamesRes, ratingsData] = await Promise.all([
          api.get('/api/games'),
          ratingService.getListRating()
        ]);
        
        setGames(gamesRes.data.data || []);
        setRatings(ratingsData || []);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getGameImage = (game) => {
    if (game.config && game.config.image) return game.config.image;
    if (game.image) return game.image;
    const n = game.name?.toLowerCase() || '';
    if (n.includes('caro')) return "https://images.unsplash.com/photo-1611195974226-a6a9be9dd90d?q=80&w=2600&auto=format&fit=crop"; 
    if (n.includes('chess') || n.includes('cờ vua')) return "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2600&auto=format&fit=crop"; 
    return "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop";
  };


  if (!user) {
    console.log(user);
    return
  }
  return (
    <div className="space-y-8 animate-fade-in pb-10">
        {/* Loading Overlay */}
        {loading && (
            <LoadingOverlay 
                message="Loading Games" 
                description="Fetching available games and ratings..."
            />
        )}
        {/* GREETING HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-foreground">Chào, Gamer! 👋</h1>
                <p className="text-muted-foreground mt-1 text-lg">Hôm nay bạn muốn chinh phục thử thách nào?</p>
            </div>
        </div>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {[
                { 
                  label: 'Tổng game', 
                  value: games.length, 
                  image: 'https://png.pngtree.com/png-clipart/20250602/original/pngtree-pixel-art-level-up-emblem-game-asset-vector-png-image_21113452.png',
                  bg: 'bg-blue-500/10' 
                },
                { 
                  label: 'Đánh giá', 
                  value: ratings.length, 
                  image: 'https://cdn-icons-png.flaticon.com/512/5525/5525493.png',
                  bg: 'bg-emerald-500/10' 
                },
                { 
                  label: 'Người chơi', 
                  value: user?.name || 'Guest', 
                  image: 'https://img.pikbest.com/origin/10/42/58/14WpIkbEsTDMk.png!w700wp',
                  bg: 'bg-yellow-500/10' 
                },
             ].map((s, i) => (
                <Card key={i} className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <CardContent className="flex items-center gap-4 p-5">
                     <div className={`p-3 rounded-2xl bg-primary/5 ring-1 ring-primary/10`}>
                        <img src={s.image} alt={s.label} className="w-12 h-12 object-contain drop-shadow-sm" />
                     </div>
                     <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">{s.label}</p>
                        <p className="text-3xl font-black text-foreground">{s.value}</p>
                     </div>
                  </CardContent>
                </Card>
             ))}
        </div>

        {/* FEATURED CAROUSEL */}
        <section>
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                <p className="text-primary">Nổi bật tuần này</p>
              </h2>
          </div>

          <Carousel className="w-full" opts={{ align: "start", loop: true }}>
            <CarouselContent>
              {games.length > 0 ? games.map((game) => (
                <CarouselItem key={game.id} className="md:basis-1/2 lg:basis-2/3">
                  <div 
                    onClick={() => navigate(`/game/${game.id}`)}
                    className="p-1"
                  >
                    <div className="group relative h-[350px] rounded-3xl overflow-hidden cursor-pointer border border-slate-800 bg-slate-900 shadow-2xl transition-all hover:shadow-indigo-500/20 hover:border-indigo-500/50">
                       {/* Background Image */}
                       <div className="absolute inset-0">
                          <img 
                            src={getGameImage(game)} 
                            alt={game.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                       </div>
                       
                       <div className="relative h-full p-8 flex flex-col justify-end z-10">
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                             <div className="flex items-center gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                <span className="px-2.5 py-1 rounded-md bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                                  Featured
                                </span>
                             </div>
                             <h3 className="text-4xl font-black text-white mb-2 leading-tight drop-shadow-md">{game.name}</h3>
                             <p className="text-slate-300 line-clamp-2 max-w-lg text-lg mb-6 drop-shadow-sm">{game.tagline || game.description}</p>
                             
                             <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 duration-300">
                               <Play className="w-5 h-5 fill-current" /> Chơi Ngay
                             </button>
                          </div>
                       </div>
                    </div>
                  </div>
                </CarouselItem>
              )) : (
                 <CarouselItem className="basis-full">
                    <div className="h-64 rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 flex items-center justify-center text-slate-500">
                        Không có trò chơi nổi bật
                    </div>
                 </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 bg-slate-900/80 border-slate-700 text-white hover:bg-indigo-600 hover:border-indigo-600" />
            <CarouselNext className="hidden md:flex -right-4 bg-slate-900/80 border-slate-700 text-white hover:bg-indigo-600 hover:border-indigo-600" />
          </Carousel>
        </section>

        {/* ALL GAMES GRID */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-indigo-500" /> 
                  Kho game
              </h3>
              
              {/* Category Chips */}
              <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                      <button
                          key={cat}
                          onClick={() => setActiveTab(cat)}
                          className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                              activeTab === cat 
                              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          }`}
                      >
                          {cat}
                      </button>
                  ))}
              </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {games.map((game) => (
                <div 
                  key={game.id} 
                  onClick={() => navigate(`/game/${game.id}`)}
                  className="group bg-slate-900 rounded-2xl border border-slate-800 hover:border-indigo-500/50 overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                   {/* Card Image */}
                   <div className="aspect-[16/9] bg-slate-950 relative overflow-hidden">
                      <img 
                        src={getGameImage(game)} 
                        alt={game.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                   </div>
                   
                   <div className="p-4">
                     <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold text-white text-base truncate flex-1 pr-2 group-hover:text-indigo-400 transition-colors">{game.name}</h4>
                       <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">LIVE</span>
                     </div>
                     <p className="text-xs text-slate-500 line-clamp-2">{game.description}</p>
                   </div>
                </div>
              ))}
          </div>
        </section>

        {/* RECENT REVIEWS SECTION */}
        <section className="pt-8 border-t border-border/40">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-pink-500" />
                Đánh giá gần đây
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
                {ratings && ratings.length > 0 ? (
                    ratings.map((rating) => {
                        // Helper to get relative time
                        const getRelativeTime = (dateString) => {
                            if (!dateString) return 'Vừa xong';
                            const now = new Date();
                            const past = new Date(dateString);
                            const diffMs = now - past;
                            const diffMins = Math.floor(diffMs / 60000);
                            const diffHours = Math.floor(diffMs / 3600000);
                            const diffDays = Math.floor(diffMs / 86400000);
                            
                            if (diffMins < 60) return `${diffMins} phút trước`;
                            if (diffHours < 24) return `${diffHours} giờ trước`;
                            return `${diffDays} ngày trước`;
                        };

                        // Generate avatar
                        const avatarUrl = rating.user_avatar || 
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${rating.user_username || rating.user_name}`;

                        return (
                            <div key={rating.id} className="bg-card border border-border/50 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
                                            <img src={avatarUrl} alt={rating.user_name} className="w-full h-full" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-foreground">{rating.user_name || rating.user_username}</p>
                                            <p className="text-xs text-muted-foreground">{getRelativeTime(rating.created_at)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                                            {rating.point.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="mb-2">
                                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                        {rating.game_name}
                                    </span>
                                </div>
                                
                                <p className="text-sm text-muted-foreground italic">
                                    "{rating.comment || 'Không có bình luận'}"
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <MessageSquareQuote className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Chưa có đánh giá nào</p>
                    </div>
                )}
            </div>
        </section>
    </div>
  );
};