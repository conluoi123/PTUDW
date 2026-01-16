import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Gamepad2,
  Shield,
  Zap,
  ArrowLeft,
  Phone,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";
import Google from "@mui/icons-material/Google";
import { userApi } from "@/services/userApi.services";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function RegisterPage({ onSwitchToLogin, onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const validateForm = () => {
    const newErrors = {};

    if (!name) {
      newErrors.name = "Name is required";
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }
    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(0|\+84)[0-9]{9}$/.test(phone)) {
      newErrors.phone = "Phone number is invalid";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      await userApi.register({
        name,
        username: email,
        password,
        role: "user",
        email,
        phone,
      });

      toast.success("Create account successfully", {
        closeButton: true,
        duration: 3000,
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
      const status = error?.response?.status;
      if (status === 400) {
        toast.error("Register failed. Email is exists", {
          closeButton: true,
          duration: 3000,
        });
      }
      if (status === 500) {
        toast.error("Register failed. Server error", {
          closeButton: true,
          duration: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2)
      return { strength: 33, label: "Weak", color: "bg-red-500" };
    if (strength <= 3)
      return { strength: 66, label: "Medium", color: "bg-yellow-500" };
    return { strength: 100, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500 via-pink-600 to-orange-700 opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-700 opacity-10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-gray-700/50 shadow-2xl">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30 animate-pulse">
              <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-orange-600 bg-clip-text text-transparent mb-2">
              Join the Game
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Create your account and start playing
            </p>
          </div>

          {/* Quick Register Options */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            <button className="group relative overflow-hidden bg-gradient-to-br from-gray-700/60 to-gray-800/60 hover:from-gray-600/70 hover:to-gray-700/70 border border-gray-600/50 hover:border-gray-500 rounded-xl p-3 transition-all hover:scale-105 active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center justify-center gap-2 text-sm font-medium text-gray-300">
                <Google className="w-4 h-4" />
                <span>Google</span>
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card/80 px-3 py-1 rounded-full text-gray-400 font-medium">
                Or register with email
              </span>
            </div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`pl-11 pr-4 h-11 bg-input border-border focus-visible:border-purple-500 focus-visible:ring-purple-500/20 ${
                    errors.name
                      ? "border-red-500 focus-visible:border-red-500"
                      : ""
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1.5 animate-in slide-in-from-top duration-200">
                  {errors.name}
                </p>
              )}
            </div>
            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <Input
                  type="tel"
                  placeholder="0912345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`pl-11 pr-4 h-11 bg-input border-border focus-visible:border-purple-500 focus-visible:ring-purple-500/20 ${
                    errors.phone
                      ? "border-red-500 focus-visible:border-red-500"
                      : ""
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1.5 animate-in slide-in-from-top duration-200">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Email Input */}
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
                  className={`pl-11 pr-4 h-11 bg-input border-border focus-visible:border-purple-500 focus-visible:ring-purple-500/20 ${
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

            {/* Password Input */}
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
                  className={`pl-11 pr-12 h-11 bg-input border-border focus-visible:border-purple-500 focus-visible:ring-purple-500/20 ${
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
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">Password strength:</span>
                    <span
                      className={`font-medium ${
                        passwordStrength.label === "Weak"
                          ? "text-red-400"
                          : passwordStrength.label === "Medium"
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5 animate-in slide-in-from-top duration-200">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-11 pr-12 h-11 bg-input border-border focus-visible:border-purple-500 focus-visible:ring-purple-500/20 ${
                    errors.confirmPassword
                      ? "border-red-500 focus-visible:border-red-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1.5 animate-in slide-in-from-top duration-200">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-border bg-input text-purple-500 focus:ring-purple-500/20"
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-purple-400 hover:text-purple-300 font-medium"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-purple-400 hover:text-purple-300 font-medium"
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-400 text-xs mt-1.5 animate-in slide-in-from-top duration-200">
                  {errors.terms}
                </p>
              )}
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link to="/login">
                <button
                  onClick={onSwitchToLogin}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                >
                  Login Here
                </button>
              </Link>
            </p>
          </div>

          {/* Back to Home */}
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
