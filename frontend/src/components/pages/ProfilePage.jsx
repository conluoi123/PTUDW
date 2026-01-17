import {
  Mail,
  MapPin,
  Calendar,
  Edit2,
  Github,
  Linkedin,
  Twitter,
  Trophy,
  Zap,
  Star,
  Crown,
  Flame,
  Medal,
  TrendingUp,
  Gamepad2,
} from "lucide-react";
import { Button } from "@mui/material";
import { Card, CardContent } from "@mui/material";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "@mui/material";

export function ProfilePage({ user }) {
  const achievements = [
    {
      id: 1,
      name: "First Win",
      icon: Trophy,
      rarity: "Common",
      date: "2024-01-15",
    },
    {
      id: 2,
      name: "Speed Runner",
      icon: Zap,
      rarity: "Rare",
      date: "2024-02-20",
    },
    {
      id: 3,
      name: "Perfect Score",
      icon: Star,
      rarity: "Epic",
      date: "2024-03-10",
    },
    {
      id: 4,
      name: "Marathon",
      icon: Gamepad2,
      rarity: "Legendary",
      date: "2024-04-05",
    },
    {
      id: 5,
      name: "Social Star",
      icon: Star,
      rarity: "Rare",
      date: "2024-05-12",
    },
    {
      id: 6,
      name: "Champion",
      icon: Crown,
      rarity: "Legendary",
      date: "2024-06-01",
    },
  ];

  const stats = [
    { label: "Total Games", value: "342", icon: Gamepad2 },
    { label: "Win Rate", value: "68%", icon: TrendingUp },
    { label: "Best Streak", value: "12", icon: Flame },
    { label: "Rank", value: "#42", icon: Medal },
  ];

  // Default user data if not provided
  const displayUser = user || {
    name: "Guest User",
    email: "guest@example.com",
  };
  const userInitials = displayUser.name.substring(0, 2).toUpperCase();
  const username = `@${displayUser.name.toLowerCase().replace(/\s+/g, "")}`;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="mb-2">User Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your profile, friends, and achievements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          {/* Main Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-card"></div>
                </div>

                <h2 className="mb-1">{displayUser.name}</h2>
                <p className="text-sm text-muted-foreground mb-2">{username}</p>
                <Badge className="mb-4">Level 42 • Pro Gamer</Badge>

                <Button variant="outline" className="w-full">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              {/* Contact Info */}
              <div className="mt-6 space-y-3 text-sm border-t pt-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{displayUser.email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Joined March 2024</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-3">Connect</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Github className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Linkedin className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Twitter className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-all hover:scale-105"
                    >
                      <CardContent className="p-4">
                        <IconComponent className="w-6 h-6 mb-1 text-primary" />
                        <p className="text-xs text-muted-foreground mb-1">
                          {stat.label}
                        </p>
                        <p className="text-xl font-semibold">{stat.value}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Achievements & Friends */}
        <div className="lg:col-span-2 space-y-6">
          {/* Achievements Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Achievements
                </h3>
                <span className="text-sm text-muted-foreground">
                  {achievements.length} Unlocked
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {achievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <Card
                      key={achievement.id}
                      className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                      <CardContent className="p-4">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                          <IconComponent className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <p className="text-sm text-center mb-1 font-medium">
                          {achievement.name}
                        </p>
                        <div className="flex justify-center">
                          <Badge variant="secondary" className="text-xs">
                            {achievement.rarity}
                          </Badge>
                        </div>

                        {/* Tooltip */}
                        <div className="absolute inset-x-0 -top-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <Card className="mx-auto max-w-fit">
                            <CardContent className="p-3 text-center">
                              <p className="text-xs mb-1 font-medium">
                                {achievement.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Unlocked: {achievement.date}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
