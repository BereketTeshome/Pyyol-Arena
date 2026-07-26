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
      <div className="bg-[#0D0D12] border border-[#2A2A35] w-full max-w-md p-6 shadow-2xl relative text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white font-mono text-sm cursor-pointer"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-4 border-b border-[#22222c] pb-3">
          <div className="w-2.5 h-2.5 bg-cyan-400 rounded-xs shadow-[0_0_8px_#06b6d4]"></div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
            {mode === 'login' && 'Developer Authentication'}
            {mode === 'signup' && 'Create Developer Account'}
            {mode === 'forgot' && 'Reset Account Password'}
            {mode === 'reset_sent' && 'Enter Reset Security Code'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">
                Developer Twitter / GitHub Handle
              </label>
              <input
                type="text"
                required
                placeholder="@dev_quantum_01"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full bg-[#14141c] border border-[#282836] px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          )}

          {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
            <div>
              <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">
                Developer Email Address
              </label>
              <input
                type="email"
                required
                placeholder="dev@agentarena.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#14141c] border border-[#282836] px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[9px] font-bold uppercase text-slate-400">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[9px] text-cyan-400 hover:underline cursor-pointer"
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
                className="w-full bg-[#14141c] border border-[#282836] px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          )}

          {mode === 'reset_sent' && (
            <>
              <div className="p-2.5 bg-cyan-950/40 border border-cyan-800 text-cyan-300 text-[10px] rounded-xs">
                Password reset link & 6-digit verification code dispatched to <span className="font-bold text-white">{email}</span>.
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="882910"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="w-full bg-[#14141c] border border-[#282836] px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="New Secure Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#14141c] border border-[#282836] px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs transform -skew-x-12 cursor-pointer transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)]"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Authenticate & Enter Dashboard →' : mode === 'signup' ? 'Create Account & Enter Dashboard →' : mode === 'forgot' ? 'Send Reset Link' : 'Confirm New Password'}
          </button>
        </form>

        {/* Mode Switcher Footer */}
        <div className="mt-5 border-t border-[#1a1a24] pt-3 text-center text-[10px] font-mono text-slate-400">
          {mode === 'login' && (
            <span>
              Don't have a developer account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-cyan-400 font-bold hover:underline cursor-pointer"
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
                className="text-cyan-400 font-bold hover:underline cursor-pointer"
              >
                Log In
              </button>
            </span>
          )}
          {(mode === 'forgot' || mode === 'reset_sent') && (
            <button
              onClick={() => setMode('login')}
              className="text-slate-400 hover:text-white underline cursor-pointer"
            >
              ← Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
