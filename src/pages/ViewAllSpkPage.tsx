import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Search, Loader2, Image as ImageIcon, Calendar as CalendarIcon } from 'lucide-react';
import SpkDetailModal from '../components/SpkDetailModal';
import { PRODUCTION_STAGES } from '../lib/constants';


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
    <div className="h-full overflow-y-auto custom-scrollbar flex flex-col p-4 md:p-6 w-full font-sans relative">
      <div className="max-w-7xl mx-auto w-full flex flex-col flex-1">
        <header className="mb-6 shrink-0">
          <h2 className="text-2xl font-black text-white">View All SPK</h2>
          <p className="text-gray-500 text-sm font-medium">Monitoring Real-time Status SPK Produksi</p>
        </header>

        <main className="flex-1 space-y-6 flex flex-col">
        <div className="glass-panel p-6 rounded-3xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            
            {/* Tabs */}
            <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 lg:pb-0">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                    activeTab === tab 
                    ? 'bg-mandiri-primary text-black shadow-[0_0_15px_rgba(247,198,0,0.3)]' 
                    : 'bg-mandiri-bg border border-mandiri-border text-gray-400 hover:text-white'
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
                className="w-full pl-10 pr-4 py-2 bg-mandiri-bg border border-mandiri-border rounded-xl text-sm text-white focus:border-mandiri-primary focus:ring-1 focus:ring-mandiri-primary outline-none transition-colors"
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
                let currentIndex = PRODUCTION_STAGES.findIndex(s => s.matches.includes(status));
                if (currentIndex === -1) currentIndex = 0; // fallback

                const previewUrl = spk.gambar_preview || spk.preview_design_cod_url || spk.preview_design_extras_url || spk.preview_image_mcd_url || spk.preview_image_cod_url || spk.preview_image_ext_url;
                
                const rawId = spk.spk_id_masked || spk.spk_id || '';
                const maskedId = rawId.length > 9 ? `${rawId.substring(0, 6)}...${rawId.substring(rawId.length - 3)}` : rawId;

                return (
                  <div 
                    key={spk.id} 
                    className="glass-panel glass-panel-hover p-4 rounded-2xl cursor-pointer group flex flex-col h-full"
                    onClick={() => setSelectedSpk(spk)}
                  >
                    {/* Top Section: 2 Columns */}
                    <div className="flex gap-4 mb-4">
                      {/* Left Column: Image */}
                      <div className="w-2/5 min-w-[90px] max-w-[130px] aspect-square bg-[#0A0A0A] rounded-xl overflow-hidden shrink-0 relative border border-neutral-800/50">
                        {previewUrl ? (
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 transition-colors group-hover:border-neutral-700 bg-neutral-900/50">
                            <ImageIcon size={24} className="mb-2 opacity-50" />
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 text-center leading-tight">No<br/>Preview</span>
                          </div>
                        )}
                      </div>

                      {/* Right Column: Info */}
                      <div className="flex flex-col flex-1 py-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {/* SPK ID Badge */}
                          <span className="border border-mandiri-primary text-mandiri-primary px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-black bg-mandiri-primary/10">
                            {maskedId}
                          </span>
                          {/* Date Badge */}
                          <span className="bg-mandiri-primary text-black px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold shadow-[0_0_10px_rgba(247,198,0,0.2)]">
                            {spk.created_at?.toDate ? new Date(spk.created_at.toDate()).toLocaleDateString('id-ID', {day: '2-digit', month: 'short'}) : '-'}
                          </span>
                        </div>
                        
                        {/* Customer Name */}
                        <h3 className="font-bold text-sm text-white mb-2 line-clamp-2 leading-snug break-words">{spk.nama_customer}</h3>
                        
                        {/* Deadline Badge */}
                        <div className="mt-auto pt-1">
                          <span className="border border-red-500 text-red-400 bg-red-950/20 px-2 py-1 rounded-md text-[10px] font-bold inline-flex items-center">
                            <CalendarIcon size={12} className="mr-1 opacity-70" />
                            Deadline: {spk.deadline_date ? new Date(spk.deadline_date).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: '2-digit'}) : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Segmented Line Bar */}
                    <div className="mt-auto">
                      <div className="flex gap-1 w-full h-1.5 mb-2">
                        {PRODUCTION_STAGES.map((stage, idx) => {
                          const isPast = idx < currentIndex;
                          const isActive = idx === currentIndex;
                          
                          let colorClass = "bg-neutral-800"; // Future state
                          if (isActive) colorClass = stage.activeColor;
                          else if (isPast) colorClass = stage.pastColor;
                          
                          return (
                            <div key={stage.label} className={`flex-1 rounded-full ${colorClass}`} title={isPast ? 'Selesai' : isActive ? 'Proses Saat Ini' : 'Belum Dilalui'}></div>
                          );
                        })}
                      </div>
                      
                      {/* Current Status Text */}
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Status Saat Ini</span>
                        <span className={`text-xs font-black uppercase tracking-wider ${PRODUCTION_STAGES[currentIndex].textColor}`}>
                          {PRODUCTION_STAGES[currentIndex].label}
                        </span>
                      </div>
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
      </div>

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
