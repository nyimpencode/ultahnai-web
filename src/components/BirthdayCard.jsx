import React, { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';

export default function BirthdayCard() {
  const audioRef = useRef(null);

  const [isDisconnected, setIsDisconnected] = useState(() => {
    return localStorage.getItem('web_telah_hilang') === 'true';
  });

  const [step, setStep] = useState(0); 
  const [nama, setNama] = useState('');
  const [pesan, setPesan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

 const slides = [
    { icon: "✉️", text: "Hai... Ada sepucuk surat kecil yang mau aku sampaikan ke kamu hari ini." },
    { icon: "🎂", text: "Selamat ulang tahun ya! Semoga panjang umur, sehat selalu, dan semua yang kamu semogakan bisa segera terwujud." },
    { icon: "⏳", text: "Kalau diingat-ingat, kita udah saling kenal dari zaman sekolah dulu ya. Nggak kerasa waktu cepat banget berlalu." },
    { icon: "🧸", text: "Oh iya, soal boneka itu... murni cuma kenang-kenangan dari aku ya naa. Sama sekali bukan bermaksud buat nembak kok, santai aja hahaha." },
    { icon: "🍂", text: "Aku paham banget mungkin kamu udah punya seseorang yang lagi kamu suka. Jadi, anggap aja ini murni pemberian dari seorang teman." },
    { icon: "🔥", text: "Ke depannya boneka itu mau kamu simpan, kasih ke orang lain, atau mau dibakar sekalian juga bebas terserah kamu hahaha." },
    { icon: "🐒", text: " Owh iya semangat ya push glory nya.... season kemaren udh 600 match malah stuck honor jir hahaha, semoga season ini kamu imortal ya." },
    { icon: "✨", text: "Terima kasih ya udah menjadi bagian dari perjalanan tumbuh dewasaku sampai sekarang. Tetap jadi orang baik!" }
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
         localStorage.setItem('web_telah_hilang', 'true'); 
      }, 4000);

    }, 400);
  };

  if (isDisconnected) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] flex flex-col items-center justify-center p-6 text-stone-700 font-sans cursor-default select-none animate-fade">
        <div className="max-w-sm w-full text-left bg-white border border-stone-200/80 p-8 rounded-2xl shadow-sm">
          <div className="text-4xl mb-4">🦖</div>
          <h1 className="text-xl font-bold text-stone-800 mb-2">Situs tidak dapat dijangkau</h1>
          <p className="text-stone-500 mb-6 text-xs leading-relaxed">
            Koneksi ke server terputus tiba-tiba. Halaman ini sudah kedaluwarsa, dihapus secara permanen, atau memori sesi telah dihancurkan.
          </p>
          <div className="flex gap-4 items-center justify-between border-t border-stone-100 pt-4">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-stone-800 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-stone-900 active:scale-95 transition-all shadow-sm"
            >
              Muat Ulang
            </button>
            <span className="text-[10px] text-stone-400 font-mono tracking-wider">ERR_CONNECTION_CLOSED</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleScreenClick}
      className={`min-h-screen bg-[#F4F1EA] text-stone-800 flex flex-col items-center justify-center p-5 overflow-hidden relative selection:bg-stone-200 transition-all duration-1000 ${step > slides.length ? 'cursor-default' : 'cursor-pointer'} ${isSuccess ? 'opacity-0 scale-95 blur-sm' : 'opacity-100'}`}
    >
      <audio ref={audioRef} loop>
        <source src="/lagu-romantis.mp3" type="audio/mpeg" />
      </audio>

      {step === 0 ? (
        <div className="text-center animate-fade flex flex-col items-center max-w-sm px-4">
          <div className="text-5xl mb-6 text-stone-600 opacity-80 animate-bounce" style={{ animationDuration: '3s' }}>✉️</div>
          <h1 className="font-serif font-medium text-lg text-stone-800 tracking-wide">Ada sepucuk surat untukmu.</h1>
          <p className="text-stone-400 mt-4 text-[10px] tracking-[0.2em] uppercase italic bg-stone-200/40 px-3 py-1.5 rounded-full">(Sentuh untuk membuka)</p>
        </div>

      ) : step <= slides.length ? (
        <div key={step} className="bg-white border border-stone-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.02)] rounded-2xl p-8 text-center w-full max-w-sm animate-fade relative border-b-[4px] border-b-stone-300">
          <div className="w-full mb-6 flex items-center justify-center">
             <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-2xl border border-stone-100 shadow-inner">
                {slides[step - 1].icon}
             </div>
          </div>
          
          <p className="font-serif text-stone-700 text-[15px] leading-relaxed min-h-[100px] flex items-center justify-center px-2">
            <span className="text-center">{slides[step - 1].text}</span>
          </p>
          
          <div className="w-16 h-[1px] bg-stone-200 mx-auto mt-6 mb-3"></div>
          <p className="text-stone-400 text-[9px] uppercase tracking-widest animate-pulse">Ketuk untuk lanjut</p>
        </div>

      ) : (
         <div className="bg-white border border-stone-200/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] p-8 rounded-2xl animate-fade w-full max-w-sm flex flex-col items-center min-h-[440px] relative border-b-[4px] border-b-stone-300">
            <div className="text-3xl mb-3 opacity-70">🖋️</div>
            <h1 className="font-serif text-xl font-semibold text-stone-800 tracking-wide">Selesai.</h1>
            <div className="w-6 h-[1px] bg-stone-400 mt-2 mb-4"></div>

            <div className="relative w-full flex-1 flex flex-col justify-between z-10">
              <div className={`w-full transition-all duration-1000 ease-in-out flex flex-col flex-1 justify-between ${isSuccess ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                <form onSubmit={handleKirimPesan} className="flex flex-col gap-5 text-left w-full mt-2 flex-1 justify-between">
                  <p className="text-stone-500 font-serif text-xs leading-relaxed text-center italic px-1">
                     Tolong tulis pesan kepadaku dan nantinya pesan ini akan hilang bersama web ini, terima kasih.
                  </p>
                  
                  <div className="flex flex-col gap-4 my-2">
                    <input 
                      type="text" 
                      placeholder="Nama kamu..." 
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      className="w-full px-1 py-2 border-b border-stone-200 outline-none text-xs bg-transparent focus:border-stone-500 transition-colors text-stone-800 font-serif placeholder:text-stone-300 placeholder:italic"
                      required
                    />
                    <textarea 
                      placeholder="Tulis pesan atau kesan terakhirmu di sini..." 
                      rows="3"
                      value={pesan}
                      onChange={(e) => setPesan(e.target.value)}
                      className="w-full px-1 py-2 border-b border-stone-200 outline-none text-xs bg-transparent focus:border-stone-500 transition-colors resize-none text-stone-800 font-serif placeholder:text-stone-300 placeholder:italic leading-relaxed"
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" disabled={isSubmitting} className="w-full bg-stone-800 hover:bg-stone-900 text-white font-serif tracking-widest text-[11px] py-3.5 rounded-xl transition-all active:scale-98 disabled:opacity-50 shadow-sm uppercase font-medium mt-auto">
                    {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                  </button>
                </form>
              </div>

              <div className={`absolute inset-0 flex flex-col items-center justify-center w-full transition-all duration-1000 ease-out z-0 ${isSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <p className="font-serif text-xl text-stone-800 mb-2">Pesan Terkirim.</p>
                <p className="text-stone-400 text-xs italic text-center">Surat ini akan segera memudar... <br/>Sampai jumpa.</p>
              </div>
            </div>
         </div>
      )}

      {/* FOOTER NAMA KAMU (Hanya muncul sebelum pesan terkirim) */}
      <div 
        className={`absolute bottom-6 text-[10px] text-stone-400/80 font-serif tracking-widest uppercase transition-opacity duration-1000 
        ${isSuccess ? 'opacity-0' : 'opacity-100'}`}
      >
        ~ Dibuat oleh Indra Suliwa ~
      </div>

    </div>
  );
}