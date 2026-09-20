import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { useAuthContext } from '../context/AuthContext';

interface PortalLoginViewProps {
  onLoginSuccess?: () => void;
}

export const PortalLoginView: React.FC<PortalLoginViewProps> = ({
  onLoginSuccess
}) => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { signIn, signUp, signInWithGoogle, error: authError } = useAuthContext();

  // Sign In state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up state
  const [fullName, setFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authStatusText, setAuthStatusText] = useState('');

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthStatusText('Verifying credentials...');
    try {
      await signIn(email, password);
      setAuthStatusText('Signed in • Loading dashboard...');
      if (onLoginSuccess) onLoginSuccess();
      navigate('/tracking');
    } catch {
      // authError from useAuthContext already holds a user-facing message
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    setAuthStatusText('Creating your workspace...');
    try {
      await signUp(fullName, signUpEmail, signUpPassword);
      setAuthStatusText('Account created • Loading dashboard...');
      if (onLoginSuccess) onLoginSuccess();
      navigate('/tracking');
    } catch {
      // authError from useAuthContext already holds a user-facing message
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    setAuthStatusText('Signing in with Google...');
    try {
      await signInWithGoogle();
      setAuthStatusText('Signed in • Loading dashboard...');
      if (onLoginSuccess) onLoginSuccess();
      navigate('/tracking');
    } catch {
      // authError from useAuthContext already holds a user-facing message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row min-h-screen bg-[#F9FAFC] dark:bg-[#000000] transition-colors">
      {/* Left Hero Graphic Section (50%) */}
      <div className="relative w-full lg:w-[50%] flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-[#213145] dark:bg-[#080808] text-[#eaf1ff] border-b lg:border-b-0 lg:border-r border-transparent dark:border-[#1a1a1a] transition-colors">
        {/* Ambient Subtle Background Auras */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#165DFC]/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 -right-20 w-96 h-96 rounded-full bg-[#165DFC]/10 blur-3xl pointer-events-none"></div>

        {/* Top Header & Public Back Link */}
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                alt="Nagarkot Forwarders Logo"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
                src="/nagarkot-logo.svg"
              />
              <span className="font-display text-xl text-white tracking-tight font-bold block">
                Nagarkot Forwarders
              </span>
            </Link>

            <div className="flex items-center gap-2.5">
              <ThemeToggle />
              <Link
                to="/"
                className="text-xs text-[#c3c5d9] hover:text-white flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Public Overview</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Center Punchy Headline & Visual Telematics */}
        <div className="relative z-10 my-6 lg:my-0 flex flex-col gap-5 max-w-lg">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-white font-extrabold leading-tight">
              Enterprise Logistics & Freight Management
            </h1>
            <p className="text-sm text-[#c3c5d9] mt-3 leading-relaxed font-normal">
              Seamlessly track and manage global consignments with our secure, centralized dashboard.
            </p>
          </div>
        </div>

        {/* Bottom Support Line (Matching User Screenshot) */}
        <div className="relative z-10 pt-4 border-t border-white/10 dark:border-[#1f1f1f]">
          <p className="font-mono text-xs text-[#94A3B8] tracking-wide">
            FOR ISSUES — <span className="text-[#eaf1ff]">krutarth.a@somaiya.edu</span>
          </p>
        </div>
      </div>

      {/* Right Form Section (50%) */}
      <div className="w-full lg:w-[50%] flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 bg-[#F9FAFC] dark:bg-[#000000] transition-colors">
        <div className="w-full max-w-md">
          {/* Top Pill Switcher: Sign In vs Sign Up */}
          <div className="bg-[#E2E8F0]/70 dark:bg-[#141414] p-1 rounded-xl flex items-center mb-6 max-w-xs mx-auto border border-transparent dark:border-[#262626]">
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${authMode === 'signin'
                  ? 'bg-white dark:bg-[#222222] text-[#0b1c30] dark:text-white shadow-xs'
                  : 'text-[#64748B] dark:text-[#a1a1aa] hover:text-[#0b1c30] dark:hover:text-white'
                }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${authMode === 'signup'
                  ? 'bg-white dark:bg-[#222222] text-[#0b1c30] dark:text-white shadow-xs'
                  : 'text-[#64748B] dark:text-[#a1a1aa] hover:text-[#0b1c30] dark:hover:text-white'
                }`}
            >
              Sign Up
            </button>
          </div>

          {authError && (
            <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs">
              {authError}
            </div>
          )}

          {/* Card Container */}
          <div className="bg-white dark:bg-[#0d0d0d] rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] dark:border-[#222222] shadow-sm transition-colors">
            {authMode === 'signin' ? (
              /* ================= SIGN IN FORM ================= */
              <div>
                <div>
                  <h2 className="font-display text-2xl text-[#0b1c30] dark:text-white font-extrabold tracking-tight">
                    Welcome back
                  </h2>
                  <p className="text-xs text-[#64748B] dark:text-[#a1a1aa] mt-1">
                    Sign in to your Nagarkot workspace.
                  </p>
                </div>

                <form onSubmit={handleSignInSubmit} className="mt-6 flex flex-col gap-4">
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="signin-email"
                      className="text-[11px] font-bold text-[#475569] dark:text-[#a1a1aa] uppercase tracking-wider"
                    >
                      Email
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-[#94A3B8] dark:text-[#71717a] text-[18px] pointer-events-none">
                        mail
                      </span>
                      <input
                        id="signin-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full h-11 pl-10 pr-3 rounded-xl bg-white dark:bg-[#141414] text-[#0b1c30] dark:text-white placeholder:text-[#94A3B8] dark:placeholder:text-[#71717a] text-xs focus:outline-none focus:ring-2 focus:ring-[#165DFC]/20 focus:border-[#165DFC] border border-[#CBD5E1] dark:border-[#262626] transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="signin-password"
                      className="text-[11px] font-bold text-[#475569] dark:text-[#a1a1aa] uppercase tracking-wider"
                    >
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-[#94A3B8] dark:text-[#71717a] text-[18px] pointer-events-none">
                        lock
                      </span>
                      <input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full h-11 pl-10 pr-10 rounded-xl bg-white dark:bg-[#141414] text-[#0b1c30] dark:text-white placeholder:text-[#94A3B8] dark:placeholder:text-[#71717a] text-xs focus:outline-none focus:ring-2 focus:ring-[#165DFC]/20 focus:border-[#165DFC] border border-[#CBD5E1] dark:border-[#262626] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-[#94A3B8] hover:text-[#475569] dark:hover:text-[#c3c5d9] p-1 cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full h-11 rounded-xl bg-[#165DFC] hover:bg-[#145CFC] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[16px]">
                          progress_activity
                        </span>
                        <span>{authStatusText}</span>
                      </>
                    ) : (
                      <>
                        <span>Sign in</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full bg-[#E2E8F0] dark:bg-[#222222] h-[1px]"></div>
                  </div>
                  <div className="relative flex justify-center text-center">
                    <span className="bg-white dark:bg-[#0d0d0d] px-3 text-[10px] text-[#94A3B8] dark:text-[#a1a1aa] uppercase tracking-wider font-semibold">
                      OR
                    </span>
                  </div>
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl bg-white dark:bg-[#141414] hover:bg-[#F8FAFC] dark:hover:bg-[#1c1c1c] text-[#0b1c30] dark:text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors border border-[#CBD5E1] dark:border-[#262626] cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>
            ) : (
              /* ================= SIGN UP FORM ================= */
              <div>
                <div>
                  <h2 className="font-display text-2xl text-[#0b1c30] dark:text-white font-extrabold tracking-tight">
                    Create your account
                  </h2>
                  <p className="text-xs text-[#64748B] dark:text-[#a1a1aa] mt-1">
                    Get started Your account will be ready instantly.
                  </p>
                </div>

                <form onSubmit={handleSignUpSubmit} className="mt-5 flex flex-col gap-3.5">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="signup-name"
                      className="text-[11px] font-bold text-[#475569] dark:text-[#a1a1aa] uppercase tracking-wider"
                    >
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-[#94A3B8] dark:text-[#71717a] text-[18px] pointer-events-none">
                        person
                      </span>
                      <input
                        id="signup-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Jane Smith"
                        className="w-full h-10 pl-10 pr-3 rounded-xl bg-white dark:bg-[#141414] text-[#0b1c30] dark:text-white placeholder:text-[#94A3B8] dark:placeholder:text-[#71717a] text-xs focus:outline-none focus:ring-2 focus:ring-[#165DFC]/20 focus:border-[#165DFC] border border-[#CBD5E1] dark:border-[#262626] transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="signup-email"
                      className="text-[11px] font-bold text-[#475569] dark:text-[#a1a1aa] uppercase tracking-wider"
                    >
                      Email
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-[#94A3B8] dark:text-[#71717a] text-[18px] pointer-events-none">
                        mail
                      </span>
                      <input
                        id="signup-email"
                        type="email"
                        required
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full h-10 pl-10 pr-3 rounded-xl bg-white dark:bg-[#141414] text-[#0b1c30] dark:text-white placeholder:text-[#94A3B8] dark:placeholder:text-[#71717a] text-xs focus:outline-none focus:ring-2 focus:ring-[#165DFC]/20 focus:border-[#165DFC] border border-[#CBD5E1] dark:border-[#262626] transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="signup-password"
                      className="text-[11px] font-bold text-[#475569] dark:text-[#a1a1aa] uppercase tracking-wider"
                    >
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-[#94A3B8] dark:text-[#71717a] text-[18px] pointer-events-none">
                        lock
                      </span>
                      <input
                        id="signup-password"
                        type={showSignUpPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full h-10 pl-10 pr-10 rounded-xl bg-white dark:bg-[#141414] text-[#0b1c30] dark:text-white placeholder:text-[#94A3B8] dark:placeholder:text-[#71717a] text-xs focus:outline-none focus:ring-2 focus:ring-[#165DFC]/20 focus:border-[#165DFC] border border-[#CBD5E1] dark:border-[#262626] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-3 text-[#94A3B8] hover:text-[#475569] dark:hover:text-[#c3c5d9] p-1 cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showSignUpPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="signup-confirm-password"
                      className="text-[11px] font-bold text-[#475569] dark:text-[#a1a1aa] uppercase tracking-wider"
                    >
                      Confirm Password
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3 text-[#94A3B8] dark:text-[#71717a] text-[18px] pointer-events-none">
                        lock_reset
                      </span>
                      <input
                        id="signup-confirm-password"
                        type={showSignUpPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full h-10 pl-10 pr-3 rounded-xl bg-white dark:bg-[#141414] text-[#0b1c30] dark:text-white placeholder:text-[#94A3B8] dark:placeholder:text-[#71717a] text-xs focus:outline-none focus:ring-2 focus:ring-[#165DFC]/20 focus:border-[#165DFC] border border-[#CBD5E1] dark:border-[#262626] transition-all"
                      />
                    </div>
                  </div>

                  {/* Create Account Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-1 w-full h-11 rounded-xl bg-[#165DFC] hover:bg-[#145CFC] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[16px]">
                          progress_activity
                        </span>
                        <span>{authStatusText}</span>
                      </>
                    ) : (
                      <>
                        <span>Create account</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full bg-[#E2E8F0] dark:bg-[#222222] h-[1px]"></div>
                  </div>
                  <div className="relative flex justify-center text-center">
                    <span className="bg-white dark:bg-[#0d0d0d] px-3 text-[10px] text-[#94A3B8] dark:text-[#a1a1aa] uppercase tracking-wider font-semibold">
                      OR
                    </span>
                  </div>
                </div>

                {/* Google Sign Up */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isSubmitting}
                  className="w-full h-10 rounded-xl bg-white dark:bg-[#141414] hover:bg-[#F8FAFC] dark:hover:bg-[#1c1c1c] text-[#0b1c30] dark:text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors border border-[#CBD5E1] dark:border-[#262626] cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign up with Google</span>
                </button>
              </div>
            )}
          </div>

          {/* Realistic Bottom Note */}
          <div className="mt-4 text-center">
            <p className="text-[11px] text-[#94A3B8]">
              Authentication handled securely via session auth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};






