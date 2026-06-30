import { X, Printer, ExternalLink, Calendar, User, Package, FileText, Image as ImageIcon, Copy, Share2 } from 'lucide-react';
import { useEffect } from 'react';

const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', 'XXXL', '4XL', '5XL', '6XL', 'ALL SIZE'];
const getSizeRank = (size: string) => {
  const upper = (size || '').toString().toUpperCase().trim();
  const index = SIZE_ORDER.indexOf(upper);
  return index === -1 ? 999 : index;
};

interface SpkDetailModalProps {
  spk: any;
  onClose?: () => void;
  isSharedView?: boolean;
}

export default function SpkDetailModal({ spk, onClose, isSharedView = false }: SpkDetailModalProps) {
  // Prevent body scroll when modal is open (only if it's actually a modal, not a standalone page)
  useEffect(() => {
    if (!isSharedView) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isSharedView]);

  if (!spk) return null;

  const totalBaju = spk.items?.reduce((acc: number, item: any) => acc + (item.total_qty || 0), 0) || 0;
  const previewUrl = spk.gambar_preview || spk.preview_design_cod_url || spk.preview_design_extras_url || spk.preview_image_mcd_url || spk.preview_image_cod_url || spk.preview_image_ext_url;

  // Calculate Countdown
  const deadlineDate = spk.deadline_date ? new Date(spk.deadline_date) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let countdownText = '-';
  let isLate = false;
  
  if (deadlineDate) {
    const dDate = new Date(deadlineDate);
    dDate.setHours(0, 0, 0, 0);
    const diffTime = dDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) countdownText = 'Hari Ini';
    else if (diffDays === 1) countdownText = 'Besok';
    else if (diffDays > 1) countdownText = `${diffDays} Hari Lagi`;
    else {
      countdownText = `Terlambat ${Math.abs(diffDays)} Hari`;
      isLate = true;
    }
  }

  const handleShare = () => {
    const encodedId = btoa(spk.spk_id);
    const shareUrl = `${window.location.origin}/shared/${encodedId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Link publik berhasil disalin ke clipboard! Bagikan link ini ke orang lain.');
  };

  const modalWrapperClasses = isSharedView 
    ? "min-h-screen w-full bg-neutral-900 flex flex-col mx-auto max-w-4xl shadow-2xl" 
    : "bg-neutral-900 border border-neutral-800 w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-4xl sm:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200";

  const containerClasses = isSharedView 
    ? "bg-black/60 min-h-screen w-full flex justify-center p-0 sm:p-6" 
    : "fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200 touch-none";

  return (
    <div className={containerClasses}>
      <div className={`${modalWrapperClasses} touch-auto`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-800 bg-neutral-950/50 shrink-0 gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="px-3 py-1 bg-[#F7C600]/20 text-[#F7C600] text-xs font-black rounded-lg uppercase tracking-wider border border-[#F7C600]/50">
                {spk.tipe_pesanan}
              </span>
              <span className="px-3 py-1 bg-neutral-800 text-white text-xs font-bold rounded-lg uppercase tracking-wider border border-neutral-700">
                {spk.status_produksi || 'ANTRIAN PRINT'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 min-w-0 flex-1">
              <h2 className="text-xl sm:text-3xl font-black bg-gradient-to-r from-white to-[#F7C600] bg-clip-text text-transparent truncate">
                {spk.spk_id_masked || spk.spk_id}
              </h2>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(spk.spk_id_masked || spk.spk_id);
                  alert('SPK ID disalin ke clipboard!');
                }}
                className="p-1.5 sm:p-2 rounded-lg bg-neutral-800/50 hover:bg-[#F7C600]/20 text-gray-400 hover:text-[#F7C600] border border-transparent hover:border-[#F7C600]/50 transition-all shrink-0 ml-1"
                title="Salin ID"
              >
                <Copy size={16} />
              </button>
              
              {!isSharedView && (
                <button 
                  onClick={handleShare}
                  className="p-1.5 sm:p-2 rounded-lg bg-blue-900/30 hover:bg-blue-600/30 text-blue-400 border border-blue-900/50 hover:border-blue-500/50 transition-all flex items-center gap-1.5 shrink-0"
                  title="Bagikan Link Publik (Tanpa Login)"
                >
                  <Share2 size={16} />
                  <span className="text-xs font-bold hidden sm:inline">Share</span>
                </button>
              )}
            </div>
            {spk.order_id && spk.tipe_pesanan === 'EX' && (
              <p className="text-xs text-gray-500 font-bold mt-1">Induk SPK: {spk.order_id}</p>
            )}
          </div>
          
          {!isSharedView && onClose && (
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-neutral-800 hover:bg-red-900/50 text-gray-400 hover:text-red-400 rounded-xl flex items-center justify-center transition-colors shrink-0 self-start"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 custom-scrollbar space-y-6 sm:space-y-8 pb-10">
          
          {/* Metadata Section */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
            {/* Box 1: Preview Desain */}
            <div className="lg:col-span-2 bg-black/40 backdrop-blur-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/5 flex flex-col shadow-xl">
              <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                <ImageIcon size={16} className="text-[#F7C600]" /> Preview Desain
              </h3>
              <div className="w-full aspect-square bg-neutral-900/50 rounded-xl sm:rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center relative shadow-inner">
                {spk.design_id && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-white/10 shadow-lg z-10">
                    <span className="text-[10px] sm:text-xs font-black text-white tracking-wider">{spk.design_id}</span>
                  </div>
                )}
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
                ) : (
                  <div className="text-neutral-600 flex flex-col items-center p-4">
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-center">No Image<br/>Available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Box 2: Informasi Pesanan (Gabungan) */}
            <div className="lg:col-span-3 bg-black/40 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/5 shadow-xl flex flex-col justify-center">
              <h3 className="text-sm font-black text-white mb-4 sm:mb-6 flex items-center gap-2 border-b border-white/5 pb-3 sm:pb-4">
                <Calendar size={16} className="text-[#F7C600]" /> Informasi Pesanan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                
                {/* Customer ID (Label Removed) */}
                <div className="bg-white/5 p-4 rounded-xl sm:rounded-2xl border border-white/5 flex items-center gap-3">
                  <div className="p-3 bg-neutral-800 rounded-full shrink-0">
                    <User size={20} className="text-gray-400" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-lg sm:text-xl text-white font-black leading-tight truncate" title={spk.customer_id}>{spk.customer_id || '-'}</p>
                  </div>
                </div>
                
                {/* Tanggal Dibuat (Label Removed, just showing the date) */}
                <div className="bg-white/5 p-4 rounded-xl sm:rounded-2xl border border-white/5 flex items-center justify-center">
                  <p className="text-sm text-gray-300 font-bold uppercase tracking-wider text-center">
                    {spk.created_at?.toDate ? new Date(spk.created_at.toDate()).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                  </p>
                </div>
                
                {/* Countdown Deadline */}
                <div className={`p-4 rounded-xl sm:rounded-2xl border sm:col-span-2 flex flex-col sm:flex-row items-center sm:justify-between gap-3 ${isLate ? 'bg-red-950/20 border-red-500/30' : 'bg-[#F7C600]/10 border-[#F7C600]/20'}`}>
                  <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isLate ? 'text-red-400' : 'text-[#F7C600]'}`}>
                      Status Deadline
                    </p>
                    <p className={`text-xl sm:text-2xl font-black ${isLate ? 'text-red-500' : 'text-white'}`}>
                      {countdownText}
                    </p>
                  </div>
                  <div className="flex flex-col items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-4">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">TANGGAL ASLI</p>
                    <p className="text-sm text-gray-300 font-bold flex items-center gap-1.5">
                      <Calendar size={14} className="opacity-50" />
                      {spk.deadline_date ? new Date(spk.deadline_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Rincian Pesanan Section */}
          <div>
            <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
              <Package size={16} className="text-[#F7C600]" /> Rincian Item Pesanan
              <span className="ml-auto px-3 py-1.5 bg-[#F7C600]/10 border border-[#F7C600]/30 rounded-lg text-xs font-black text-[#F7C600] shadow-[0_0_10px_rgba(247,198,0,0.1)]">Total: {totalBaju} Pcs</span>
            </h3>

            <div className="space-y-4 sm:space-y-6">
              {spk.items?.map((item: any, idx: number) => (
                <div key={idx} className="bg-black/40 backdrop-blur-xl border border-[#F7C600]/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative">
                  {/* Dekorasi Aksen Kuning */}
                  <div className="absolute top-0 left-0 w-1.5 sm:w-2 h-full bg-[#F7C600]"></div>
                  
                  {/* Item Header */}
                  <div className="bg-white/5 p-4 sm:p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-5 sm:pl-8">
                    <div>
                      <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                        <span className="text-[#F7C600]">#{idx + 1}</span> {item.model_pesanan}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-400 font-medium mt-0.5 sm:mt-1">Kategori: {item.kategori_model}</p>
                    </div>
                    <div className="text-xs sm:text-sm font-black text-black bg-[#F7C600] px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl shadow-[0_0_15px_rgba(247,198,0,0.3)] self-start sm:self-auto">
                      Qty: {item.total_qty} Pcs
                    </div>
                  </div>
                  
                  {/* Item Details */}
                  <div className="p-4 sm:p-5 pl-5 sm:pl-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2 sm:space-y-3">
                      <p className="text-[11px] sm:text-xs text-gray-300"><span className="font-bold text-gray-500 w-24 sm:w-28 inline-block">Tipe Rincian</span> <span className="text-[#F7C600] font-bold">{item.tipe_rincian}</span></p>
                      {item.varian_jahit_atasan && <p className="text-[11px] sm:text-xs text-gray-300"><span className="font-bold text-gray-500 w-24 sm:w-28 inline-block">Jahit Atasan</span> {item.varian_jahit_atasan}</p>}
                      {item.varian_lengan_atasan && <p className="text-[11px] sm:text-xs text-gray-300"><span className="font-bold text-gray-500 w-24 sm:w-28 inline-block">Lengan Atasan</span> {item.varian_lengan_atasan}</p>}
                      {item.varian_jahit_bawahan && <p className="text-[11px] sm:text-xs text-gray-300"><span className="font-bold text-gray-500 w-24 sm:w-28 inline-block">Jahit Bawahan</span> {item.varian_jahit_bawahan}</p>}
                      {item.inventori_press && <p className="text-[11px] sm:text-xs text-gray-300"><span className="font-bold text-gray-500 w-24 sm:w-28 inline-block">Inv. Press</span> <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-neutral-800 rounded text-gray-200">{item.inventori_press}</span></p>}
                    </div>

                    {/* Size Table - Optimized for Mobile */}
                    <div className="bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden shadow-inner w-full">
                      <table className="w-full text-left text-[10px] sm:text-xs table-fixed">
                        <thead className="bg-black/40 text-gray-400 font-bold border-b border-white/10">
                          <tr>
                            {item.tipe_rincian === 'DENGAN NAMA' ? (
                              <>
                                <th className="px-2 sm:px-4 py-2 sm:py-3 w-8 sm:w-10">No</th>
                                <th className="px-1 sm:px-4 py-2 sm:py-3 w-[60%] sm:w-auto truncate">Nama</th>
                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-right w-12 sm:w-20 text-[#F7C600]">Size</th>
                              </>
                            ) : item.kategori_model === 'Aksesoris' ? (
                              <>
                                <th className="px-2 sm:px-4 py-2 sm:py-3 w-[70%] sm:w-auto truncate">Catatan</th>
                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-right w-12 sm:w-20 text-[#F7C600]">Qty</th>
                              </>
                            ) : (
                              <>
                                <th className="px-2 sm:px-4 py-2 sm:py-3 w-[60%] sm:w-auto">Size</th>
                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-right w-12 sm:w-20 text-[#F7C600]">Qty</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300">
                          {(() => {
                            const sortedData = [...(item.data_ukuran || [])].sort((a, b) => 
                              getSizeRank(a.ukuran || a.ukuran_print_aksesoris) - getSizeRank(b.ukuran || b.ukuran_print_aksesoris)
                            );
                            
                            return sortedData.map((sizeObj: any, sIdx: number) => (
                              <tr key={sIdx} className="hover:bg-white/10 transition-colors">
                                {item.tipe_rincian === 'DENGAN NAMA' ? (
                                  <>
                                    <td className="px-2 sm:px-4 py-1.5 sm:py-3 text-gray-500 font-medium">{sIdx + 1}</td>
                                    <td className="px-1 sm:px-4 py-1.5 sm:py-3 font-medium truncate">{sizeObj.nama || '-'}</td>
                                    <td className="px-2 sm:px-4 py-1.5 sm:py-3 text-right font-black text-[#F7C600]">{sizeObj.ukuran || '-'}</td>
                                  </>
                                ) : item.kategori_model === 'Aksesoris' ? (
                                  <>
                                    <td className="px-2 sm:px-4 py-1.5 sm:py-3 truncate">{sizeObj.ukuran_print_aksesoris || '-'}</td>
                                    <td className="px-2 sm:px-4 py-1.5 sm:py-3 text-right font-bold">{sizeObj.qty || 0}</td>
                                  </>
                                ) : (
                                  <>
                                    <td className="px-2 sm:px-4 py-1.5 sm:py-3 font-bold">{sizeObj.ukuran || '-'}</td>
                                    <td className="px-2 sm:px-4 py-1.5 sm:py-3 text-right font-bold">{sizeObj.qty || 0}</td>
                                  </>
                                )}
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Keterangan */}
                  {item.keterangan_tambahan && (
                    <div className="px-4 sm:px-5 py-3 sm:py-4 pl-5 sm:pl-8 bg-red-950/20 border-t border-red-900/30">
                      <p className="text-[10px] sm:text-xs font-bold text-red-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <FileText size={12} /> Keterangan Tambahan
                      </p>
                      <p className="text-xs sm:text-sm text-gray-300 whitespace-pre-wrap">{item.keterangan_tambahan}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {!isSharedView && (
          <div className="p-4 sm:p-6 border-t border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row gap-3 items-center justify-end shrink-0">
            <button 
              type="button"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-neutral-800 text-white hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2"
              onClick={() => alert("fitur ini nanti dulu, designernya masih sibuk urus orderan lain.")}
            >
              <Printer size={16} /> Cetak (PDF)
            </button>
            
            <button 
              type="button"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-[#F7C600] text-black hover:bg-[#E5B500] transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(247,198,0,0.2)]"
              onClick={() => alert("fitur ini nanti dulu, designernya masih sibuk urus orderan lain.")}
            >
              <ExternalLink size={16} /> Buka LKP Digital
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
