
import React, { useState, useEffect } from 'react';
import { SHAYARI_DATA } from '../data/shayari';

interface FeaturedSliderProps {
  customData?: any[];
}

const FeaturedSlider: React.FC<FeaturedSliderProps> = ({ customData }) => {
  const data = customData || SHAYARI_DATA;
  const featured = data.filter(s => s.isFeatured).length > 0 
    ? data.filter(s => s.isFeatured) 
    : data.slice(0, 3);
    
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featured.length]);

  return (
    <div className="relative bg-white/40 backdrop-blur-md rounded-3xl p-10 md:p-20 overflow-hidden border border-burgundy/5 shadow-inner">
      <div className="absolute top-8 left-10 flex items-center space-x-3 text-burgundy/30 font-sans">
        <span className="w-12 h-px bg-burgundy/20"></span>
        <span className="text-[10px] uppercase font-bold tracking-[0.4em]">Trending Now</span>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div 
          key={featured[currentIndex].id}
          className="animate-fade-in text-center max-w-3xl transition-all duration-1000 transform"
        >
          <p className="font-accent text-3xl md:text-5xl text-burgundy font-semibold leading-snug mb-10 opacity-90 italic">
            "{featured[currentIndex].content}"
          </p>
          <div className="flex items-center justify-center space-x-6">
            <div className="w-10 h-px bg-gold/50"></div>
            <span className="font-serif text-xl font-bold text-burgundy/60 italic tracking-wide">— {featured[currentIndex].author}</span>
            <div className="w-10 h-px bg-gold/50"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-3">
        {featured.map((item, i) => (
          <button 
            key={item.id}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${currentIndex === i ? 'w-10 bg-burgundy' : 'w-2 bg-burgundy/10 hover:bg-burgundy/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedSlider;
