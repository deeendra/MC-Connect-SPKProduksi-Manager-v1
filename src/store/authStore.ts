import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Karyawan {
  karyawan_id: string;
  nama_karyawan: string;
  username: string;
  jabatan: string;
  posisi: string;
  divisi: string;
  role: string;
  hak_akses: string[];
}

interface AuthState {
  user: Karyawan | null;
  loginTime: number | null;
  login: (karyawan: Karyawan) => void;
  logout: () => void;
  checkSession: () => boolean;
}

// Session expires in 7 days (in milliseconds)
const SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loginTime: null,
      login: (karyawan) => set({ user: karyawan, loginTime: Date.now() }),
      logout: () => set({ user: null, loginTime: null }),
      checkSession: () => {
        const { loginTime } = get();
        if (!loginTime) return false;
        
        const isExpired = Date.now() - loginTime > SESSION_EXPIRY;
        if (isExpired) {
          set({ user: null, loginTime: null });
          return false;
        }
        return true;
      }
    }),
    {
      name: 'mc-connect-auth', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
