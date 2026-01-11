
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
    <footer id="contact" className="bg-burgundy text-cream pt-32 pb-16 px-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gold/5 rounded-full -mr-40 -mt-40 blur-[120px]"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 border-b border-cream/10 pb-24 mb-16">
        <div className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-5xl font-serif font-bold tracking-tight">Harf-e-Ali</h2>
            <div className="w-24 h-1.5 bg-gold rounded-full opacity-60"></div>
          </div>
          <p className="font-accent italic opacity-70 leading-relaxed max-w-sm text-xl font-medium">
            "Hum to putle hai, koi door le rakha hai hamari..." - Exploring the silence within through Hinglish poetry.
          </p>
          <div className="flex space-x-6 pt-6">
            <a 
              href="https://www.instagram.com/shadalix19?igsh=MnlqbjQ5bnBkZ2k5" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-5 bg-cream/5 rounded-2xl hover:bg-gold hover:text-burgundy transition-all duration-500 group border border-cream/5"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2h8.5C19.425 2 22 4.575 22 7.75v8.5C22 19.425 19.425 22 16.25 22h-8.5C4.575 22 2 19.425 2 16.25v-8.5C2 4.575 4.575 2 7.75 2zm0 1.5C5.408 3.5 3.5 5.408 3.5 7.75v8.5c0 2.342 1.908 4.25 4.25 4.25h8.5c2.342 0 4.25-1.908 4.25-4.25v-8.5c0-2.342-1.908-4.25-4.25-4.25h-8.5zM12 7c2.761 0 5 2.239 5 5s-2.239 5-5 5-5-2.239-5-5 2.239-5-5-5zm0 1.5c-1.933 0-3.5 1.567-3.5 3.5s1.567 3.5 3.5 3.5 3.5-1.567 3.5-3.5-1.567-3.5-3.5-3.5zM17.5 5.25a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" />
              </svg>
            </a>
            <a 
              href="mailto:projectsofshaddy@gmail.com" 
              className="p-5 bg-cream/5 rounded-2xl hover:bg-gold hover:text-burgundy transition-all duration-500 group border border-cream/5"
              aria-label="Email"
            >
              <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="space-y-12">
          <h3 className="text-2xl font-serif font-bold text-gold tracking-wide">Quick Links</h3>
          <ul className="space-y-6 opacity-80 text-lg font-medium">
            <li><button onClick={() => scrollTo('#home')} className="hover:text-gold transition-all flex items-center group font-sans uppercase text-xs tracking-widest"><span className="w-0 group-hover:w-6 h-px bg-gold mr-0 group-hover:mr-4 transition-all duration-500"></span>Home Journey</button></li>
            <li><button onClick={() => scrollTo('#categories')} className="hover:text-gold transition-all flex items-center group font-sans uppercase text-xs tracking-widest"><span className="w-0 group-hover:w-6 h-px bg-gold mr-0 group-hover:mr-4 transition-all duration-500"></span>Categories</button></li>
            <li><button onClick={() => scrollTo('#library')} className="hover:text-gold transition-all flex items-center group font-sans uppercase text-xs tracking-widest"><span className="w-0 group-hover:w-6 h-px bg-gold mr-0 group-hover:mr-4 transition-all duration-500"></span>Library</button></li>
            <li><button onClick={() => scrollTo('#about')} className="hover:text-gold transition-all flex items-center group font-sans uppercase text-xs tracking-widest"><span className="w-0 group-hover:w-6 h-px bg-gold mr-0 group-hover:mr-4 transition-all duration-500"></span>Reflection</button></li>
          </ul>
        </div>

        <div className="space-y-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-gold tracking-wide">Peshkash</h3>
            <p className="opacity-70 text-lg leading-relaxed max-w-sm">
              Send your raw thoughts to our desk. We'll ink them into the archive.
            </p>
          </div>
          
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col group bg-cream/5 p-4 rounded-[2rem] border border-cream/10 focus-within:border-gold/30 transition-all space-y-4">
              <textarea 
                value={userPoetry}
                onChange={(e) => setUserPoetry(e.target.value)}
                placeholder="Likhiye apne jazbaat..." 
                rows={3}
                className="bg-transparent px-4 py-2 w-full focus:outline-none text-cream text-base placeholder:opacity-30 resize-none font-accent italic"
              />
              <button 
                onClick={handleSend}
                className="bg-gold text-burgundy w-full py-4 rounded-[1.5rem] font-black hover:bg-white transition-all text-xs uppercase tracking-[0.3em] font-sans active:scale-95"
              >
                SUBMIT MANUSCRIPT
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-t border-cream/5 pt-12 space-y-8 md:space-y-0">
        <p className="opacity-30 text-[11px] font-sans tracking-[0.4em] uppercase font-bold">© 2026 Harf-e-Ali. Ink of Ali.</p>
        <button 
          onClick={onAdminClick} 
          className="text-[11px] font-black uppercase tracking-[0.5em] text-gold/60 hover:text-gold transition-all font-sans"
        >
          Admin Console
        </button>
      </div>
    </footer>
  );
};

export default Footer;
