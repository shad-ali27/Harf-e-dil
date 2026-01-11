
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 px-6 bg-burgundy/5 relative overflow-hidden">
      {/* Decorative background flair */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
      
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        {/* Image Section - First on mobile and desktop */}
        <div className="relative group w-full lg:w-1/2">
          <div className="relative z-10 overflow-hidden rounded-[3rem] shadow-[0_50px_100px_rgba(107,15,26,0.3)]">
            <img 
              src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200&auto=format&fit=crop" 
              alt="Artistic Writer's Desk" 
              className="w-full h-[450px] md:h-[650px] object-cover transition-transform duration-1000 group-hover:scale-105 filter sepia-[0.4] contrast-[1.1] brightness-[0.85] saturate-[0.8] blur-[2px] group-hover:blur-0"
            />
            {/* Artistic Texture Overlay (Grainy Oil Painting Effect) */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/canvas-orange.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-burgundy/10 mix-blend-color opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-burgundy/60 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-700"></div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gold/10 backdrop-blur-3xl rounded-full -z-10 animate-pulse"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 border-2 border-gold/20 rounded-full -z-10"></div>
          
          <div className="absolute bottom-12 left-12 right-12 p-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 hidden md:block">
            <p className="font-accent text-2xl text-cream italic leading-relaxed">
              "Alfaaz hi toh hai jo dilo ko jodte hai, jazbaat hi toh hai jo kahaniyaan bunte hai..."
            </p>
          </div>
        </div>

        {/* Text Content Section */}
        <div className="w-full lg:w-1/2 space-y-12">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-4">
              <span className="w-12 h-px bg-gold"></span>
              <span className="text-[11px] font-black uppercase tracking-[0.6em] text-gold">The Soul of Harf-e-Ali</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif text-burgundy leading-[1.1]">Our Essence</h2>
            <div className="w-24 h-2 bg-gold/40 rounded-full"></div>
          </div>
          
          <div className="space-y-8 font-sans text-xl text-burgundy/80 leading-relaxed font-medium">
            <p>
              Harf-e-Ali is not just a digital library; it's a sanctuary for the heart. In an era of fleeting reels and temporary stories, we preserve the timeless magic of Hinglish poetry that resonates with the modern soul.
            </p>
            <p className="italic text-burgundy/60 border-l-4 border-gold/30 pl-8 py-2">
              Every word here is an oil painting of emotions—curated with the warmth of a coffee-filled evening and the depth of a secret diary.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-8">
              <div className="space-y-4 group">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-burgundy/5 rounded-xl flex items-center justify-center group-hover:bg-burgundy group-hover:text-cream transition-colors duration-500">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </div>
                  <h4 className="font-bold text-xl md:text-2xl font-serif text-burgundy">Our Mission</h4>
                </div>
                <p className="text-base opacity-70 leading-relaxed pl-14">To bridge the gap between traditional Urdu depth and modern expression.</p>
              </div>
              <div className="space-y-4 group">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-burgundy/5 rounded-xl flex items-center justify-center group-hover:bg-burgundy group-hover:text-cream transition-colors duration-500">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </div>
                  <h4 className="font-bold text-xl md:text-2xl font-serif text-burgundy">Our Vision</h4>
                </div>
                <p className="text-base opacity-70 leading-relaxed pl-14">Building a community where every heartbeat finds its perfect verse.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
