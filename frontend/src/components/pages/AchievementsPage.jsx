import React, { useEffect, useState } from "react";
import {
  Trophy,
  Medal,
  Star,
  Search,
  Lock,
  Unlock,
  Crown,
  Zap
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchAchievements } from "@/services/achievements.services";

// TODO : Phải đổi backend có userId để có thể lấy achievements của user đó
export function AchievementsPage() {
  const [achievementsRepo, setAchievementsRepo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    try {
      const fetchData = async () => {
        const data = await fetchAchievements();
        setAchievementsRepo(data || []); // Ensure array fallback
        setIsLoading(false);
      }; 
      fetchData();
    } catch (error) {
      console.error("Error fetching achievements:", error);
      setIsLoading(false);
    }
  }, []);
  console.log(achievementsRepo);
  // Filter achievements
  const filteredAchievements = achievementsRepo.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock stats (Calculate real stats later)
  const totalScore = achievementsRepo.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const unlockedCount = Math.floor(achievementsRepo.length * 0.4); // Mock 40% unlocked

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground animate-pulse">Loading glorious achievements...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
        <div>
           <div className="flex items-center gap-4 mb-3">
                <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-lg border-2 border-yellow-500/20">
                    <img 
                        src="https://i.pinimg.com/1200x/57/a9/d4/57a9d43e96729ef4ad5e4c79885d79cd.jpg" 
                        alt="Trophy" 
                        className="w-full h-full object-cover" 
                    />
                </div>
                <h1 className="text-4xl font-black tracking-tight text-foreground">Thành Tích</h1>
           </div>
           <p className="text-muted-foreground text-lg max-w-2xl">
              Chinh phục các thử thách, mở khóa huy hiệu và khẳng định đẳng cấp của bạn trong thế giới GameHub.
           </p>
        </div>

        {/* SUMMARY STATS CARDS */}
        <div className="flex gap-4">
            <div className="bg-card border border-border/50 p-4 rounded-2xl shadow-sm min-w-[140px]">
                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Tổng điểm</p>
                <p className="text-2xl font-black text-primary flex items-center gap-2">
                    {totalScore}
                    <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </p>
            </div>
            <div className="bg-card border border-border/50 p-4 rounded-2xl shadow-sm min-w-[140px]">
                <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Huy chương vàng</p>
                <p className="text-2xl font-black text-yellow-500 flex items-center gap-2">
                    {achievementsRepo.length}
                    <Trophy className="w-4 h-4 fill-current" />
                </p>
            </div>
        </div>
      </div>

      {/* SEARCH FILTER */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
            placeholder="Tìm kiếm thành tích..." 
            className="pl-10 h-11 bg-background/50 backdrop-blur-sm border-border/60 focus:bg-background transition-all rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ACHIEVEMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredAchievements.length > 0 ? (
           filteredAchievements.map((achievement, index) => (
             <AchievementCard key={achievement.id || index} achievement={achievement} index={index} />
           ))
        ) : (
            <div className="col-span-full py-20 text-center text-muted-foreground bg-secondary/20 rounded-3xl border border-dashed border-border/50">
                Không tìm thấy thành tích nào phù hợp.
            </div>
        )}
      </div>
    </div>
  );
}

// 3D Assets (User provided)
const IMG_UNLOCKED = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7PVkx0zkRckG39ISHe4lZVFS5HICoatl9qw&s";
const IMG_LOCKED = "https://img.freepik.com/premium-vector/award-golden-padlock-game-icon-block-security_172107-2761.jpg";

function AchievementCard({ achievement, index }) {
  // Since API /me only returns unlocked achievements, everything here is unlocked!
  
  return (
    <Card className="group relative overflow-hidden border transition-all duration-300 bg-card border-yellow-500/20 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10 hover:-translate-y-1">
      
      {/* Background Glow Effect */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-[50px] group-hover:bg-yellow-500/20 transition-all pointer-events-none" />

      <CardContent className="p-5 flex flex-col h-full relative z-10">
        <div className="flex justify-between items-start mb-4">
            {/* Image Box */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md ring-2 ring-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
               <img 
                 src={IMG_UNLOCKED} 
                 alt="Achievement Icon" 
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
               />
            </div>

            {/* Score Badge */}
            <div className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono tracking-tight flex items-center gap-1 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20">
                +{achievement.score}
                <Star className="w-3 h-3 fill-current" />
            </div>
        </div>

        {/* Text Content */}
        <div className="flex-1">
            <h3 className="font-bold text-lg mb-1 line-clamp-1 text-foreground">
                {achievement.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {achievement.description || "Bạn đã xuất sắc hoàn thành thử thách này!"}
            </p>
        </div>

        {/* Footer Info */}
        <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
            <span className="text-green-600 dark:text-green-500 font-bold flex items-center gap-1.5">
                <CheckCircleIcon size={12} /> Đã sở hữu
            </span>
            <span className="opacity-70 bg-secondary px-1.5 py-0.5 rounded">Game #{achievement.game_id}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper icon component
function CheckCircleIcon({ size = 14, className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    );
}
