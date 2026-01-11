
import React, { useState, useEffect, useRef } from 'react';

const AboutSection: React.FC = () => {
  const [activeTruth, setActiveTruth] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const reflections = [
    { 
      label: "Azaadi", 
      mask: "The Freedom",
      line1: "Meri azaadi bhi aisi jaise", 
      line2: "Sone ki pinjare si ho",
      context: "Choice vs Cage",
      icon: "M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" 
    },
    { 
      label: "Kamyaabi", 
      mask: "The Success",
      line1: "Mere khwaabon ki ehmiyat utni nahi", 
      line2: "Jitni meri kamyaabi ki ho",
      context: "Dreams vs Status",
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
    },
    { 
      label: "Keemat", 
      mask: "The Value",
      line1: "Yun kehne ko to parvarish hoti hai hamari", 
      line2: "Hamare kaamo se tay hojati hai keemat hamari",
      context: "Growth vs Utility",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
    },
    { 
      label: "Zimmedariyaan", 
      mask: "The Burden",
      line1: "Wo zakhmi kandhon ki zimmedariyaan", 
      line2: "Wo tanhayi ke khayaal",
      context: "Duty vs Loneliness",
      icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
    }
  ];

  const mainPoemLines = [
    "Ek shaqs ki khawahish",
    "Ye baaten kon poochta hai hamse",
    "Hum to putle hai,",
    "koi door le rakha hai hamari"
  ];

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className={`py-24 md:py-48 px-4 md:px-6 transition-all duration-1000 relative overflow-hidden ${
        activeTruth !== null ? 'bg-burgundy' : 'bg-cream'
      }`}
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')]"></div>

      {/* Atmospheric Background Labels */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className={`absolute top-10 left-5 md:top-20 md:left-10 text-7xl md:text-[15rem] font-serif transition-all duration-1000 ${activeTruth !== null ? 'text-cream opacity-5' : 'text-burgundy opacity-5'} -rotate-12`}>PUTLE</div>
        <div className={`absolute bottom-10 right-5 md:bottom-20 md:right-10 text-7xl md:text-[15rem] font-serif transition-all duration-1000 ${activeTruth !== null ? 'text-cream opacity-5' : 'text-burgundy opacity-5'} rotate-12`}>KEEMAT</div>
      </div>

      <div className="max-w-[1920px] mx-auto space-y-16 md:space-y-40 relative z-10">
        {/* Section Header */}
        <div className={`text-center space-y-4 md:space-y-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className={`inline-flex items-center space-x-3 md:space-x-4 px-6 md:px-8 py-2 md:py-3.5 rounded-full border transition-all duration-700 text-[8px] md:text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] font-sans ${activeTruth !== null ? 'border-cream/20 text-cream/40' : 'border-burgundy/20 text-burgundy/40'}`}>
            <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse ${activeTruth !== null ? 'bg-gold' : 'bg-burgundy'}`}></span>
            <span>Unmasking the Soul</span>
          </div>
          <h2 className={`text-5xl md:text-9xl font-serif italic transition-all duration-1000 ${activeTruth !== null ? 'text-cream' : 'text-burgundy'}`}>
            Men aren't mean.
          </h2>
          <div className={`w-16 md:w-40 h-1 md:h-1.5 mx-auto rounded-full transition-all duration-1000 ${activeTruth !== null ? 'bg-gold' : 'bg-gold/40'}`}></div>
        </div>

        {/* The Card Grid: Pairs of Poetry */}
        <div className="flex flex-col lg:flex-row gap-12 md:gap-24 items-center">
          <div className="lg:w-1/2 w-full space-y-8 md:space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-10">
              {reflections.map((item, idx) => (
                <div 
                  key={idx}
                  onMouseEnter={() => setActiveTruth(idx)}
                  onMouseLeave={() => setActiveTruth(null)}
                  onClick={() => setActiveTruth(activeTruth === idx ? null : idx)}
                  className={`p-8 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] border-2 transition-all duration-700 cursor-crosshair group relative overflow-hidden h-[320px] md:h-[400px] flex flex-col justify-center ${
                    activeTruth === idx 
                      ? 'bg-cream border-gold shadow-2xl scale-[1.03] z-20' 
                      : 'bg-white/50 border-burgundy/5 shadow-sm'
                  }`}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  {/* Outer Social Mask */}
                  <div className={`transition-all duration-700 flex flex-col items-center text-center ${activeTruth === idx ? 'opacity-0 scale-90 -translate-y-full' : 'opacity-100 translate-y-0'}`}>
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-burgundy/5 flex items-center justify-center mb-4 md:mb-6 text-gold">
                      <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                      </svg>
                    </div>
                    <span className="font-sans text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-30 block mb-2 md:mb-3">{item.mask}</span>
                    <h4 className="font-serif text-2xl md:text-4xl text-burgundy font-bold">{item.label}</h4>
                  </div>
                  
                  {/* Inner Poetic Pair Reveal */}
                  <div className={`absolute inset-0 p-8 md:p-14 flex flex-col justify-center text-center transition-all duration-700 ${
                    activeTruth === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}>
                    <div className="space-y-4 md:space-y-6">
                      <span className="font-sans text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-gold/60 mb-4 md:mb-8 block">{item.context}</span>
                      
                      {/* The Poetic Pair Lines */}
                      <div className="space-y-3 md:space-y-4">
                        <p className="font-accent text-xl md:text-3xl italic text-burgundy/60 leading-tight">
                          "{item.line1}"
                        </p>
                        <div className="w-6 md:w-8 h-px bg-gold/30 mx-auto"></div>
                        <p className="font-accent text-2xl md:text-4xl italic text-burgundy leading-tight font-bold">
                          "{item.line2}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Aesthetic Details */}
                  <div className={`absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 border-t-4 border-r-4 border-gold/10 rounded-tr-[2rem] md:rounded-tr-[3rem] transition-all duration-700 ${activeTruth === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}></div>
                  <div className={`absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 border-b-4 border-l-4 border-gold/10 rounded-bl-[2rem] md:rounded-bl-[3rem] transition-all duration-700 ${activeTruth === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}></div>
                </div>
              ))}
            </div>
            
            {/* Contextual Narrative Box */}
            <div className={`p-8 md:p-14 rounded-[3rem] md:rounded-[4rem] border backdrop-blur-3xl transition-all duration-1000 ${
              activeTruth !== null ? 'bg-white/10 border-white/20' : 'bg-gold/10 border-gold/20'
            }`}>
              <div className="flex items-start space-x-6 md:space-x-8">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[2rem] flex items-center justify-center shrink-0 transition-all duration-700 ${activeTruth !== null ? 'bg-gold' : 'bg-burgundy'} shadow-xl`}>
                   <svg className="w-8 h-8 md:w-10 md:h-10 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.168.477-4.5 1.253" /></svg>
                </div>
                <div className="space-y-2 md:space-y-4">
                  <p className={`font-sans text-[9px] md:text-[11px] uppercase font-black tracking-[0.4em] md:tracking-[0.5em] transition-colors ${activeTruth !== null ? 'text-gold' : 'text-burgundy/60'}`}>The Human Condition</p>
                  <p className={`font-accent text-xl md:text-4xl italic leading-relaxed transition-colors ${activeTruth !== null ? 'text-cream/90' : 'text-burgundy/80'}`}>
                    "Aadmi bura nahi hota... <br />
                    Bss use uska hona naseeb nahi hota."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* The Static Poem - Finishing the story */}
          <div className="lg:w-1/2 w-full perspective-1000 group">
            <div className={`absolute -inset-6 md:-inset-10 border-2 rounded-[4rem] md:rounded-[6rem] -z-10 rotate-3 transition-all duration-1000 ${activeTruth !== null ? 'border-gold opacity-50 scale-[1.02]' : 'border-gold/10 opacity-100'}`}></div>
            <div className={`p-8 md:p-32 rounded-[4rem] md:rounded-[6rem] shadow-2xl border transition-all duration-1000 relative overflow-hidden text-center flex flex-col items-center justify-center min-h-[600px] md:min-h-[850px] ${
              activeTruth !== null ? 'bg-cream scale-[1.02] -rotate-1' : 'bg-white border-burgundy/5 rotate-0 shadow-lg'
            }`}>
              <div className="space-y-8 md:space-y-10 w-full">
                {mainPoemLines.map((line, lIdx) => (
                  <p 
                    key={lIdx} 
                    className={`font-accent text-2xl md:text-5xl lg:text-6xl text-burgundy leading-tight italic font-medium transition-all duration-1000 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${400 + lIdx * 150}ms` }}
                  >
                    {line}
                  </p>
                ))}
              </div>
              
              <div className="mt-16 md:mt-28 flex items-center justify-center space-x-8 md:space-x-12 opacity-20 group-hover:opacity-100 transition-all duration-1000">
                <div className="w-12 md:w-24 h-px bg-burgundy"></div>
                <span className="font-serif text-2xl md:text-4xl font-bold tracking-[0.3em] md:tracking-[0.4em] italic uppercase">Ali</span>
                <div className="w-12 md:w-24 h-px bg-burgundy"></div>
              </div>

              {/* Decorative Corner Ornaments */}
              <div className="absolute top-0 left-0 w-20 h-20 md:w-32 md:h-32 border-t-4 md:border-t-8 border-l-4 md:border-l-8 border-gold/10 rounded-tl-[3rem] md:rounded-tl-[5rem] m-6 md:m-10"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 md:w-32 md:h-32 border-b-4 md:border-b-8 border-r-4 md:border-r-8 border-gold/10 rounded-br-[3rem] md:rounded-br-[5rem] m-6 md:m-10"></div>
            </div>
          </div>
        </div>
        
        {/* Call to action footer */}
        <div className="pt-12 md:pt-28 text-center">
           <div className="relative inline-block group">
              <div className={`absolute -inset-4 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000 ${activeTruth !== null ? 'bg-gold' : 'bg-burgundy'}`}></div>
              <button 
                onClick={() => document.getElementById('library')?.scrollIntoView({behavior:'smooth'})}
                className={`relative px-12 md:px-20 py-6 md:py-10 rounded-full font-sans text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] md:tracking-[0.7em] transition-all duration-700 shadow-2xl flex items-center space-x-6 md:space-x-10 group/btn ${
                  activeTruth !== null ? 'bg-cream text-burgundy' : 'bg-burgundy text-cream'
                }`}
              >
                <span>Read the Archive</span>
                <div className="w-8 h-8 md:w-12 md:h-12 bg-burgundy/5 rounded-full flex items-center justify-center group-hover/btn:bg-burgundy group-hover/btn:text-cream transition-colors">
                  <svg className="w-5 h-5 md:w-8 md:h-8 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </button>
           </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
