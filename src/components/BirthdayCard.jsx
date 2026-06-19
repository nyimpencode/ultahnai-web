import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function BirthdayCard() {
  const audioRef = useRef(null);

  // Cek apakah sebelumnya dia sudah pernah ngirim pesan dan menghancurkan webnya
  const [isDisconnected, setIsDisconnected] = useState(() => {
    return localStorage.getItem('web_telah_hilang') === 'true';
  });

  const [step, setStep] = useState(0); 
  const [nama, setNama] = useState('');
  const [pesan, setPesan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const slides = [
    { icon: "👀", text: "Hai... Ada yang mau aku sampein nih buat kamu." },
    { icon: "🎉", text: "Hari ini hari spesial kamu kan? Selamat ulang tahun ya!" },
    { icon: "✨", text: "Semoga hari-harimu ke depan selalu secerah warna kuning, dan seindah warna pink ini." },
    { icon: "🫣", text: "Walaupun selama ini aku cuma jadi penonton dari jauh hahaha..." },
    { icon: "😊", text: "Tapi ngelihat kamu bahagia aja udah cukup bikin aku ikut seneng kok." },
    { icon: "🚀", text: "Sukses terus ya, sehat selalu, dan semoga semua yang kamu semogakan segera terwujud!" }
  ];

  const handleScreenClick = () => {
    if (step > slides.length || isDisconnected) return;

    if (step === 0 && audioRef.current) {
      audioRef.current.play().catch(err => console.log("Audio diblokir:", err));
    }
    
    if (step <= slides.length) {
      setStep(step + 1);
    }
  };

  const handleKirimPesan = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from('ucapan_balasan')
      .insert([{ nama: nama, pesan: pesan }]);

    if (error) console.error("Database Error:", error);

    setTimeout(() => {
      setIsSuccess(true);
      setIsSubmitting(false);

      setTimeout(() => {
         if (audioRef.current) audioRef.current.pause();
         setIsDisconnected(true);
         // KUNCI PERMANEN: Tanamkan memori di browsernya bahwa web ini sudah "hilang"
         localStorage.setItem('web_telah_hilang', 'true'); 
      }, 4000);

    }, 400);
  };

  // ==========================================
  // TAMPILAN 4: LAYAR ERROR (PERMANEN)
  // ==========================================
  if (isDisconnected) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-gray-800 font-sans cursor-default select-none">
        <div className="max-w-md w-full text-left">
          <div className="text-5xl mb-5">🦖</div>
          <h1 className="text-2xl font-bold mb-2">Situs ini tidak dapat dijangkau</h1>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Koneksi ke server tiba-tiba terputus. Halaman web ini mungkin telah dihapus secara permanen atau memori tidak lagi tersedia.
          </p>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 active:scale-95 transition-transform"
            >
              Muat Ulang
            </button>
            <span className="text-xs text-gray-400 font-mono">ERR_CONNECTION_CLOSED</span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN UTAMA WEB ULTAH
  // ==========================================
  return (
    <div 
      onClick={handleScreenClick}
      className={`min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-pink-500 flex flex-col items-center justify-center p-4 overflow-hidden relative selection:bg-transparent transition-all duration-700 ${step > slides.length ? 'cursor-default' : 'cursor-pointer'} ${isSuccess ? 'brightness-50 grayscale-[30%]' : ''}`}
    >
      <audio ref={audioRef} loop>
        <source src="/lagu-romantis.mp3" type="audio/mpeg" />
      </audio>

      {step === 0 ? (
        <div className="text-center animate-pulse">
          <div className="text-7xl mb-4 animate-bounce">💌</div>
          <h1 className="text-white font-bold text-2xl drop-shadow-md">Ada pesan buat kamu...</h1>
          <p className="text-white/80 mt-2 text-sm">(Tap layar di mana aja buat buka)</p>
        </div>

      ) : step <= slides.length ? (
        <div key={step} className="bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-6 text-center w-full max-w-sm animate-fade">
          <div className="w-full h-48 bg-white/40 rounded-2xl mb-6 shadow-inner border border-white/50 flex items-center justify-center relative">
             <span className="text-8xl animate-bounce" style={{ animationDuration: '2s' }}>
                {slides[step - 1].icon}
             </span>
          </div>
          <p className="text-pink-900 font-semibold text-lg leading-relaxed drop-shadow-sm min-h-[100px] flex items-center justify-center">
            {slides[step - 1].text}
          </p>
          <p className="text-pink-700/50 text-xs mt-4 animate-pulse">- Tap layar untuk lanjut -</p>
        </div>

      ) : (
         <div className="text-center bg-white/20 backdrop-blur-lg p-7 rounded-3xl border border-white/30 shadow-2xl animate-fade w-full max-w-sm flex flex-col items-center min-h-[480px]">
            <div className="text-5xl mb-2 animate-bounce">🎂</div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg mb-1">Happy Birthday!</h1>
            <p className="text-pink-100 font-medium text-sm mb-2">Terima kasih udah baca sampai sini.</p>

            <div className="relative w-full flex-1 flex items-center justify-center mt-2">
              <div className={`absolute inset-0 flex flex-col justify-center w-full transition-all duration-[1300ms] ease-in-out z-10 ${isSuccess ? 'opacity-0 scale-50 blur-lg pointer-events-none' : 'opacity-100 scale-100'}`}>
                <form onSubmit={handleKirimPesan} className="bg-white/40 p-5 rounded-2xl shadow-lg border border-white/50 flex flex-col gap-3 text-left w-full">
                  <p className="text-pink-950 font-bold text-sm mb-1 leading-relaxed text-center px-1">
                     tolong tulis pesan kepadaku dan nantinya pesan ini akan hilang bersama web ini, termakasi
                  </p>
                  
                  <input 
                    type="text" 
                    placeholder="Namamu..." 
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-white/40 outline-none text-sm bg-white/70 focus:bg-white/90 transition-all text-pink-900 placeholder:text-pink-800/50 shadow-inner"
                    required
                  />
                  
                  <textarea 
                    placeholder="Pesan terakhir kamu di sini..." 
                    rows="3"
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-white/40 outline-none text-sm bg-white/70 focus:bg-white/90 transition-all resize-none text-pink-900 placeholder:text-pink-800/50 shadow-inner"
                    required
                  ></textarea>
                  
                  <button type="submit" disabled={isSubmitting} className="bg-pink-600/90 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50 mt-1 shadow-md flex justify-center items-center gap-2 text-sm tracking-wide">
                    {isSubmitting ? 'Mengirim...' : 'Kirim Pesan Terakhir 🕊️'}
                  </button>
                </form>
              </div>

              <div className={`absolute inset-0 flex flex-col items-center justify-center w-full transition-all duration-[2000ms] delay-500 ease-out z-0 ${isSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}`}>
                <p className="text-3xl text-white font-black drop-shadow-lg mb-2 leading-snug">Pesan Terkirim.</p>
                <p className="text-pink-50 text-sm font-medium">Web ini akan segera memudar... <br/> Makasih ya.</p>
                <div className="text-xs text-white/50 mt-8 animate-pulse">(Selamat tinggal...)</div>
              </div>
            </div>
         </div>
      )}
    </div>
  );
}