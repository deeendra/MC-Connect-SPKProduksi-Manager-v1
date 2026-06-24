import React, { useState } from 'react';
import { AlertCircle, User, Lock, Loader2 } from 'lucide-react';

export interface MCConnectLoginPageProps {
  /** Nama aplikasi, misal: "Mandiri Clothing" */
  appName?: string;
  /** Subtitle atau deskripsi aplikasi, misal: "Stock Monitoring" */
  appSubtitle?: string;
  /** URL atau path ke logo aplikasi */
  logoSrc?: string;
  /** Pesan error yang akan ditampilkan, jika ada */
  error?: string;
  /** State loading untuk mendisable form dan tombol */
  isLoading?: boolean;
  /** Callback saat tombol login ditekan */
  onLogin: (username: string, password: string) => void;
  /** Teks pada tombol login */
  buttonText?: string;
  /** Warna aksen (default: kuning MC-Connect `bg-yellow-400`) */
  accentColorClass?: string;
  /** Warna hover aksen (default: `hover:bg-yellow-500`) */
  accentColorHoverClass?: string;
  /** Font family untuk wrapper luar (default: "'Urbanist', sans-serif") */
  fontFamily?: string;
}

export const MCConnectLoginPage: React.FC<MCConnectLoginPageProps> = ({
  appName = 'Mandiri Clothing',
  appSubtitle = 'MC-Connect App',
  logoSrc = '/logo.png', // Fallback if no logo
  error = '',
  isLoading = false,
  onLogin,
  buttonText = 'Login',
  accentColorClass = 'bg-yellow-400',
  accentColorHoverClass = 'hover:bg-yellow-500',
  fontFamily = "'Urbanist', sans-serif",
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onLogin(username, password);
    }
  };

  return (
    <div
      className="fixed inset-0 w-full h-full bg-neutral-950 flex items-center justify-center p-4 overflow-hidden"
      style={{ fontFamily }}
    >
      <div className="bg-neutral-900 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md sm:max-w-lg border border-neutral-800 flex flex-col mx-auto relative z-10 animate-in fade-in zoom-in duration-300">
        <img src="/logo_dndrstudio.svg" alt="DNDRstudio" className="absolute -top-4 -right-4 w-12 h-12 sm:w-16 sm:h-16 pointer-events-none opacity-80" />
        <div className="text-center mb-10">
          <img
            src={logoSrc}
            alt="Logo"
            className="h-20 sm:h-28 w-auto mx-auto mb-6 object-contain drop-shadow-2xl"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <h1 className="text-2xl sm:text-4xl font-black text-white mb-2 tracking-tighter">
            {appName}
          </h1>
          <p className="text-neutral-400 text-xs sm:text-base font-bold tracking-[0.2em] uppercase">
            {appSubtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {error && (
            <div className="bg-red-950/40 text-red-400 p-4 rounded-xl text-xs sm:text-sm font-bold border border-red-900/50 flex items-center">
              <AlertCircle size={18} className="mr-3 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] sm:text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">
              Username
            </label>
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                size={20}
              />
              <input
                type="text"
                required
                disabled={isLoading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-base font-bold text-white outline-none focus:border-yellow-400 transition-all disabled:opacity-50"
                placeholder="Username"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                size={20}
              />
              <input
                type="password"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-base font-bold text-white outline-none focus:border-yellow-400 transition-all disabled:opacity-50"
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-4 sm:py-5 ${accentColorClass} ${accentColorHoverClass} text-black text-base sm:text-lg font-black rounded-2xl shadow-xl mt-4 uppercase tracking-[0.1em] transition-all transform active:scale-95 disabled:opacity-70 disabled:active:scale-100`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin text-black" size={24} />
            ) : (
              buttonText
            )}
          </button>
        </form>

        <footer className="mt-8 text-center">
          <p className="text-gray-500 text-[10px] sm:text-xs font-bold tracking-widest">
            Powered by <strong className="text-yellow-400">DNDRstudio</strong> &copy; {new Date().getFullYear()}
          </p>
          <p className="text-gray-400 text-[8px] sm:text-[10px] italic mt-1 font-medium">
            "Your trusted and reliable studio design manager"
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MCConnectLoginPage;
