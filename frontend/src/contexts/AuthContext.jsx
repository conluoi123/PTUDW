import { createContext, useState, useEffect } from "react";
import api, { setLogoutHandler } from "@/services/service";

const AuthContext = createContext(undefined);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogout, setIsLogout] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        await refreshUser();
      } catch (err) {
        console.log("User not authenticated: ", err);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    setLogoutHandler(() => {
      logout();
    });
  }, []);

  const login = (userData) => {
    setIsLogout(false);
    localStorage.setItem("userId", userData.id);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post("/api/user/logout");
    } catch (error) {
      console.error("Xóa cookie không thành công", error);
    } finally {
      setUser(null);
      setIsLoading(false);
      setIsLogout(true);
    }
  };

  const updateUser = (userData) => {
    if (!user) return;
    setUser({ ...user, ...userData });
  };

  const refreshUser = async () => {
    try {
      const res = await api.get("/api/user/me");
      const { userId, email, name, avatar } = res.data.data;

      setUser({
        id: userId,
        email,
        name,
        avatar,
      });
    } catch (err) {
      console.log("refresh user failed");
      throw err;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    refreshUser,
    isLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
