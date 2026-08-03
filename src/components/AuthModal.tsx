import React, { useState } from 'react';

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
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset_sent'>('login');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
      <div className="bg-[#022B3A] border border-white/20 w-full max-w-md p-6 shadow-2xl relative text-white rounded-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white font-mono text-sm cursor-pointer"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-4 border-b border-white/15 pb-3">
          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-white font-sans">
            {mode === 'login' && 'Developer Authentication'}
            {mode === 'signup' && 'Create Developer Account'}
            {mode === 'forgot' && 'Reset Account Password'}
            {mode === 'reset_sent' && 'Enter Reset Security Code'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block text-[9px] font-bold uppercase text-white/80 mb-1">
                Developer Twitter / GitHub Handle
              </label>
              <input
                type="text"
                required
                placeholder="@dev_quantum_01"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full bg-white/10 border border-white/20 px-3 py-2 text-xs text-white placeholder-white/50 rounded-xl focus:border-white focus:outline-none"
              />
            </div>
          )}

          {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
            <div>
              <label className="block text-[9px] font-bold uppercase text-white/80 mb-1">
                Developer Email Address
              </label>
              <input
                type="email"
                required
                placeholder="dev@agentarena.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 px-3 py-2 text-xs text-white placeholder-white/50 rounded-xl focus:border-white focus:outline-none"
              />
            </div>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[9px] font-bold uppercase text-white/80">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[9px] text-white/80 hover:text-white underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 px-3 py-2 text-xs text-white placeholder-white/50 rounded-xl focus:border-white focus:outline-none"
              />
            </div>
          )}

          {mode === 'reset_sent' && (
            <>
              <div className="p-2.5 bg-white/10 border border-white/20 text-white text-[10px] rounded-xl">
                Password reset link & 6-digit verification code dispatched to <span className="font-bold text-white">{email}</span>.
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase text-white/80 mb-1">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="882910"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 px-3 py-2 text-xs text-white rounded-xl focus:border-white focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase text-white/80 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="New Secure Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 px-3 py-2 text-xs text-white rounded-xl focus:border-white focus:outline-none font-mono"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-[#022B3A] font-black uppercase text-xs rounded-full cursor-pointer transition-all shadow-lg hover:bg-slate-100"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Authenticate & Enter Dashboard' : mode === 'signup' ? 'Create Account & Enter Dashboard' : mode === 'forgot' ? 'Send Reset Link' : 'Confirm New Password'}
          </button>
        </form>

        {/* Mode Switcher Footer */}
        <div className="mt-5 border-t border-white/15 pt-3 text-center text-[10px] font-sans text-white/70">
          {mode === 'login' && (
            <span>
              Don't have a developer account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-white font-bold hover:underline cursor-pointer"
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
                className="text-white font-bold hover:underline cursor-pointer"
              >
                Log In
              </button>
            </span>
          )}
          {(mode === 'forgot' || mode === 'reset_sent') && (
            <button
              onClick={() => setMode('login')}
              className="text-white/80 hover:text-white underline cursor-pointer"
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
