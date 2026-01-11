
import React from 'react';
import { Shayari } from '../types';

interface PoetryCardProps {
  shayari: Shayari;
  isLiked: boolean;
  isBookmarked: boolean;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onShare: (text: string) => void;
  onView: (shayari: Shayari) => void;
}

const PoetryCard: React.FC<PoetryCardProps> = ({ 
  shayari, 
  isLiked, 
  isBookmarked, 
  onLike, 
  onBookmark, 
  onShare,
  onView
}) => {
  // Safe truncation that doesn't split characters
  const getTruncatedContent = (content: string, limit: number) => {
    if (content.length <= limit) return content;
    return content.slice(0, limit).trim() + '...';
  };

  return (
    <div 
      className="bg-white/80 backdrop-blur-md border border-burgundy/5 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group cursor-pointer active:scale-95"
      onClick={() => onView(shayari)}
    >
      <div className="absolute -top-10 -right-10 text-burgundy/[0.03] text-[12rem] md:text-[16rem] font-accent italic select-none pointer-events-none group-hover:text-burgundy/[0.06] transition-all duration-1000 transform group-hover:-rotate-6 group-hover:scale-110">
        {shayari.category[0]}
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[8px] md:text-[10px] uppercase font-black tracking-[0.4em] md:tracking-[0.5em] text-gold bg-burgundy/5 px-4 md:px-5 py-2 rounded-full border border-gold/10 font-sans">
            {shayari.category}
          </span>
          <div className="flex space-x-1 opacity-20 group-hover:opacity-40 transition-opacity">
            <div className="w-1.5 h-1.5 rounded-full bg-burgundy"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-burgundy"></div>
          </div>
        </div>

        {shayari.title && (
          <h3 className="font-serif text-xl md:text-2xl text-burgundy/80 font-bold mb-4 md:mb-6 tracking-wide decoration-gold/20 underline underline-offset-4 md:underline-offset-8">
            {shayari.title}
          </h3>
        )}
        
        <p className="font-accent text-xl md:text-3xl text-burgundy leading-relaxed md:leading-[1.6] whitespace-pre-line mb-8 md:mb-12 min-h-[120px] md:min-h-[140px] font-medium opacity-90 group-hover:opacity-100 transition-opacity italic">
          {getTruncatedContent(shayari.content, 160)}
        </p>

        <div className="space-y-2 mb-8 md:mb-10">
          <p className="font-sans font-black text-[9px] md:text-[11px] tracking-[0.4em] md:tracking-[0.5em] text-burgundy/30 uppercase flex items-center">
            <span className="w-8 md:w-10 h-px bg-burgundy/20 mr-3 md:mr-4 group-hover:w-12 transition-all duration-500"></span>
            Writer — {shayari.author}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-burgundy/5 pt-6 md:pt-8 relative z-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex space-x-2 md:space-x-3">
          <button 
            onClick={() => onLike(shayari.id)}
            className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all hover:bg-red-50 group/btn ${isLiked ? 'text-red-500 bg-red-50 shadow-sm' : 'text-burgundy/30 hover:text-red-500'}`}
            title="Like"
            aria-label="Like poetry"
          >
            <svg className={`w-5 h-5 md:w-6 md:h-6 fill-current ${isLiked ? 'scale-110' : 'scale-100 group-hover/btn:scale-125 transition-transform duration-300'}`} viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
          <button 
            onClick={() => onBookmark(shayari.id)}
            className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all hover:bg-gold/10 group/btn ${isBookmarked ? 'text-gold bg-gold/5 shadow-sm' : 'text-burgundy/30 hover:text-gold'}`}
            title="Bookmark"
            aria-label="Bookmark poetry"
          >
            <svg className={`w-5 h-5 md:w-6 md:h-6 fill-current ${isBookmarked ? 'scale-110' : 'scale-100 group-hover/btn:scale-125 transition-transform duration-300'}`} viewBox="0 0 24 24">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
            </svg>
          </button>
        </div>
        
        <button 
          onClick={() => onShare(`${shayari.title ? shayari.title + '\n' : ''}${shayari.content}\n\nWriter — ${shayari.author}`)}
          className="flex items-center space-x-2 md:space-x-3 text-[8px] md:text-[10px] font-black uppercase tracking-widest md:tracking-[0.4em] text-burgundy/40 hover:text-burgundy transition-all px-4 md:px-8 py-3 md:py-4 bg-burgundy/5 rounded-xl md:rounded-2xl hover:bg-burgundy/10 group/share font-sans"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 group-hover/share:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default PoetryCard;
