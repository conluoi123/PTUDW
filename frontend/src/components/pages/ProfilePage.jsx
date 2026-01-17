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
  Camera,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  TextField,
  DialogTitle,
  DialogActions,
  IconButton,
  Card,
  CardContent,
  Button,
  Badge,
  CircularProgress,
} from "@mui/material";
import { useState, useContext, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AuthContext } from "../../contexts/AuthContext";
import { profileApi } from "@/services/profile.services";
import { fetchAchievements } from "@/services/achievements.services";
export function ProfilePage() {
  const [achievements, setAchievements] = useState([]);
  const [loadingAchievements, setLoadingAchievements] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingAchievements(true);
        const data = await fetchAchievements();

        if (data) {
          setAchievements(data);
        }
      } catch (error) {
        console.error("Lỗi khi tải thành tích:", error);
      } finally {
        setLoadingAchievements(false);
      }
    };

    loadData();
  }, []);

  const [openEdit, setOpenEdit] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    avatar: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const { user, isLoading, updateUser } = useContext(AuthContext);
  if (isLoading || !user) {
    return null;
    }
    
  const stats = [
    { label: "Total Games", value: user?.total_game || 0, icon: Gamepad2 },
    { label: "Streak", value: user?.streak || 0, icon: Flame },
    { label: "Rank", value: user.rank !== "none" ? `#${user?.rank}` : "none", icon: Medal },
  ];
  const handleOpenEdit = () => {
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      avatar: user.avatar || "",
    });
    setAvatarPreview(user.avatar || "");
    setOpenEdit(true);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("Chưa chọn file");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File quá lớn. Vui lòng chọn file nhỏ hơn 5MB");
      return;
    }

    try {
      setIsUploading(true);

      const signatureRes = await profileApi.getSignature();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signatureRes.apiKey);
      formData.append("timestamp", signatureRes.timestamp);
      formData.append("signature", signatureRes.signature);
      formData.append("folder", "avatars");

      const data = await profileApi.uploadFile(
        formData,
        signatureRes.cloudName,
      );

      const avatarUrl = await profileApi.saveAvatar(
        user?.id || "",
        data.public_id,
      );

      setForm({ ...form, avatar: avatarUrl });
      setAvatarPreview(avatarUrl);
      updateUser({ avatar: avatarUrl });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Lỗi khi tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);

      await profileApi.updateProfile({ name: form.name, phone: form.phone });

      updateUser({
        name: form.name,
        phone: form.phone,
      });

      setOpenEdit(false);
      alert("Đã lưu thành công!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Lỗi khi lưu. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const displayUser = user;
  const userInitials = displayUser.name.substring(0, 2).toUpperCase();
console.log(user);
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
                  {displayUser.avatar ? (
                    <img
                      src={displayUser.avatar}
                      alt={displayUser.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <Avatar className="w-24 h-24">
                      <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-card"></div>
                </div>

                <h2 className="mb-1">{displayUser.name}</h2>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleOpenEdit}
                >
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
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6 pt-6 border-t">
                {/* <p className="text-sm text-muted-foreground mb-3">Connect</p>
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
                </div> */}
              </div>
            </CardContent>
          </Card>
          Stats Card
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

        {/* Right Column - Achievements */}
        <div className="lg:col-span-2 space-y-6">
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
                {loadingAchievements ? (
                  <p>Đang tải thành tích...</p>
                ) : (
                  achievements.map((achievement) => {
                    const IconComponent = Gamepad2;
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

                          {/* Tooltip */}
                          <div className="absolute inset-x-0 -top-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <Card className="mx-auto max-w-fit">
                              <CardContent className="p-3 text-center">
                                <p className="text-xs mb-1 font-medium">
                                  {achievement.name}
                                </p>
                                <p className="text-xs mb-1 font-medium">
                                  score: {achievement.score}
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            bgcolor: "background.paper",
          },
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <DialogTitle className="p-0 text-2xl font-bold dark:text-white">
            Edit Profile
          </DialogTitle>
          <IconButton
            onClick={() => setOpenEdit(false)}
            className="dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </IconButton>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center py-8 px-6 space-y-4">
          <div className="relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-28 h-28 rounded-full object-cover"
              />
            ) : (
              <Avatar className="w-28 h-28 text-3xl font-bold bg-gradient-to-br from-purple-500 to-pink-500">
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <CircularProgress size={32} className="text-white" />
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <Button
            variant="outlined"
            startIcon={<Camera className="w-4 h-4" />}
            onClick={handleAvatarClick}
            disabled={isUploading}
            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {isUploading ? "Đang tải..." : "Thay đổi ảnh đại diện"}
          </Button>
        </div>

        {/* Form */}
        <div className="px-6 pb-6 space-y-16">
          <TextField
            className="block"
            label="Name"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            sx={{
              display: "block",
              "& .MuiInputLabel-root": {
                color: "text.secondary",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "divider",
                },
              },
            }}
          />
          <TextField
            label="Phone"
            fullWidth
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            sx={{
              display: "block",
              "& .MuiInputLabel-root": {
                color: "text.secondary",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "divider",
                },
              },
            }}
          />
        </div>

        {/* Footer */}
        <DialogActions className="p-6 pt-4 border-t dark:border-gray-700 gap-3">
          <Button
            onClick={() => setOpenEdit(false)}
            className="dark:text-gray-300 dark:hover:bg-gray-700"
            disabled={isSaving}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveChanges}
            disabled={isSaving || isUploading}
            sx={{
              bgcolor: "#3b82f6",
              "&:hover": {
                bgcolor: "#2563eb",
              },
            }}
          >
            {isSaving ? (
              <>
                <CircularProgress size={16} className="mr-2" />
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
