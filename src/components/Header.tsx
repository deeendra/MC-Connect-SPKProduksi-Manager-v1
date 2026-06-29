import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, LogOut, Kanban } from 'lucide-react';

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  const navItems = [
    { name: 'View All SPK', path: '/', icon: LayoutDashboard }
  ];

  if (user && (user.role === 'admin' || user.divisi?.toLowerCase() === 'print')) {
    navItems.push({ name: 'SPK Manager', path: '/manager', icon: Kanban });
  }

  return (
    <header className="bg-[#080808] border-b border-[#222] px-6 py-4 flex items-center justify-between shrink-0 z-10 shadow-md">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-mandiri-primary rounded flex items-center justify-center font-bold text-black text-lg shadow-[0_0_15px_rgba(247,198,0,0.4)]">
            M
          </div>
          <div>
            <h1 className="text-white font-extrabold text-lg leading-tight tracking-tight">MC-Connect</h1>
            <p className="text-mandiri-primary text-[10px] font-bold tracking-widest uppercase">SPK Manager</p>
          </div>
        </div>

        <nav className="flex items-center gap-2 border-l border-neutral-800 pl-4 sm:pl-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all font-bold text-sm ${
                  isActive 
                    ? 'bg-mandiri-primary/10 text-mandiri-primary' 
                    : 'text-gray-400 hover:bg-neutral-800 hover:text-white'
                }`}
                title={item.name}
              >
                <Icon size={16} />
                <span className="hidden lg:inline">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* User Info & Logout */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-white text-sm font-medium">{user?.nama_karyawan}</p>
          <p className="text-gray-500 text-xs">{user?.posisi}</p>
        </div>
        <button 
          onClick={logout}
          className="p-2 bg-[#1A1A1A] hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-xl transition-all border border-[#333] hover:border-red-500/50"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
