import { 
  TextField as MuiTextField,
  FormControl,
  FormHelperText,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

/**
 * Enhanced TextField component kết hợp MUI với validation
 * Hỗ trợ password toggle, icons, và error handling
 */
export function TextField({ 
  type = 'text',
  icon: Icon,
  error,
  helperText,
  showPasswordToggle = false,
  className = '',
  ...props 
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' && showPasswordToggle
    ? (showPassword ? 'text' : 'password')
    : type;

  return (
    <FormControl fullWidth error={!!error} className={className}>
      <MuiTextField
        type={inputType}
        error={!!error}
        helperText={helperText || error}
        InputProps={{
          startAdornment: Icon ? (
            <InputAdornment position="start">
              <Icon className="text-gray-400 w-5 h-5" />
            </InputAdornment>
          ) : null,
          endAdornment: type === 'password' && showPasswordToggle ? (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                size="small"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        {...props}
      />
    </FormControl>
  );
}

/**
 * Password strength indicator
 */
export function PasswordStrengthIndicator({ password }) {
  const getStrength = () => {
    if (!password) return { strength: 0, label: '', color: 'default' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 33, label: 'Weak', color: 'error' };
    if (strength <= 3) return { strength: 66, label: 'Medium', color: 'warning' };
    return { strength: 100, label: 'Strong', color: 'success' };
  };

  const { strength, label, color } = getStrength();

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-500 dark:text-gray-400">Password strength:</span>
        <span className={`font-medium ${
          color === 'error' ? 'text-red-500' : 
          color === 'warning' ? 'text-yellow-500' : 
          'text-green-500'
        }`}>{label}</span>
      </div>
      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            color === 'error' ? 'bg-red-500' : 
            color === 'warning' ? 'bg-yellow-500' : 
            'bg-green-500'
          }`}
          style={{ width: `${strength}%` }}
        />
      </div>
    </div>
  );
}
