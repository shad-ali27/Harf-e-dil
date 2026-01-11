
import React from 'react';

const Hero: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center text-center pt-24 pb-12 px-6 relative overflow-hidden">
      {/* Decorative Blur Background */}
      <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-gold/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-burgundy/5 rounded-full blur-[120px] -z-10 animate-pulse delay-1000"></div>

      <div className="animate-fade-in space-y-10 max-w-4xl relative z-10">
        <div className="inline-flex items-center space-x-3 px-6 py-2.5 rounded-full border border-burgundy/10 text-[10px] font-black uppercase tracking-[0.5em] text-burgundy/50 bg-white/30 backdrop-blur-sm shadow-sm">
          <span className="w-2 h-2 rounded-full bg-gold animate-ping"></span>
          <span>A Poetic Journey</span>
        </div>
        
        <h1 className="text-6xl md:text-9xl font-serif text-burgundy leading-[1] tracking-tight">
          Harf-e-Ali – <br />
          <span className="font-accent italic font-normal text-gold block mt-4">Alfaaz-e-Dil</span>
        </h1>
        
        <p className="font-sans text-xl md:text-2xl text-burgundy/60 max-w-2xl mx-auto leading-relaxed font-medium px-4">
          A poetic Hinglish world – emotions, shayari, aur Gen-Z vibes. <br className="hidden md:block" /> Dil ki baatein, humari alfaazon ki zubaan mein.
        </p>
        
        <div className="pt-12 flex flex-col sm:flex-row gap-6 justify-center items-center w-full max-w-md mx-auto">
          <button 
            onClick={() => scrollTo('#categories')}
            className="w-full sm:w-auto px-12 py-5 bg-burgundy text-cream rounded-[1.5rem] font-sans font-black uppercase tracking-[0.3em] text-[11px] hover:bg-gold hover:text-burgundy transition-all hover:scale-105 shadow-[0_20px_40px_rgba(107,15,26,0.2)] active:scale-95"
          >
            Explore Shayari
          </button>
          <button 
            onClick={() => scrollTo('#about')}
            className="w-full sm:w-auto px-12 py-5 border-2 border-burgundy/10 text-burgundy rounded-[1.5rem] font-sans font-black uppercase tracking-[0.3em] text-[11px] hover:bg-burgundy hover:text-cream transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
          >
            Essence
          </button>
        </div>
      </div>
      
      {/* Scroll Down Indicator */}
      <button 
        onClick={() => scrollTo('#categories')}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce opacity-30 hover:opacity-100 transition-opacity p-4"
        aria-label="Scroll down"
      >
        <svg className="w-10 h-10 text-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
    </section>
  );
};

export default Hero;
