import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, LogOut } from 'lucide-react';

export default function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  const navItems = [
    { name: 'View All SPK', path: '/', icon: LayoutDashboard },
    // Di masa depan bisa ditambah: 
    // { name: 'Area Print', path: '/area-print', icon: Printer, roles: ['Staff Print'] }
  ];

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 hidden md:flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-black text-[#F7C600] tracking-tighter">MC-Connect</h1>
        <p className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">SPK Manager</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                isActive 
                  ? 'bg-[#F7C600]/10 text-[#F7C600] border border-[#F7C600]/50' 
                  : 'text-gray-400 hover:bg-neutral-800 hover:text-white border border-transparent'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-neutral-800">
        <div className="bg-black/50 border border-neutral-800 p-4 rounded-xl mb-4">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Log In As</p>
          <p className="text-sm font-bold text-white truncate">{user?.nama_karyawan}</p>
          <p className="text-[10px] font-bold text-[#F7C600]">{user?.posisi} &bull; {user?.divisi}</p>
        </div>
        <button 
          onClick={logout}
          className="w-full py-3 flex items-center justify-center gap-2 bg-red-950/30 hover:bg-red-900/50 text-red-400 rounded-xl border border-red-900/50 transition-colors font-bold text-sm"
        >
          <LogOut size={16} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
