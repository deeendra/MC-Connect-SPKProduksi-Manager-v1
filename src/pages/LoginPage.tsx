import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import MCConnectLoginPage from '../components/MCConnectLoginPage';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (username: string, password: string) => {
    setError('');
    setIsLoading(true);
    
    // TODO: Connect to Firestore 'karyawan' collection for real auth.
    setTimeout(() => {
      if (username && password) {
        let divisi = 'Produksi';
        let posisi = 'Admin';
        let role = 'admin';

        if (username.toLowerCase().includes('print')) {
          posisi = 'Staff Print';
          role = 'staff';
        } else if (username.toLowerCase().includes('jahit')) {
          posisi = 'Staff Jahit';
          role = 'staff';
        } else if (username.toLowerCase().includes('qc')) {
          divisi = 'Store';
          posisi = 'Staff QC';
          role = 'staff';
        } else if (username.toLowerCase().includes('pengawas')) {
          posisi = 'Pengawas';
          role = 'pengawas';
        }

        login({
          karyawan_id: `KAR-${username.toUpperCase()}`,
          nama_karyawan: username,
          username: username,
          jabatan: 'Karyawan',
          posisi: posisi,
          divisi: divisi,
          role: role,
          hak_akses: ['view_spk']
        });
        navigate('/', { replace: true });
      } else {
        setError('Username dan Password wajib diisi.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <MCConnectLoginPage 
      appName="MC-Connect"
      appSubtitle="SPK Produksi Manager"
      logoSrc="/logo_mc_dndr.svg"
      onLogin={handleLogin}
      error={error}
      isLoading={isLoading}
      accentColorClass="bg-[#F7C600]"
      accentColorHoverClass="hover:bg-[#E5B500]"
      buttonText="Masuk Sistem"
    />
  );
}
