import React from "react";
import {
  Gamepad2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { useState } from "react";
import { fetchAchievements } from "@/services/achievements.services";




function AchievementCard({ achievement }) {
  return (
    <Card id={achievement.game_id} className = "m-4">
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
