import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PRODUCTION_STAGES } from '../lib/constants';
import { Loader2, Image as ImageIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function SpkManagerPage() {
  const [spkList, setSpkList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{ spk: any, targetStageIndex: number } | null>(null);

  useEffect(() => {
    // Tarik maksimal 200 dokumen SPK terakhir untuk dimasukkan ke Kanban.
    // Memakai onSnapshot agar jika ada operator lain memindahkan SPK, layar admin ini otomatis bergeser.
    const q = query(collection(db, 'spk_produksi'), orderBy('created_at', 'desc'), limit(200));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSpkList(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleArrowClick = (spk: any, currentStageIndex: number, direction: 'prev' | 'next') => {
    const targetStageIndex = direction === 'next' ? currentStageIndex + 1 : currentStageIndex - 1;
    if (targetStageIndex >= 0 && targetStageIndex < PRODUCTION_STAGES.length) {
      setModalData({ spk, targetStageIndex });
      setModalOpen(true);
    }
  };

  const handleStatusSelect = async (statusLiteral: string) => {
    if (!modalData) return;
    try {
      await updateDoc(doc(db, 'spk_produksi', modalData.spk.id), {
        status_produksi: statusLiteral
      });
      setModalOpen(false);
      setModalData(null);
    } catch (error) {
      console.error("Error updating status", error);
      alert("Gagal mengupdate status.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-mandiri-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="flex-1 h-full bg-mandiri-bg overflow-hidden flex flex-col w-full">
      {/* Header Info */}
      <div className="px-6 py-4 border-b border-neutral-800 bg-[#0A0A0A] shrink-0">
        <h2 className="text-xl font-black text-white">Kanban SPK Manager</h2>
        <p className="text-xs text-gray-500">Pindahkan kartu menggunakan tombol panah untuk memproses pesanan ke tahap produksi berikutnya.</p>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 custom-scrollbar">
        <div className="flex gap-4 h-full min-w-max pb-4">
          {PRODUCTION_STAGES.map((stage, stageIndex) => {
            // Get SPKs for this stage
            const stageSpks = spkList.filter(spk => stage.matches.includes(spk.status_produksi || 'ANTRIAN PRINT'));

            return (
              <div key={stage.label} className={`w-[280px] h-full flex flex-col rounded-2xl border ${stage.columnBorder} ${stage.columnBg}`}>
                <div className="p-4 border-b border-neutral-800/50 flex justify-between items-center shrink-0">
                  <h3 className={`font-black text-sm tracking-widest ${stage.textColor}`}>{stage.label}</h3>
                  <span className="bg-black/50 text-gray-400 text-[10px] font-bold px-2 py-1 rounded-lg">{stageSpks.length}</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {stageSpks.map(spk => {
                    const rawId = spk.order_id || spk.spk_id || 'UNKNOWN';
                    const maskedId = rawId.length > 9 ? `${rawId.substring(0,6)}...${rawId.substring(rawId.length-3)}` : rawId;
                    const previewUrl = spk.preview_image_mcd_url || spk.preview_image_cod_url || spk.preview_image_ext_url;
                    
                    return (
                      <div key={spk.id} className="bg-[#111] border border-[#222] rounded-xl p-3 flex flex-col shadow-sm group hover:border-mandiri-primary/30 transition-colors">
                        {/* Image + Info Row */}
                        <div className="flex gap-3 mb-3">
                          <div className="w-[60px] aspect-square rounded-lg bg-[#0A0A0A] border border-neutral-800 overflow-hidden shrink-0">
                            {previewUrl ? (
                               <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />
                            ) : (
                               <div className="w-full h-full flex flex-col items-center justify-center opacity-50"><ImageIcon size={16}/></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="font-black text-[10px] text-mandiri-primary bg-mandiri-primary/10 inline-block px-1.5 py-0.5 rounded mb-1">{maskedId}</div>
                             <h4 className="font-bold text-xs text-white line-clamp-2 leading-snug">{spk.nama_customer}</h4>
                          </div>
                        </div>
                        
                        {/* Specific Literal Status */}
                        <div className="text-[9px] font-bold text-gray-500 mb-3 truncate bg-black/50 px-2 py-1.5 rounded-lg border border-neutral-800/50">
                          STATUS: <span className="text-white ml-1">{spk.status_produksi || 'ANTRIAN PRINT'}</span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-auto">
                          <button 
                            disabled={stageIndex === 0}
                            onClick={() => handleArrowClick(spk, stageIndex, 'prev')}
                            className="flex-1 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-neutral-900 border border-neutral-800 rounded-lg py-1.5 flex justify-center items-center text-gray-400 hover:text-white transition-colors"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button 
                            disabled={stageIndex === PRODUCTION_STAGES.length - 1}
                            onClick={() => handleArrowClick(spk, stageIndex, 'next')}
                            className="flex-1 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-neutral-900 border border-neutral-800 rounded-lg py-1.5 flex justify-center items-center text-gray-400 hover:text-white transition-colors"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Selection */}
      {modalOpen && modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <X size={20} />
            </button>
            <h3 className="text-lg font-black text-white mb-2">Pindah ke: {PRODUCTION_STAGES[modalData.targetStageIndex].label}</h3>
            <p className="text-xs text-gray-400 mb-6">Pilih status spesifik yang sesuai dengan keadaan aktual SPK ini.</p>
            
            <div className="flex flex-col gap-3">
              {PRODUCTION_STAGES[modalData.targetStageIndex].matches.map(statusLiteral => (
                <button
                  key={statusLiteral}
                  onClick={() => handleStatusSelect(statusLiteral)}
                  className={`w-full p-4 rounded-xl font-bold text-sm text-left border border-neutral-800 hover:border-mandiri-primary hover:bg-mandiri-primary/10 transition-colors ${PRODUCTION_STAGES[modalData.targetStageIndex].textColor}`}
                >
                  {statusLiteral}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
