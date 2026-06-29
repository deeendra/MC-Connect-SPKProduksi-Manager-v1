// Konfigurasi tahapan produksi dan warnanya untuk Kanban & Papan Progress
export const PRODUCTION_STAGES = [
  { label: 'PRINT', matches: ['ANTRIAN PRINT', 'PRINTING', 'SELESAI PRINT', 'REVISI PRINT'], pastColor: 'bg-blue-500/30', activeColor: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]', textColor: 'text-blue-400', columnBg: 'bg-blue-950/20', columnBorder: 'border-blue-900/50' },
  { label: 'PRESS', matches: ['PRESS', 'SELESAI PRESS'], pastColor: 'bg-indigo-500/30', activeColor: 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]', textColor: 'text-indigo-400', columnBg: 'bg-indigo-950/20', columnBorder: 'border-indigo-900/50' },
  { label: 'HITUNG', matches: ['SORTIR & HITUNG', 'POLA KURANG LENGKAP', 'SORTIR & HITUNG REVISI'], pastColor: 'bg-fuchsia-500/30', activeColor: 'bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.6)]', textColor: 'text-fuchsia-400', columnBg: 'bg-fuchsia-950/20', columnBorder: 'border-fuchsia-900/50' },
  { label: 'JAHIT', matches: ['JAHIT', 'SELESAI JAHIT'], pastColor: 'bg-purple-500/30', activeColor: 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]', textColor: 'text-purple-400', columnBg: 'bg-purple-950/20', columnBorder: 'border-purple-900/50' },
  { label: 'PACK', matches: ['PACKING', 'SELESAI PACKING'], pastColor: 'bg-pink-500/30', activeColor: 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]', textColor: 'text-pink-400', columnBg: 'bg-pink-950/20', columnBorder: 'border-pink-900/50' },
  { label: 'SIAP', matches: ['SIAP DIKIRIM/DIAMBIL'], pastColor: 'bg-emerald-500/30', activeColor: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]', textColor: 'text-emerald-400', columnBg: 'bg-emerald-950/20', columnBorder: 'border-emerald-900/50' },
  { label: 'FINISH', matches: ['DIKIRIM', 'DIAMBIL'], pastColor: 'bg-green-500/30', activeColor: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]', textColor: 'text-green-400', columnBg: 'bg-green-950/20', columnBorder: 'border-green-900/50' }
];
