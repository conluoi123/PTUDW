import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Gamepad2,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";
import Google from "@mui/icons-material/Google";
import { userApi } from "@/services/userApi.services";
//npm install @mui/material @emotion/react @emotion/styled
//npm install @mui/icons-material
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/service";
export function LoginPage({ onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate()
  const validateForm = () => {
    const newErrors = {};
    setErrors("");
    setServerError("");
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const data = await userApi.login({
        username: email,
        password,
      });
      const total_game = await api.get("/api/user/totalGame");
      const rank = await api.get("/api/user/rank");
      if (data)
      login({
        id: data.userInfo.id,
        email: data.userInfo.email,
        name: data.userInfo.name,
        avatar: data.userInfo.avatar,
        phone: data.userInfo.phone,
        username: data.userInfo.username,
        role: data.userInfo.role,
        streak: data.userInfo.streak,
        created_at: data.userInfo.created_at,
        rank: rank?.data?.rank?.ranking || "none",
        total_game: total_game?.data?.totalGame || 0,
      });
      
      console.log("Login success:", data);
      navigate("/home")
    } catch (error) {
      console.error("Login failed:", error);
      const status = error?.response?.status;

      if (status === 400) {
        setServerError("Missing required fields");
      } else if (status === 401) {
        setServerError("Password is incorrect");
      } else if (status === 404) {
        setServerError("User not found");
      } else {
        setServerError("Internal server error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginOutside = async () => {
    try {
      userApi.outsideLogin();
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-700 opacity-10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-gray-700/50 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30 animate-pulse">
              <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Login to continue your gaming journey
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-6">
            <button
              onClick={handleLoginOutside}
              className="group relative overflow-hidden bg-gradient-to-br from-gray-700/60 to-gray-800/60 hover:from-gray-600/70 hover:to-gray-700/70 border border-gray-600/50 hover:border-gray-500 rounded-xl p-3 transition-all hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center justify-center gap-2 text-sm font-medium text-gray-300">
                <Google className="w-4 h-4" />
                <span>Google</span>
              </div>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card/80 px-3 py-1 rounded-full text-gray-400 font-medium">
                Or continue with email
              </span>
            </div>
          </div>
          {serverError && (
            <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-in slide-in-from-top">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-11 pr-4 h-12 bg-input border-border focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20 ${
                    errors.email
                      ? "border-red-500 focus-visible:border-red-500"
                      : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5 animate-in slide-in-from-top duration-200">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-11 pr-12 h-12 bg-input border-border focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20 ${
                    errors.password
                      ? "border-red-500 focus-visible:border-red-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5 animate-in slide-in-from-top duration-200">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-input text-cyan-500 focus:ring-cyan-500/20"
                />
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login to Play"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                Create Account
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/">
              <button
                onClick={onBack}
                className="text-gray-500 hover:text-gray-400 text-sm font-medium transition-colors flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
