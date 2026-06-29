import { X, Printer, ExternalLink, Calendar, Phone, User, Package, FileText, Image as ImageIcon } from 'lucide-react';
import { useEffect } from 'react';

const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', 'XXXL', '4XL', '5XL', '6XL', 'ALL SIZE'];
const getSizeRank = (size: string) => {
  const upper = (size || '').toString().toUpperCase().trim();
  const index = SIZE_ORDER.indexOf(upper);
  return index === -1 ? 999 : index;
};

interface SpkDetailModalProps {
  spk: any;
  onClose: () => void;
}

export default function SpkDetailModal({ spk, onClose }: SpkDetailModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!spk) return null;

  const totalBaju = spk.items?.reduce((acc: number, item: any) => acc + (item.total_qty || 0), 0) || 0;
  const previewUrl = spk.gambar_preview || spk.preview_design_cod_url || spk.preview_design_extras_url || spk.preview_image_mcd_url || spk.preview_image_cod_url || spk.preview_image_ext_url;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800 bg-neutral-950/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-3 py-1 bg-[#F7C600]/20 text-[#F7C600] text-xs font-black rounded-lg uppercase tracking-wider border border-[#F7C600]/50">
                {spk.tipe_pesanan}
              </span>
              <span className="px-3 py-1 bg-neutral-800 text-white text-xs font-bold rounded-lg uppercase tracking-wider border border-neutral-700">
                {spk.status_produksi || 'ANTRIAN PRINT'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{spk.spk_id}</h2>
            {spk.order_id && spk.tipe_pesanan === 'EX' && (
              <p className="text-xs text-gray-500 font-bold mt-1">Induk SPK: {spk.order_id}</p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-neutral-800 hover:bg-red-900/50 text-gray-400 hover:text-red-400 rounded-xl flex items-center justify-center transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
          
          {/* Metadata Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1: Preview Desain */}
            <div className="bg-black/50 p-5 rounded-2xl border border-neutral-800 flex flex-col">
              <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                <ImageIcon size={16} className="text-[#F7C600]" /> Preview Desain
              </h3>
              <div className="w-full aspect-square min-h-[200px] bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-neutral-600 flex flex-col items-center p-4">
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-center">No Image<br/>Available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Box 2: Data Pemesan */}
            <div className="bg-black/50 p-5 rounded-2xl border border-neutral-800">
              <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                <User size={16} className="text-[#F7C600]" /> Data Pemesan
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Nama Customer</p>
                  <p className="text-sm text-white font-medium">{spk.nama_customer || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Phone size={12} /> Nomor HP
                  </p>
                  <p className="text-sm text-white font-medium">{spk.nomor_hp || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Customer ID</p>
                  <p className="text-sm text-white font-medium">{spk.customer_id || '-'}</p>
                </div>
              </div>
            </div>

            <div className="bg-black/50 p-5 rounded-2xl border border-neutral-800">
              <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-[#F7C600]" /> Tenggat Waktu & Referensi
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Tanggal Dibuat</p>
                  <p className="text-sm text-white font-medium">
                    {spk.created_at?.toDate ? new Date(spk.created_at.toDate()).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Tanggal Deadline</p>
                  <p className="text-sm text-white font-medium">
                    {spk.deadline_date ? new Date(spk.deadline_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Desain ID</p>
                  <p className="text-sm text-white font-medium">{spk.design_id || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rincian Pesanan Section */}
          <div>
            <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
              <Package size={16} className="text-[#F7C600]" /> Rincian Item Pesanan
              <span className="ml-auto px-2 py-1 bg-neutral-800 rounded-md text-xs font-bold text-gray-400">Total: {totalBaju} Pcs</span>
            </h3>

            <div className="space-y-4">
              {spk.items?.map((item: any, idx: number) => (
                <div key={idx} className="bg-black border border-neutral-800 rounded-2xl overflow-hidden">
                  {/* Item Header */}
                  <div className="bg-neutral-900/50 p-4 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-base font-black text-white">Item {idx + 1}: {item.model_pesanan}</h4>
                      <p className="text-xs text-gray-400 font-medium">Kategori: {item.kategori_model}</p>
                    </div>
                    <div className="text-sm font-bold text-[#F7C600]">
                      Qty: {item.total_qty} Pcs
                    </div>
                  </div>
                  
                  {/* Item Details */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400"><span className="font-bold text-gray-500">Tipe Rincian:</span> {item.tipe_rincian}</p>
                      {item.varian_jahit_atasan && <p className="text-xs text-gray-400"><span className="font-bold text-gray-500">Jahit Atasan:</span> {item.varian_jahit_atasan}</p>}
                      {item.varian_lengan_atasan && <p className="text-xs text-gray-400"><span className="font-bold text-gray-500">Lengan Atasan:</span> {item.varian_lengan_atasan}</p>}
                      {item.varian_jahit_bawahan && <p className="text-xs text-gray-400"><span className="font-bold text-gray-500">Jahit Bawahan:</span> {item.varian_jahit_bawahan}</p>}
                      {item.inventori_press && <p className="text-xs text-gray-400"><span className="font-bold text-gray-500">Inventori Press:</span> {item.inventori_press}</p>}
                    </div>

                    {/* Size Table */}
                    <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left text-xs min-w-[300px]">
                        <thead className="bg-neutral-800 text-gray-400 font-bold">
                          <tr>
                            {item.tipe_rincian === 'DENGAN NAMA' ? (
                              <>
                                <th className="px-3 py-2 w-10">No.</th>
                                <th className="px-3 py-2">Nama di Kaos</th>
                                <th className="px-3 py-2 text-right w-20">Size</th>
                              </>
                            ) : item.kategori_model === 'Aksesoris' ? (
                              <>
                                <th className="px-3 py-2">Catatan Tambahan</th>
                                <th className="px-3 py-2 text-right w-20">Qty</th>
                              </>
                            ) : (
                              <>
                                <th className="px-3 py-2">Size</th>
                                <th className="px-3 py-2 text-right w-20">Qty</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800 text-gray-300">
                          {(() => {
                            const sortedData = [...(item.data_ukuran || [])].sort((a, b) => 
                              getSizeRank(a.ukuran || a.ukuran_print_aksesoris) - getSizeRank(b.ukuran || b.ukuran_print_aksesoris)
                            );
                            
                            return sortedData.map((sizeObj: any, sIdx: number) => (
                              <tr key={sIdx} className="hover:bg-white/5">
                                {item.tipe_rincian === 'DENGAN NAMA' ? (
                                  <>
                                    <td className="px-3 py-2 text-gray-500 font-medium">{sIdx + 1}</td>
                                    <td className="px-3 py-2 font-medium">{sizeObj.nama || '-'}</td>
                                    <td className="px-3 py-2 text-right font-black text-[#F7C600]">{sizeObj.ukuran || '-'}</td>
                                  </>
                                ) : item.kategori_model === 'Aksesoris' ? (
                                  <>
                                    <td className="px-3 py-2">{sizeObj.ukuran_print_aksesoris || '-'}</td>
                                    <td className="px-3 py-2 text-right font-bold">{sizeObj.qty || 0}</td>
                                  </>
                                ) : (
                                  <>
                                    <td className="px-3 py-2 font-bold">{sizeObj.ukuran || '-'}</td>
                                    <td className="px-3 py-2 text-right font-bold">{sizeObj.qty || 0}</td>
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
                    <div className="px-4 py-3 bg-red-950/20 border-t border-neutral-800">
                      <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <FileText size={12} /> Keterangan Tambahan
                      </p>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">{item.keterangan_tambahan}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row gap-3 items-center justify-end">
          <button 
            type="button"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-neutral-800 text-white hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2"
            onClick={() => alert("Fitur Cetak PDF (Hardcopy) akan dikembangkan di masa depan.")}
          >
            <Printer size={16} /> Cetak (PDF)
          </button>
          
          <button 
            type="button"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-[#F7C600] text-black hover:bg-[#E5B500] transition-colors flex items-center justify-center gap-2"
            onClick={() => alert("Membuka LKP Digital di WebApp SPKProduksi-LembarKerjaProduksi (Segera Hadir)")}
          >
            <ExternalLink size={16} /> Buka LKP Digital
          </button>
        </div>
      </div>
    </div>
  );
}
