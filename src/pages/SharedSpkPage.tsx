import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import SpkDetailModal from '../components/SpkDetailModal';
import { Loader2, AlertCircle } from 'lucide-react';

export default function SharedSpkPage() {
  const { encodedId } = useParams();
  const [spk, setSpk] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSpk = async () => {
      try {
        if (!encodedId) throw new Error('ID tidak valid');
        
        // Decode the ID
        const decodedId = atob(encodedId);
        
        // Fetch from Firestore
        const q = query(collection(db, 'spk_produksi'), where('spk_id', '==', decodedId));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          throw new Error('Data SPK tidak ditemukan atau URL salah.');
        }
        
        // Get the first matching doc
        const spkData = querySnapshot.docs[0].data();
        setSpk(spkData);
      } catch (err: any) {
        console.error("Failed to fetch shared SPK:", err);
        setError('Gagal memuat data SPK atau link tidak valid.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpk();
  }, [encodedId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-4">
        <Loader2 className="animate-spin text-[#F7C600] mb-4" size={48} />
        <p className="text-white font-medium">Memuat data SPK...</p>
      </div>
    );
  }

  if (error || !spk) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-950/30 border border-red-900/50 p-8 rounded-2xl max-w-md w-full">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // Render the modal directly as a page
  return (
    <div className="min-h-screen bg-[#080808] relative">
      <SpkDetailModal spk={spk} isSharedView={true} />
    </div>
  );
}
