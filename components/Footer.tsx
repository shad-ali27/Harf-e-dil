
import React, { useState } from 'react';

interface FooterProps {
  onAdminClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  const [userPoetry, setUserPoetry] = useState('');

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleSend = () => {
    if (!userPoetry.trim()) {
      alert("Pehle apni shayari naseeb karein...");
      return;
    }
    const subject = encodeURIComponent("Harf-e-Ali: Nayi Shayari Peshkash");
    const body = encodeURIComponent(`As-salamu alaykum,\n\nMain apni likhi hui shayari aapki library ke liye bhejna chahta hoon.\n\nShayari:\n${userPoetry}\n\n— Mere Alfaaz`);
    window.location.href = `mailto:projectsofshaddy@gmail.com?subject=${subject}&body=${body}`;
    setUserPoetry('');
  };

  return (
    <footer id="contact" className="bg-burgundy text-cream pt-32 pb-16 px-6 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gold/5 rounded-full -mr-40 -mt-40 blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cream/5 rounded-full -ml-32 -mb-32 blur-[80px]"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 border-b border-cream/10 pb-24 mb-16">
        <div className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-5xl font-serif font-bold tracking-tight">Harf-e-Ali</h2>
            <div className="w-24 h-1.5 bg-gold rounded-full opacity-60"></div>
          </div>
          <p className="font-sans opacity-70 leading-relaxed max-w-sm text-lg font-medium">
            Dil se dil tak pahuchne waale alfaaz. Humari koshish hai ki aapke har jazbaat ko humari shayari ek naya mod de.
          </p>
          <div className="flex space-x-8 pt-6">
            {/* Instagram - Official complete glyph logo */}
            <a 
              href="https://www.instagram.com/shadalix19?igsh=MnlqbjQ5bnBkZ2k5" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-5 bg-cream/5 rounded-[1.5rem] hover:bg-gold hover:text-burgundy transition-all duration-500 shadow-2xl group border border-cream/5"
            >
              <svg className="w-7 h-7 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36.105.413 2.227.057 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.413 2.227-.217.562-.477.96-.896 1.382-.419.419-.819.679-1.381.896-.422.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.413-.562-.217-.96-.477-1.382-.896-.419-.42-.679-.819-.896-1.381-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.249-1.805.412-2.227.217-.562.477-.96.896-1.382.42-.419.819-.679 1.381-.896.422-.164 1.057-.36 2.227-.413 1.266-.057 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.277.057-2.15.26-2.914.557-.79.307-1.458.718-2.123 1.383-.665.665-1.076 1.333-1.383 2.123-.297.764-.5 1.637-.557 2.914-.059 1.28-.073 1.688-.073 4.947s.014 3.667.072 4.947c.058 1.277.26 2.15.557 2.914.307.79.718 1.458 1.383 2.123.665.665 1.333 1.076 2.123 1.383.764.297 1.637.5 2.914.557 1.28.059 1.688.073 4.947.073s3.667-.014 4.947-.072c1.277-.058 2.15-.26 2.914-.557.79-.307 1.458-.718 2.123-1.383.665-.665 1.076-1.333 1.383-2.123.297-.764.5-1.637.557-2.914.059-1.28.073-1.688.073-4.947s-.014-3.667-.072-4.947c-.058-1.277-.26-2.15-.557-2.914-.307-.79-.718-1.458-1.383-2.123-.665-.665-1.333-1.076-2.123-1.383-.764-.297-1.637-.5-2.914-.557-1.28-.059-1.688-.073-4.947-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            {/* Email */}
            <a 
              href="mailto:projectsofshaddy@gmail.com" 
              className="p-5 bg-cream/5 rounded-[1.5rem] hover:bg-gold hover:text-burgundy transition-all duration-500 shadow-2xl group border border-cream/5"
            >
              <svg className="w-7 h-7 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="space-y-12">
          <h3 className="text-2xl font-serif font-bold text-gold tracking-wide">Quick Links</h3>
          <ul className="space-y-6 font-sans opacity-80 text-lg font-medium">
            <li>
              <button onClick={() => scrollTo('#home')} className="hover:text-gold transition-all flex items-center group">
                <span className="w-0 group-hover:w-6 h-px bg-gold mr-0 group-hover:mr-4 transition-all duration-500"></span>
                Home Journey
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo('#categories')} className="hover:text-gold transition-all flex items-center group">
                <span className="w-0 group-hover:w-6 h-px bg-gold mr-0 group-hover:mr-4 transition-all duration-500"></span>
                Categories
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo('#library')} className="hover:text-gold transition-all flex items-center group">
                <span className="w-0 group-hover:w-6 h-px bg-gold mr-0 group-hover:mr-4 transition-all duration-500"></span>
                Poetry Library
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo('#about')} className="hover:text-gold transition-all flex items-center group">
                <span className="w-0 group-hover:w-6 h-px bg-gold mr-0 group-hover:mr-4 transition-all duration-500"></span>
                Essence
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-gold tracking-wide">Apni Shayari Bhejein</h3>
            <p className="font-sans opacity-70 text-lg leading-relaxed max-w-sm">
              Apne dil ke alfaaz humein bhejein, hum use library mein shamil karein.
            </p>
          </div>
          
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col group bg-cream/5 p-4 rounded-[2rem] border border-cream/10 focus-within:border-gold/30 transition-all space-y-4">
              <textarea 
                value={userPoetry}
                onChange={(e) => setUserPoetry(e.target.value)}
                placeholder="Apni shayari yahan likhein..." 
                rows={3}
                className="bg-transparent px-4 py-2 w-full focus:outline-none text-cream text-base placeholder:opacity-30 placeholder:font-medium resize-none custom-scrollbar"
              />
              <button 
                onClick={handleSend}
                className="bg-gold text-burgundy w-full py-4 rounded-[1.5rem] font-black hover:bg-white transition-all text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95 whitespace-nowrap"
              >
                SEND
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-t border-cream/5 pt-12 space-y-8 md:space-y-0">
        <p className="opacity-30 text-[11px] font-sans tracking-[0.4em] uppercase font-bold">© 2026 Harf-e-Ali. Made with Ishq.</p>
        
        <div className="flex items-center space-x-12">
          <button 
            onClick={onAdminClick} 
            className="text-[11px] font-black uppercase tracking-[0.5em] text-gold/60 hover:text-gold transition-all border-b border-transparent hover:border-gold/30 pb-1"
          >
            Admin Panel
          </button>
          <span className="font-serif italic text-2xl normal-case tracking-normal text-gold/40 select-none">Harf-e-Ali</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
