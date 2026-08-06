import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, User, KeyRound, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (handle: string) => void;
  initialMode?: 'login' | 'signup' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset_sent'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (mode === 'forgot') {
        setMode('reset_sent');
      } else if (mode === 'reset_sent') {
        alert('Password successfully reset! You can now log in.');
        setMode('login');
      } else {
        const userHandle = handle ? (handle.startsWith('@') ? handle : '@' + handle) : '@dev_builder';
        onAuthSuccess(userHandle);
        onClose();
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
      <div className="bg-[#051825] border border-white/20 w-full max-w-md p-7 shadow-2xl relative text-white rounded-3xl backdrop-blur-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white font-sans">
              {mode === 'login' && 'Developer Authentication'}
              {mode === 'signup' && 'Create Developer Account'}
              {mode === 'forgot' && 'Reset Account Password'}
              {mode === 'reset_sent' && 'Enter Security Code'}
            </h2>
            <p className="text-[10px] text-slate-300">Cogix Arena Developer Portal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                Developer Handle
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="@dev_quantum_01"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full bg-[#03111c] border border-white/15 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 rounded-xl focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                Developer Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="dev@agentarena.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#03111c] border border-white/15 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 rounded-xl focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold uppercase text-slate-300">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[10px] text-cyan-300 hover:text-cyan-200 underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#03111c] border border-white/15 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 rounded-xl focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {mode === 'reset_sent' && (
            <>
              <div className="p-3 bg-[#03111c] border border-white/15 text-slate-300 text-[11px] rounded-xl">
                Password reset link & verification code sent to <span className="font-bold text-white">{email}</span>.
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                  6-Digit Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="882910"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className="w-full bg-[#03111c] border border-white/15 pl-10 pr-4 py-2.5 text-xs text-white rounded-xl focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="New Secure Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#03111c] border border-white/15 pl-10 pr-4 py-2.5 text-xs text-white rounded-xl focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#e2ebf3] text-[#071321] font-bold uppercase text-xs rounded-full cursor-pointer transition-all hover:bg-[#d0dfed] shadow-md flex items-center justify-center gap-2 mt-2"
          >
            <span>
              {loading
                ? 'Authenticating...'
                : mode === 'login'
                ? 'Authenticate & Enter Dashboard'
                : mode === 'signup'
                ? 'Create Account & Enter Dashboard'
                : mode === 'forgot'
                ? 'Send Reset Link'
                : 'Confirm New Password'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Mode Switcher Footer */}
        <div className="mt-5 border-t border-white/10 pt-4 text-center text-xs font-sans text-slate-300">
          {mode === 'login' && (
            <span>
              Don't have a developer account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-cyan-300 font-bold hover:underline cursor-pointer ml-1"
              >
                Sign Up Now
              </button>
            </span>
          )}
          {mode === 'signup' && (
            <span>
              Already registered?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-cyan-300 font-bold hover:underline cursor-pointer ml-1"
              >
                Log In
              </button>
            </span>
          )}
          {(mode === 'forgot' || mode === 'reset_sent') && (
            <button
              onClick={() => setMode('login')}
              className="text-slate-300 hover:text-white underline cursor-pointer"
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

