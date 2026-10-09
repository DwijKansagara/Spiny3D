import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, UserPlan } from '../types';

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  isProOrHigher: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    name: string,
    agreedToTerms: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithOAuth: (provider: 'google' | 'github') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  upgradePlan: (plan: UserPlan) => void;
  canConvert: () => boolean;
  incrementConversionCount: () => void;
  remainingConversions: number;
}

const GUEST_MAX_DAILY = 5;
const PRO_MAX_DAILY = 9999;

const DEFAULT_GUEST: UserProfile = {
  id: 'guest_session',
  email: '',
  name: 'Guest Creator',
  plan: 'free',
  conversionsToday: 0,
  maxDailyConversions: GUEST_MAX_DAILY,
  isGuest: true,
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session storage key for encrypted/sanitized auth state (avoiding plain localStorage auth token leaks)
const SESSION_AUTH_KEY = 'spiny3d_auth_session';
const DAILY_USAGE_KEY = 'spiny3d_daily_usage';

function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function loadSavedDailyCount(): number {
  try {
    const raw = localStorage.getItem(DAILY_USAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (parsed.date === getTodayKey() && typeof parsed.count === 'number') {
      return parsed.count;
    }
    return 0;
  } catch {
    return 0;
  }
}

function saveDailyCount(count: number): void {
  try {
    localStorage.setItem(
      DAILY_USAGE_KEY,
      JSON.stringify({ date: getTodayKey(), count })
    );
  } catch {
    // ignore storage quota issues
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    // Check session storage first
    try {
      const stored = sessionStorage.getItem(SESSION_AUTH_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile;
        const currentDaily = loadSavedDailyCount();
        return {
          ...parsed,
          conversionsToday: currentDaily,
        };
      }
    } catch {
      // fallback to default guest
    }

    const currentDaily = loadSavedDailyCount();
    return {
      ...DEFAULT_GUEST,
      conversionsToday: currentDaily,
    };
  });

  // Keep session storage in sync when logged in
  useEffect(() => {
    if (!user.isGuest) {
      try {
        sessionStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(user));
      } catch {
        // ignore storage errors
      }
    } else {
      sessionStorage.removeItem(SESSION_AUTH_KEY);
    }
  }, [user]);

  const isAuthenticated = !user.isGuest;
  const isProOrHigher = user.plan === 'pro' || user.plan === 'studio';

  const remainingConversions = isProOrHigher
    ? Infinity
    : Math.max(0, user.maxDailyConversions - user.conversionsToday);

  const canConvert = (): boolean => {
    if (isProOrHigher) return true;
    return user.conversionsToday < user.maxDailyConversions;
  };

  const incrementConversionCount = () => {
    setUser((prev) => {
      const newCount = prev.conversionsToday + 1;
      saveDailyCount(newCount);
      return {
        ...prev,
        conversionsToday: newCount,
      };
    });
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate server-side verification with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Basic format and presence validation
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters in length.' };
    }

    const currentDaily = loadSavedDailyCount();
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email: email.trim().toLowerCase(),
      name: email.split('@')[0],
      plan: 'free',
      conversionsToday: currentDaily,
      maxDailyConversions: GUEST_MAX_DAILY,
      isGuest: false,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    return { success: true };
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    agreedToTerms: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (!agreedToTerms) {
      return {
        success: false,
        error: 'You must review and accept the DPDP-compliant Terms and Privacy Policy to create an account.',
      };
    }

    if (!email || !email.includes('@')) {
      return { success: false, error: 'A valid email address is required.' };
    }

    if (!name || name.trim().length < 2) {
      return { success: false, error: 'Please enter your display name.' };
    }

    // Password strength verification
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);

    if (!hasMinLength || !hasNumber || !hasUpper) {
      return {
        success: false,
        error: 'Password must be at least 8 characters and include at least one uppercase letter and one number.',
      };
    }

    const currentDaily = loadSavedDailyCount();
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      plan: 'free',
      conversionsToday: currentDaily,
      maxDailyConversions: GUEST_MAX_DAILY,
      isGuest: false,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    return { success: true };
  };

  const loginWithOAuth = async (
    provider: 'google' | 'github'
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const currentDaily = loadSavedDailyCount();
    const isGoogle = provider === 'google';
    const mockEmail = isGoogle ? 'creator@gmail.com' : 'dev@github.com';
    const mockName = isGoogle ? 'Google Creator' : 'GitHub Developer';

    const newUser: UserProfile = {
      id: `usr_oauth_${provider}_${Date.now()}`,
      email: mockEmail,
      name: mockName,
      plan: 'free',
      conversionsToday: currentDaily,
      maxDailyConversions: GUEST_MAX_DAILY,
      isGuest: false,
      avatarUrl: undefined,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    const currentDaily = loadSavedDailyCount();
    setUser({
      ...DEFAULT_GUEST,
      conversionsToday: currentDaily,
    });
    sessionStorage.removeItem(SESSION_AUTH_KEY);
  };

  const upgradePlan = (plan: UserPlan) => {
    setUser((prev) => {
      const updated: UserProfile = {
        ...prev,
        plan,
        maxDailyConversions: plan === 'free' ? GUEST_MAX_DAILY : PRO_MAX_DAILY,
        isGuest: false, // Upgrading assigns user account
        email: prev.email || 'creator@spiny3d.local',
        name: prev.name === 'Guest Creator' ? 'Pro Creator' : prev.name,
      };
      sessionStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isProOrHigher,
        login,
        register,
        loginWithOAuth,
        logout,
        upgradePlan,
        canConvert,
        incrementConversionCount,
        remainingConversions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
