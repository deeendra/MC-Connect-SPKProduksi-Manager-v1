import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Search, Loader2 } from 'lucide-react';
import SpkDetailModal from '../components/SpkDetailModal';

// Utility untuk warna badge
const getStatusColor = (status: string) => {
  switch (status) {
    case 'ANTRIAN PRINT': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    case 'PRINTING': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    case 'SELESAI PRINT': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
    case 'PRESS': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50';
    case 'SELESAI PRESS': return 'bg-indigo-400/20 text-indigo-300 border-indigo-400/50';
    case 'SORTIR & HITUNG': return 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50';
    case 'POLA KURANG LENGKAP': return 'bg-red-500/20 text-red-400 border-red-500/50';
    case 'JAHIT': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
    case 'SELESAI JAHIT': return 'bg-violet-500/20 text-violet-400 border-violet-500/50';
    case 'PACKING': return 'bg-pink-500/20 text-pink-400 border-pink-500/50';
    case 'SELESAI PACKING': return 'bg-rose-500/20 text-rose-400 border-rose-500/50';
    case 'SIAP DIKIRIM/DIAMBIL': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
    case 'DIKIRIM':
    case 'DIAMBIL': return 'bg-green-500/20 text-green-400 border-green-500/50';
    default: return 'bg-neutral-800 text-gray-400 border-neutral-700'; // Default fallback
  }
};

export default function ViewAllSpkPage() {
  const [spkList, setSpkList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Semua');
  const [selectedSpk, setSelectedSpk] = useState<any>(null);

  useEffect(() => {
    fetchLatestSpk();
  }, []);

  const fetchLatestSpk = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'spk_produksi'), orderBy('created_at', 'desc'), limit(100));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSpkList(data);
    } catch (error) {
      console.error("Error fetching SPK:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = ['Semua', 'Antrian', 'Print & Press', 'Jahit', 'Siap'];

  const filteredSpk = spkList.filter(spk => {
    // Text search
    const matchesSearch = (spk.spk_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (spk.nama_customer || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Tab filter
    let matchesTab = true;
    const status = spk.status_produksi || 'ANTRIAN PRINT';
    
    if (activeTab === 'Antrian') {
      matchesTab = status === 'ANTRIAN PRINT' || status === 'SORTIR & HITUNG' || status === 'POLA KURANG LENGKAP';
    } else if (activeTab === 'Print & Press') {
      matchesTab = status.includes('PRINT') || status.includes('PRESS');
      if (status === 'ANTRIAN PRINT') matchesTab = false; 
    } else if (activeTab === 'Jahit') {
      matchesTab = status.includes('JAHIT');
    } else if (activeTab === 'Siap') {
      matchesTab = status.includes('SIAP') || status.includes('DIKIRIM') || status.includes('DIAMBIL');
    }

    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 w-full font-sans relative">
      <header className="mb-6">
        <h2 className="text-2xl font-black text-white">View All SPK</h2>
        <p className="text-gray-500 text-sm font-medium">Monitoring Real-time Status SPK Produksi</p>
      </header>

      <main className="flex-1 space-y-6">
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            
            {/* Tabs */}
            <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 lg:pb-0">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                    activeTab === tab 
                    ? 'bg-[#F7C600] text-black shadow-[0_0_15px_rgba(247,198,0,0.3)]' 
                    : 'bg-black border border-neutral-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-64 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Cari ID SPK / Nama..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black border border-neutral-800 rounded-xl text-sm text-white focus:border-[#F7C600] outline-none transition-colors"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-[#F7C600] animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredSpk.map((spk) => {
                const status = spk.status_produksi || 'ANTRIAN PRINT';
                const statusColor = getStatusColor(status);

                return (
                  <div 
                    key={spk.id} 
                    className="bg-black border border-neutral-800 p-5 rounded-2xl hover:border-neutral-600 transition-colors cursor-pointer group flex flex-col h-full"
                    onClick={() => setSelectedSpk(spk)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold px-2 py-1 bg-neutral-800 text-neutral-400 rounded-lg group-hover:bg-[#F7C600]/10 group-hover:text-[#F7C600] transition-colors">
                        {spk.tipe_pesanan}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500">
                        {spk.created_at?.toDate ? new Date(spk.created_at.toDate()).toLocaleDateString('id-ID') : '-'}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white mb-1 truncate" title={spk.spk_id}>{spk.spk_id}</h3>
                    <p className="text-xs text-gray-400 font-medium mb-4 truncate">{spk.nama_customer}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-800/50">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[8px] font-bold text-gray-400">
                          IMG
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border uppercase whitespace-nowrap ${statusColor}`}>
                        {status}
                      </span>
                    </div>
                  </div>
                );
              })}
              {filteredSpk.length === 0 && (
                <div className="col-span-full text-center py-10 text-neutral-500 text-sm font-medium">
                  Tidak ada data SPK ditemukan.
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Render Modal If SPK is Selected */}
      {selectedSpk && (
        <SpkDetailModal 
          spk={selectedSpk} 
          onClose={() => setSelectedSpk(null)} 
        />
      )}
    </div>
  );
}
