import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrandMascot } from './BrandMascot';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  User,
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Loader2,
  X,
  ShieldCheck,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  redirectAfterAuth?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  redirectAfterAuth,
}) => {
  const navigate = useNavigate();
  const { login, register, loginWithOAuth } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oAuthLoading, setOAuthLoading] = useState<'google' | 'github' | null>(null);

  if (!isOpen) return null;

  // Password requirements calculation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const isPasswordStrong = hasMinLength && hasNumber && hasUpper;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setAgreedToTerms(false);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleModeSwitch = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMessage('Please enter your display name.');
        return;
      }
      if (!isPasswordStrong) {
        setErrorMessage('Password must be at least 8 characters with 1 uppercase letter and 1 number.');
        return;
      }
      if (!agreedToTerms) {
        setErrorMessage('You must review and accept the DPDP Terms and Privacy Policy to create an account.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          setSuccessMessage('Signed in successfully.');
          setTimeout(() => {
            onClose();
            if (redirectAfterAuth) navigate(redirectAfterAuth);
          }, 400);
        } else {
          setErrorMessage(res.error || 'Failed to sign in.');
        }
      } else {
        const res = await register(email, password, name, agreedToTerms);
        if (res.success) {
          setSuccessMessage('Account created and logged in.');
          setTimeout(() => {
            onClose();
            if (redirectAfterAuth) navigate(redirectAfterAuth);
          }, 400);
        } else {
          setErrorMessage(res.error || 'Failed to create account.');
        }
      }
    } catch {
      setErrorMessage('An unexpected authentication error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setOAuthLoading(provider);
    setErrorMessage(null);
    try {
      const res = await loginWithOAuth(provider);
      if (res.success) {
        setSuccessMessage(`Signed in via ${provider === 'google' ? 'Google' : 'GitHub'}.`);
        setTimeout(() => {
          onClose();
          if (redirectAfterAuth) navigate(redirectAfterAuth);
        }, 400);
      } else {
        setErrorMessage(res.error || `Failed to sign in with ${provider}.`);
      }
    } catch {
      setErrorMessage(`OAuth authorization failed. Please try again.`);
    } finally {
      setOAuthLoading(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-oled-surface border border-oled-border space-y-6 shadow-elevated relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="absolute top-5 right-5 p-1.5 rounded-lg bg-oled-panel text-zinc-400 hover:text-zinc-100 border border-oled-border hover:border-zinc-700 transition-colors"
          aria-label="Close authentication dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Mascot & Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="flex justify-center">
            <BrandMascot size="md" showLabel={true} />
          </div>
          <h2 id="auth-modal-title" className="text-xl font-bold font-mono text-zinc-100">
            {mode === 'login' ? 'Welcome Back to Spiny3D' : 'Create Your Spiny3D Account'}
          </h2>
          <p className="text-xs text-zinc-400 font-sans">
            {mode === 'login'
              ? 'Access saved volumetric models, unlimited high-poly exports, and personal queue.'
              : 'Start converting 2D images into interactive 360° models in seconds.'}
          </p>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-oled-panel border border-oled-border text-xs font-mono">
          <button
            type="button"
            onClick={() => handleModeSwitch('login')}
            className={`py-2 rounded-lg font-medium transition-colors ${
              mode === 'login'
                ? 'bg-oled-surface text-zinc-100 border border-oled-border shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('register')}
            className={`py-2 rounded-lg font-medium transition-colors ${
              mode === 'register'
                ? 'bg-oled-surface text-zinc-100 border border-oled-border shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* OAuth Simulation Buttons */}
        <div className="space-y-2">
          {/* Google */}
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            disabled={isSubmitting || oAuthLoading !== null}
            className="w-full py-2.5 px-4 rounded-xl bg-oled-panel hover:bg-zinc-800 border border-oled-border text-zinc-200 text-xs font-mono font-medium flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
          >
            {oAuthLoading === 'google' ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.4 7.5 23 12 23z"
                />
              </svg>
            )}
            <span>Sign in with Google</span>
          </button>

          {/* GitHub */}
          <button
            type="button"
            onClick={() => handleOAuth('github')}
            disabled={isSubmitting || oAuthLoading !== null}
            className="w-full py-2.5 px-4 rounded-xl bg-oled-panel hover:bg-zinc-800 border border-oled-border text-zinc-200 text-xs font-mono font-medium flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
          >
            {oAuthLoading === 'github' ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              <svg className="w-4 h-4 fill-current text-zinc-200" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            )}
            <span>Sign in with GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-oled-border w-full" />
          <span className="bg-oled-surface px-3 text-[11px] font-mono text-zinc-500 uppercase tracking-wider relative">
            Or continue with email
          </span>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div
            className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs font-mono flex items-start gap-2"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs font-mono flex items-center gap-2"
            role="status"
          >
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {mode === 'register' && (
            <div>
              <label htmlFor="auth-name" className="block text-xs font-mono text-zinc-300 mb-1.5">
                Full Name / Alias
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-oled-panel border border-oled-border text-zinc-200 text-xs font-sans placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-xs font-mono text-zinc-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-oled-panel border border-oled-border text-zinc-200 text-xs font-sans placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="auth-password" className="block text-xs font-mono text-zinc-300">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'login' ? 'Enter password' : 'Min 8 characters'}
                className="w-full pl-9 pr-10 py-2 rounded-xl bg-oled-panel border border-oled-border text-zinc-200 text-xs font-sans placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength checklist in register mode */}
            {mode === 'register' && password.length > 0 && (
              <div className="mt-2 p-2.5 rounded-lg bg-oled-panel border border-oled-border space-y-1 text-[11px] font-mono">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  <Check className="w-3 h-3" />
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  <Check className="w-3 h-3" />
                  <span>At least 1 uppercase letter</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  <Check className="w-3 h-3" />
                  <span>At least 1 number</span>
                </div>
              </div>
            )}
          </div>

          {/* Consent Checkbox in register mode */}
          {mode === 'register' && (
            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  id="consent-checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded bg-oled-panel border-oled-border text-emerald-600 focus:ring-emerald-500"
                  required
                />
                <span className="leading-snug">
                  I agree to the{' '}
                  <Link
                    to="/terms"
                    target="_blank"
                    className="text-emerald-400 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy"
                    target="_blank"
                    className="text-emerald-400 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </Link>{' '}
                  (DPDP Act 2023 compliant).
                </span>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : mode === 'login' ? (
              <span>Sign In to Spiny3D</span>
            ) : (
              <span>Create Free Account</span>
            )}
          </button>
        </form>

        {/* Security & Privacy Notice */}
        <div className="pt-2 border-t border-oled-border flex items-center justify-center gap-2 text-[11px] font-mono text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero Server Retention · DPDP Act Compliant</span>
        </div>
      </div>
    </div>
  );
};
