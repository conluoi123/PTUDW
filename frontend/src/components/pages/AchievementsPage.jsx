import React from "react";
import { Gamepad2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useState } from "react";
import { fetchAchievements } from "@/services/achievements.services";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
// TODO : Phải đổi backend có userId để có thể lấy achievements của user đó
export function AchievementsPage() {
  const [achievementsRepo, setAchievementsRepo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    try {
      const fetchData = async () => {
        const data = await fetchAchievements();
        if (data) {
          setAchievementsRepo(data);
          setIsLoading(false);
        }
      };
      fetchData();
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
    return () => {
      setIsLoading(true);
      setAchievementsRepo([]);
    };
  }, []);
  if (achievementsRepo.length == 0) {
    return (
      <div className="text-center p-10">
        <p>You haven't unlocked any achievements yet.</p>
        <p>Play a game to get started!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fadeIn">
      {isLoading && (
        <LoadingOverlay 
            message="Loading Achievements" 
        />
    )}
      <div>
        <h1 className="mb-2 text-2xl font-bold">Achievements</h1>
        <p className="text-muted-foreground">
          Track your progress and unlock rewards
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          {achievementsRepo.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AchievementCard({ achievement }) {
  return (
    <Card id={achievement.game_id} className="m-4">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon Section */}
          <div>
            <Gamepad2 className="w-8 h-8" />
          </div>
          {/* Content Section */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold">{achievement.name}</h3>
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="font-medium bg-secondary px-2 py-1 rounded">
                Score: {achievement.score}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}