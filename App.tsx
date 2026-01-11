
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { SHAYARI_DATA } from './data/shayari';
import { Category, Shayari, UserActions } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryCard from './components/CategoryCard';
import PoetryCard from './components/PoetryCard';
import FeaturedSlider from './components/FeaturedSlider';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';

interface Notification {
  id: number;
  message: string;
  type: 'like' | 'bookmark';
}

const App: React.FC = () => {
  const [shayariList, setShayariList] = useState<Shayari[]>(() => {
    try {
      const saved = localStorage.getItem('harfeali_shayari_library');
      return saved ? JSON.parse(saved) : SHAYARI_DATA;
    } catch (e) {
      return SHAYARI_DATA;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [viewingShayari, setViewingShayari] = useState<Shayari | null>(null);
  const [editingShayari, setEditingShayari] = useState<Shayari | null>(null);
  const [userActions, setUserActions] = useState<UserActions>(() => {
    try {
      const saved = localStorage.getItem('harfeali_user_actions');
      return saved ? JSON.parse(saved) : { likes: [], bookmarks: [] };
    } catch (e) {
      return { likes: [], bookmarks: [] };
    }
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    localStorage.setItem('harfeali_shayari_library', JSON.stringify(shayariList));
  }, [shayariList]);

  useEffect(() => {
    localStorage.setItem('harfeali_user_actions', JSON.stringify(userActions));
  }, [userActions]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const moveCursor = (e: MouseEvent) => {
      if (window.innerWidth >= 768) {
        setCursorPos({ x: e.clientX, y: e.clientY });
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  const categories: Category[] = ['All', 'Ishq', 'Dard', 'Unsiyat', 'Tanhai', 'Roohani', 'Naseehat', 'Zamana'];

  const handleCategorySelect = useCallback((cat: Category) => {
    setSelectedCategory(cat);
    const libEl = document.getElementById('library');
    if (libEl) {
      const offset = 100;
      const top = libEl.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const filteredShayari = useMemo(() => {
    const search = searchQuery.toLowerCase().trim();
    return shayariList.filter((s) => {
      const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
      const matchesSearch = !search || 
        s.content.toLowerCase().includes(search) || 
        (s.title && s.title.toLowerCase().includes(search)) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(search)));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, shayariList]);

  const adminFilteredShayari = useMemo(() => {
    const search = adminSearchQuery.toLowerCase().trim();
    return shayariList.filter((s) => {
      if (!search) return true;
      return (
        s.content.toLowerCase().includes(search) || 
        (s.title && s.title.toLowerCase().includes(search)) ||
        s.category.toLowerCase().includes(search)
      );
    });
  }, [adminSearchQuery, shayariList]);

  const addNotification = useCallback((message: string, type: 'like' | 'bookmark') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  const handleLike = useCallback((id: string) => {
    const isLiked = userActions.likes.includes(id);
    setUserActions(prev => ({
      ...prev,
      likes: isLiked 
        ? prev.likes.filter(item => item !== id) 
        : [...prev.likes, id]
    }));
    addNotification(isLiked ? "Dil se hata diya gaya" : "Dil ko chhu gaya!", 'like');
  }, [userActions.likes, addNotification]);

  const handleBookmark = useCallback((id: string) => {
    const isBookmarked = userActions.bookmarks.includes(id);
    setUserActions(prev => ({
      ...prev,
      bookmarks: isBookmarked 
        ? prev.bookmarks.filter(item => item !== id) 
        : [...prev.bookmarks, id]
    }));
    addNotification(isBookmarked ? "Library se hata diya" : "Library mein mehfooz kar liya!", 'bookmark');
  }, [userActions.bookmarks, addNotification]);

  const handleShare = useCallback((text: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Harf-e-Ali Shayari',
        text: text,
      }).catch(() => {
        navigator.clipboard.writeText(text);
        alert('Poetry copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Poetry copied to clipboard!');
    }
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '192006') {
      setIsAdminVerified(true);
      setPinInput('');
    } else {
      alert('Galat Pehchan (Wrong PIN).');
      setPinInput('');
    }
  };

  const [newPoetry, setNewPoetry] = useState({
    title: '',
    content: '',
    category: 'Ishq' as Category,
    author: 'Ali',
    isFeatured: false
  });

  const handleAddPoetry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoetry.content.trim()) return;

    if (editingShayari) {
      setShayariList(prev => prev.map(s => s.id === editingShayari.id ? { ...s, ...newPoetry } : s));
      alert('Kalam behtar kar diya gaya hai!');
    } else {
      const newItem: Shayari = {
        id: `ali-${Date.now()}`,
        title: newPoetry.title,
        content: newPoetry.content,
        category: newPoetry.category,
        author: newPoetry.author,
        tags: [],
        isFeatured: newPoetry.isFeatured
      };
      setShayariList([newItem, ...shayariList]);
      alert('Naya Kalam library mein shamil ho gaya!');
    }
    
    setEditingShayari(null);
    setNewPoetry({ title: '', content: '', category: 'Ishq', author: 'Ali', isFeatured: false });
  };

  const handleEdit = (shayari: Shayari) => {
    setEditingShayari(shayari);
    setNewPoetry({
      title: shayari.title || '',
      content: shayari.content,
      category: shayari.category,
      author: shayari.author,
      isFeatured: !!shayari.isFeatured
    });
    const formBox = document.querySelector('#admin-form-top');
    if (formBox) {
      formBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleRemove = (id: string) => {
    if (window.confirm("Are you sure you want to remove this piece?")) {
      setShayariList(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleRestoreDefaults = () => {
    if (window.confirm("Reset library to original collection?")) {
      setShayariList(SHAYARI_DATA);
      localStorage.removeItem('harfeali_shayari_library');
    }
  };

  const closeAdmin = () => {
    setIsAdminOpen(false);
    setIsAdminVerified(false);
    setPinInput('');
    setEditingShayari(null);
    setNewPoetry({ title: '', content: '', category: 'Ishq', author: 'Ali', isFeatured: false });
  };

  const handleAdminBack = () => {
    if (isAdminVerified) {
      setIsAdminVerified(false);
      setPinInput('');
    } else {
      closeAdmin();
    }
  };

  return (
    <div className={`font-sans custom-scrollbar bg-cream min-h-screen text-burgundy overflow-x-hidden selection:bg-gold/30 selection:text-burgundy ${!isMobile ? 'cursor-none' : ''}`}>
      {/* Custom Ink Drop Cursor */}
      {!isMobile && (
        <div 
          className="fixed w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-150 ease-out border-2 border-gold flex items-center justify-center"
          style={{ 
            transform: `translate3d(${cursorPos.x - 4}px, ${cursorPos.y - 4}px, 0) scale(${viewingShayari ? 2.5 : 1})`,
            top: 0,
            left: 0
          }}
        >
          <div className="absolute inset-0 bg-gold/10 rounded-full animate-pulse"></div>
        </div>
      )}

      <Navbar onAdminClick={() => setIsAdminOpen(true)} />
      
      <Hero />

      <main className="max-w-[1920px] mx-auto px-4 md:px-12 py-12 md:py-24 space-y-24 md:space-y-40">
        <section className="animate-fade-in-delayed">
          <FeaturedSlider customData={shayariList} />
        </section>

        <section id="categories" className="space-y-12 md:space-y-16">
          <div className="text-center space-y-4 md:space-y-6">
            <h2 className="text-4xl md:text-8xl font-serif tracking-tight">Kalam-e-Ali</h2>
            <div className="w-16 md:w-40 h-1 bg-gold mx-auto rounded-full opacity-40"></div>
            <p className="opacity-40 font-sans uppercase tracking-[0.4em] md:tracking-[0.5em] text-[8px] md:text-xs font-black">Chun lijiye apne jazbaat</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap justify-center gap-3 md:gap-6 max-w-5xl mx-auto">
            {categories.map((cat) => (
              <CategoryCard 
                key={cat}
                category={cat}
                count={cat === 'All' ? shayariList.length : shayariList.filter(s => s.category === cat).length}
                isActive={selectedCategory === cat}
                onClick={() => handleCategorySelect(cat)}
              />
            ))}
          </div>
        </section>

        <section id="library" className="space-y-12 md:space-y-32 min-h-[600px]">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 md:gap-12 border-b-2 border-burgundy/5 pb-12 md:pb-16">
            <div className="space-y-3 text-center lg:text-left">
              <h2 className="text-5xl md:text-8xl font-serif">Library</h2>
              <p className="text-[10px] md:text-[13px] opacity-30 uppercase tracking-[0.5em] md:tracking-[0.6em] font-black">Muhafiz-e-Alfaaz: {filteredShayari.length} Kalams</p>
            </div>
            
            <div className="relative w-full lg:w-[500px] group">
              <input 
                type="text" 
                placeholder="Dard, Ishq, Yaadein..." 
                className="w-full bg-white/70 border-2 border-burgundy/5 rounded-full px-12 md:px-16 py-5 md:py-7 focus:outline-none focus:ring-4 md:focus:ring-8 focus:ring-gold/5 focus:border-gold/30 transition-all shadow-xl md:shadow-2xl text-base md:text-xl placeholder:opacity-30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search poetry"
              />
              <svg className="w-5 h-5 md:w-7 md:h-7 absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-burgundy/10 group-focus-within:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {filteredShayari.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-14">
              {filteredShayari.map((shayari) => (
                <PoetryCard 
                  key={shayari.id}
                  shayari={shayari}
                  isLiked={userActions.likes.includes(shayari.id)}
                  isBookmarked={userActions.bookmarks.includes(shayari.id)}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                  onView={setViewingShayari}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 md:py-40 text-center opacity-30">
              <div className="text-7xl md:text-9xl mb-6 md:mb-10 text-gold/20 font-serif italic font-bold">Inkless</div>
              <p className="text-2xl md:text-5xl font-serif italic max-w-2xl px-6 leading-tight">Maafi chahte hain, in jazbaato ke liye abhi koi alfaaz naseeb nahi hue.</p>
              <button 
                onClick={() => {setSelectedCategory('All'); setSearchQuery('')}}
                className="mt-8 md:mt-12 px-8 md:px-12 py-4 md:py-6 bg-burgundy/10 rounded-2xl md:rounded-3xl text-[10px] md:text-[12px] font-black uppercase tracking-widest hover:bg-burgundy hover:text-cream transition-all shadow-lg active:scale-95"
              >
                Reset Filter
              </button>
            </div>
          )}
        </section>

        <AboutSection />
      </main>

      <Footer onAdminClick={() => setIsAdminOpen(true)} />

      {/* Notifications Portal */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[3000] flex flex-col items-end space-y-3 pointer-events-none">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className="pointer-events-auto bg-burgundy text-cream px-6 py-4 md:px-8 md:py-5 rounded-2xl md:rounded-3xl shadow-xl md:shadow-[0_20px_60px_rgba(107,15,26,0.3)] border border-gold/10 animate-toast-in flex items-center space-x-3 backdrop-blur-3xl bg-burgundy/95"
          >
            {n.type === 'like' ? (
              <svg className="w-4 h-4 md:w-5 md:h-5 text-red-400 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            ) : (
              <svg className="w-4 h-4 md:w-5 md:h-5 text-gold fill-current" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
            )}
            <span className="font-sans font-bold text-xs md:text-sm tracking-wide">{n.message}</span>
          </div>
        ))}
      </div>

      {/* View Modal */}
      {viewingShayari && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-12 backdrop-blur-[20px] bg-burgundy/40 animate-fade-in" onClick={() => setViewingShayari(null)}>
          <div className="bg-cream w-full max-w-5xl rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-24 shadow-2xl border border-white/20 relative overflow-hidden text-center max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -top-32 -left-32 text-[15rem] md:text-[40rem] font-accent text-burgundy/[0.03] select-none -z-10 italic">
               {viewingShayari.category[0]}
            </div>
            
            <button 
              onClick={() => setViewingShayari(null)}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 md:p-5 bg-burgundy/5 rounded-full hover:bg-burgundy hover:text-white transition-all shadow-sm group"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8 transform group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <span className="text-[9px] md:text-xs uppercase tracking-[0.5em] md:tracking-[0.8em] font-black text-gold mb-4 md:mb-6 block font-sans">{viewingShayari.category}</span>
            {viewingShayari.title && (
              <h3 className="font-serif text-3xl md:text-7xl text-burgundy/90 font-bold mb-8 md:mb-16 tracking-tight decoration-gold/40 underline underline-offset-[12px] md:underline-offset-[16px]">
                {viewingShayari.title}
              </h3>
            )}
            <p className="font-accent text-2xl md:text-6xl text-burgundy leading-snug md:leading-[1.3] mb-12 md:mb-24 italic font-medium whitespace-pre-wrap px-2 md:px-4">
              {viewingShayari.content}
            </p>
            <div className="flex flex-col items-center space-y-8 md:space-y-12">
              <div className="space-y-2">
                <div className="flex items-center space-x-6 md:space-x-10 opacity-30 justify-center">
                  <div className="w-12 md:w-32 h-px bg-burgundy"></div>
                  <span className="font-serif text-2xl md:text-4xl font-bold italic">{viewingShayari.author}</span>
                  <div className="w-12 md:w-32 h-px bg-burgundy"></div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                <button 
                  onClick={() => handleLike(viewingShayari.id)}
                  className={`flex items-center space-x-3 md:space-x-4 px-6 md:px-10 py-4 md:py-6 rounded-2xl md:rounded-[2rem] border-2 transition-all font-black text-[10px] md:text-[12px] tracking-widest md:tracking-[0.3em] uppercase font-sans ${userActions.likes.includes(viewingShayari.id) ? 'bg-red-500 border-red-500 text-white shadow-xl' : 'border-burgundy/10 text-burgundy/60 hover:border-red-400 hover:text-red-500'}`}
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                  <span>{userActions.likes.includes(viewingShayari.id) ? 'Dil Se' : 'Pasand'}</span>
                </button>
                <button 
                  onClick={() => { setViewingShayari(null); setTimeout(() => { const el = document.getElementById('library'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 300); }}
                  className="flex items-center space-x-3 md:space-x-4 px-6 md:px-10 py-4 md:py-6 rounded-2xl md:rounded-[2rem] border-2 border-burgundy text-burgundy font-black text-[10px] md:text-[12px] tracking-widest md:tracking-[0.3em] uppercase hover:bg-burgundy hover:text-white transition-all shadow-md font-sans"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  <span>Wapas Library</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel Modal */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-[2000] flex justify-center items-start pt-4 pb-12 md:pt-10 md:pb-16 px-0 md:px-6 backdrop-blur-[35px] bg-burgundy/60 animate-fade-in overflow-y-auto" onClick={closeAdmin}>
          <div className="bg-cream w-full max-w-[1440px] md:rounded-[3rem] shadow-2xl border border-white/20 relative min-h-screen md:min-h-0 flex flex-col justify-start overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-6 md:px-16 py-6 md:py-8 border-b border-burgundy/10 bg-cream/95 backdrop-blur-md sticky top-0 z-[2010] w-full shadow-sm">
               <button 
                  onClick={handleAdminBack}
                  className="flex items-center space-x-3 md:space-x-4 text-burgundy font-black group transition-all shrink-0 font-sans"
               >
                  <div className="p-3 md:p-4 bg-burgundy text-cream rounded-2xl md:rounded-[1.5rem] group-hover:bg-gold group-hover:text-burgundy transition-all shadow-md active:scale-90">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                  </div>
                  <span className="text-[10px] md:text-[12px] uppercase tracking-widest md:tracking-[0.3em] font-black hidden sm:block">{isAdminVerified ? 'WAPAS' : 'BAND'}</span>
               </button>
               <div className="font-serif italic text-burgundy text-xl md:text-4xl absolute left-1/2 -translate-x-1/2 select-none pointer-events-none whitespace-nowrap font-bold">Admin Console</div>
               <button onClick={closeAdmin} className="text-burgundy/40 hover:text-burgundy transition-all p-3 md:p-4 bg-burgundy/10 rounded-full hover:shadow-inner active:scale-95 shrink-0" aria-label="Close admin">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex-1 p-6 md:p-16 lg:p-20 overflow-visible">
              {!isAdminVerified ? (
                <div className="max-w-md mx-auto w-full text-center space-y-12 md:space-y-16 animate-fade-in py-16 md:py-24 flex flex-col justify-center min-h-[50vh]">
                  <div className="space-y-4 md:space-y-6">
                    <div className="w-20 h-20 md:w-28 md:h-28 bg-burgundy/5 rounded-[2rem] md:rounded-[2.5rem] mx-auto flex items-center justify-center mb-6 md:mb-8">
                      <svg className="w-10 h-10 md:w-14 md:h-14 text-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-serif text-burgundy font-bold">Pehchan-e-Admin</h3>
                    <div className="w-16 md:w-24 h-1.5 md:h-2 bg-gold mx-auto rounded-full opacity-40"></div>
                    <p className="text-[9px] md:text-[11px] uppercase tracking-[0.4em] md:tracking-[0.6em] font-black opacity-40 font-sans">Verify identity to continue</p>
                  </div>
                  <form onSubmit={handlePinSubmit} className="space-y-8 md:space-y-10">
                    <input type="password" value={pinInput} onChange={(e) => setPinInput(e.target.value)} placeholder="••••••" className="w-full bg-white border-2 border-burgundy/10 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 text-center text-3xl md:text-5xl tracking-widest md:tracking-[0.5em] focus:outline-none focus:border-gold/50 transition-all shadow-sm font-sans" autoFocus />
                    <button type="submit" className="w-full bg-burgundy text-cream py-6 md:py-8 rounded-[2rem] md:rounded-[3rem] font-black uppercase tracking-widest md:tracking-[0.5em] text-[12px] md:text-[14px] hover:bg-gold hover:text-burgundy transition-all shadow-2xl active:scale-[0.98] font-sans">ACCESS ARCHIVE</button>
                  </form>
                </div>
              ) : (
                <div className="animate-fade-in w-full space-y-12 md:space-y-20">
                  <div id="admin-form-top" className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-12 border-b border-burgundy/5 pb-12">
                    <div className="space-y-3 md:space-y-4">
                      <h3 className="text-5xl md:text-8xl font-serif text-burgundy font-bold italic">Archive Console</h3>
                      <div className="flex items-center space-x-4 md:space-x-6">
                        <span className="w-12 md:w-16 h-px bg-gold"></span>
                        <p className="text-[10px] md:text-[12px] uppercase tracking-[0.4em] md:tracking-[0.8em] font-black opacity-30 font-sans">Managing {shayariList.length} Manuscripts</p>
                      </div>
                    </div>
                    <button onClick={handleRestoreDefaults} className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-red-500 hover:text-cream hover:bg-red-500 transition-all border-2 border-red-500/20 rounded-2xl md:rounded-3xl px-8 md:px-12 py-3 md:py-5 bg-red-50/50 shadow-sm font-sans">RESTORE CORE DATABASE</button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-24 items-start">
                    <div className="lg:col-span-2 space-y-8 md:space-y-10 bg-white/60 backdrop-blur-3xl p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-burgundy/5 shadow-2xl lg:sticky lg:top-32">
                      <h4 className="text-3xl md:text-4xl font-serif text-gold font-bold italic">{editingShayari ? 'Kalam Ki Islaah' : 'Naya Kalam Peshesh'}</h4>
                      <form onSubmit={handleAddPoetry} className="space-y-8 md:space-y-10">
                        <div className="space-y-3">
                          <label className="text-[10px] md:text-[12px] uppercase font-black tracking-[0.4em] md:tracking-[0.6em] opacity-40 ml-1 font-sans">POEM TITLE</label>
                          <input type="text" value={newPoetry.title} onChange={(e) => setNewPoetry({...newPoetry, title: e.target.value})} className="w-full bg-white border-2 border-burgundy/5 rounded-2xl md:rounded-3xl p-5 md:p-7 focus:outline-none focus:border-gold/50 text-base md:text-[16px] font-serif font-bold shadow-sm" placeholder="Heading/Title..." />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] md:text-[12px] uppercase font-black tracking-[0.4em] md:tracking-[0.6em] opacity-40 ml-1 font-sans">POEM CONTENT</label>
                          <textarea required rows={5} value={newPoetry.content} onChange={(e) => setNewPoetry({...newPoetry, content: e.target.value})} className="w-full bg-white border-2 border-burgundy/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 focus:outline-none focus:border-gold/50 transition-all font-accent text-xl md:text-3xl italic shadow-sm resize-none custom-scrollbar leading-relaxed" placeholder="Yahan likhein..." />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
                          <div className="space-y-3">
                            <label className="text-[10px] md:text-[12px] uppercase font-black tracking-[0.4em] md:tracking-[0.6em] opacity-40 ml-1 font-sans">CATEGORY</label>
                            <div className="relative">
                              <select value={newPoetry.category} onChange={(e) => setNewPoetry({...newPoetry, category: e.target.value as Category})} className="w-full bg-white border-2 border-burgundy/5 rounded-2xl md:rounded-[2rem] p-5 md:p-7 focus:outline-none focus:border-gold/50 text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] cursor-pointer shadow-sm appearance-none pr-10 md:pr-12 font-sans">
                                {categories.filter(c => c !== 'All').map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                              </select>
                              <div className="absolute right-5 md:right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gold"><svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg></div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] md:text-[12px] uppercase font-black tracking-[0.4em] md:tracking-[0.6em] opacity-40 ml-1 font-sans">WRITER</label>
                            <input type="text" value={newPoetry.author} onChange={(e) => setNewPoetry({...newPoetry, author: e.target.value})} className="w-full bg-white border-2 border-burgundy/5 rounded-2xl md:rounded-[2rem] p-5 md:p-7 focus:outline-none focus:border-gold/50 text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-sm font-sans" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-6 md:space-x-8 bg-burgundy/5 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-burgundy/5 group cursor-pointer transition-all hover:bg-burgundy/10" onClick={() => setNewPoetry({...newPoetry, isFeatured: !newPoetry.isFeatured})}>
                          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl border-2 flex items-center justify-center transition-all ${newPoetry.isFeatured ? 'bg-burgundy border-burgundy' : 'bg-white border-burgundy/10'}`}>
                            {newPoetry.isFeatured && <svg className="w-5 h-5 md:w-6 md:h-6 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <label className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] opacity-70 cursor-pointer select-none font-sans">MARK AS FEATURED ★</label>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-6 pt-6">
                          <button type="submit" className="flex-1 bg-burgundy text-cream py-6 md:py-8 rounded-full font-black uppercase tracking-widest text-[11px] md:text-[13px] hover:bg-gold hover:text-burgundy transition-all shadow-xl md:shadow-2xl active:scale-[0.98] border-2 border-burgundy font-sans">{editingShayari ? 'UPDATE RECORD' : 'COMMIT TO ARCHIVE'}</button>
                          {editingShayari && (<button type="button" onClick={() => { setEditingShayari(null); setNewPoetry({ title: '', content: '', category: 'Ishq', author: 'Ali', isFeatured: false }); }} className="flex-1 px-8 md:px-12 py-6 md:py-8 rounded-full border-2 border-burgundy/10 font-black uppercase text-[11px] md:text-[13px] hover:bg-burgundy/5 transition-all text-burgundy/40 font-sans">CANCEL</button>)}
                        </div>
                      </form>
                    </div>
                    
                    <div className="lg:col-span-3 space-y-12 md:space-y-16">
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-gold/10 pb-8 gap-8">
                        <div className="space-y-3">
                          <h4 className="text-3xl md:text-5xl font-serif text-gold font-bold">Kalam Registry</h4>
                          <div className="flex items-center space-x-4 md:space-x-6 text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] opacity-30 font-sans">
                            <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-gold animate-pulse"></span>
                            <span>{adminFilteredShayari.length} Items Live</span>
                          </div>
                        </div>
                        <div className="relative w-full sm:w-[300px]">
                           <input type="text" placeholder="Find in registry..." className="w-full bg-burgundy/5 border-2 border-burgundy/5 rounded-full pl-12 pr-6 py-4 focus:outline-none focus:border-gold/50 transition-all text-base md:text-lg placeholder:opacity-30 font-sans shadow-inner" value={adminSearchQuery} onChange={(e) => setAdminSearchQuery(e.target.value)} />
                           <svg className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-burgundy/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                      </div>
                      
                      <div className="space-y-8 md:space-y-10 max-h-[1000px] md:max-h-[1200px] overflow-y-auto pr-2 md:pr-6 custom-scrollbar pb-20">
                        {adminFilteredShayari.map((s) => (
                          <div key={s.id} className="bg-white p-8 md:p-14 rounded-[2.5rem] md:rounded-[4.5rem] border border-burgundy/5 flex flex-col sm:flex-row justify-between items-center gap-8 md:gap-14 hover:shadow-2xl transition-all duration-700 border-l-[8px] md:border-l-[10px] border-l-gold group relative">
                            <div className="flex-1 min-w-0 pr-0 md:pr-10 text-center sm:text-left space-y-3 md:space-y-4">
                              {s.title && <h5 className="font-serif font-bold text-xl md:text-2xl mb-2 md:mb-4 text-burgundy/80 tracking-wide underline underline-offset-4 md:underline-offset-8 decoration-gold/20">{s.title}</h5>}
                              <p className="font-accent text-2xl md:text-4xl italic line-clamp-4 mb-4 md:mb-8 text-burgundy/90 leading-relaxed font-medium">"{s.content}"</p>
                              <div className="flex items-center justify-center sm:justify-start flex-wrap gap-4 md:gap-8 opacity-40 text-[9px] md:text-[11px] font-black uppercase tracking-widest md:tracking-[0.6em] font-sans">
                                <span className="bg-burgundy/5 px-4 py-1 md:px-6 md:py-2 rounded-full border border-burgundy/10">{s.category}</span>
                                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gold rounded-full hidden xs:block"></span>
                                <span className="underline decoration-gold/40 underline-offset-[6px] md:underline-offset-[10px] decoration-2">{s.author}</span>
                                {s.isFeatured && <span className="text-gold tracking-normal bg-gold/10 px-4 py-1 md:px-6 md:py-2 rounded-full font-bold border border-gold/20">★ FEATURED</span>}
                              </div>
                            </div>
                            <div className="flex sm:flex-col space-x-4 sm:space-x-0 sm:space-y-4 md:space-y-6 shrink-0">
                              <button onClick={() => handleEdit(s)} className="p-5 md:p-8 bg-burgundy/5 text-burgundy hover:bg-burgundy hover:text-cream rounded-2xl md:rounded-[2.5rem] transition-all shadow-md active:scale-90 border border-burgundy/5" title="Edit Manuscript"><svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                              <button onClick={() => handleRemove(s.id)} className="p-5 md:p-8 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl md:rounded-[2.5rem] transition-all shadow-md active:scale-90 border border-red-500/10" title="Remove Record"><svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                            </div>
                          </div>
                        ))}
                        {adminFilteredShayari.length === 0 && (<div className="py-24 text-center opacity-20 italic font-serif text-2xl md:text-3xl">No manuscripts found matching your search.</div>)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(80px); } to { opacity: 1; transform: translateX(0); } }
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-delayed { animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
        .animate-toast-in { animation: toastIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .line-clamp-4 { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

export default App;
