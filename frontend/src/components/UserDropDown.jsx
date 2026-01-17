import { LogOut, Settings, UserCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export function UserDropdown({
  isOpen,
  onClose,
  user,
  onProfile,
  onSettings,
  onLogout,
}) {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-64 z-50 animate-in fade-in zoom-in duration-200"
    >
      <Card className="border-2 shadow-xl">
        <CardContent className="p-0">
          {/* User Info Header */}
          <div className="p-4 border-b bg-accent/30">
            <div className="flex items-center gap-3">
              <Avatar
                className="w-9 h-9 cursor-pointer ring-2 ring-indigo-500/20 hover:ring-indigo-500 transition-all"
                //   onClick={handleUserClick}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-[40px] h-[40px] rounded-full object-cover"
                />
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <Button
              variant="ghost"
              className="w-full justify-start h-10 px-3 text-sm font-medium hover:bg-accent"
              onClick={() => {
                //   onProfile();
                //     onClose();
                navigate("/profile");
              }}
            >
              <UserCircle className="w-4 h-4 mr-3" />
              Trang cá nhân
            </Button>

            <div className="h-px bg-border my-2" />
            <Button
              variant="ghost"
              className="w-full justify-start h-10 px-3 text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Đăng xuất
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
