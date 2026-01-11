
import React, { useState, useMemo, useEffect } from 'react';
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
    const saved = localStorage.getItem('harfeali_shayari_library');
    return saved ? JSON.parse(saved) : SHAYARI_DATA;
  });

  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [viewingShayari, setViewingShayari] = useState<Shayari | null>(null);
  const [editingShayari, setEditingShayari] = useState<Shayari | null>(null);
  const [userActions, setUserActions] = useState<UserActions>(() => {
    const saved = localStorage.getItem('harfeali_user_actions');
    return saved ? JSON.parse(saved) : { likes: [], bookmarks: [] };
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [newPoetry, setNewPoetry] = useState({
    title: '',
    content: '',
    category: 'Ishq' as Category,
    author: 'Ali',
    isFeatured: false
  });

  useEffect(() => {
    localStorage.setItem('harfeali_shayari_library', JSON.stringify(shayariList));
  }, [shayariList]);

  useEffect(() => {
    localStorage.setItem('harfeali_user_actions', JSON.stringify(userActions));
  }, [userActions]);

  const categories: Category[] = ['All', 'Ishq', 'Dard', 'Unsiyat', 'Tanhai', 'Roohani', 'Naseehat', 'Zamana'];

  const filteredShayari = useMemo(() => {
    return shayariList.filter((s) => {
      const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
      const matchesSearch = 
        s.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (s.title && s.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, shayariList]);

  const addNotification = (message: string, type: 'like' | 'bookmark') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const handleLike = (id: string) => {
    const isLiked = userActions.likes.includes(id);
    setUserActions(prev => ({
      ...prev,
      likes: isLiked 
        ? prev.likes.filter(item => item !== id) 
        : [...prev.likes, id]
    }));
    addNotification(isLiked ? "Dil se hata diya gaya" : "Dil ko chhu gaya!", 'like');
  };

  const handleBookmark = (id: string) => {
    const isBookmarked = userActions.bookmarks.includes(id);
    setUserActions(prev => ({
      ...prev,
      bookmarks: isBookmarked 
        ? prev.bookmarks.filter(item => item !== id) 
        : [...prev.bookmarks, id]
    }));
    addNotification(isBookmarked ? "Library se hata diya" : "Library mein mehfooz kar liya!", 'bookmark');
  };

  const handleShare = (text: string) => {
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
  };

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
    // Scroll to form
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
    <div className="font-sans custom-scrollbar bg-cream min-h-screen text-burgundy overflow-x-hidden selection:bg-gold/30 selection:text-burgundy">
      <Navbar onAdminClick={() => setIsAdminOpen(true)} />
      
      <Hero />

      <main className="max-w-7xl mx-auto px-6 py-24 space-y-40">
        <section className="animate-fade-in-delayed">
          <FeaturedSlider customData={shayariList} />
        </section>

        <section id="categories" className="space-y-16">
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-7xl font-serif tracking-tight">Kalam-e-Ali</h2>
            <div className="w-32 h-1.5 bg-gold mx-auto rounded-full opacity-40"></div>
            <p className="opacity-50 font-sans uppercase tracking-[0.5em] text-xs font-black">Chun lijiye apne jazbaat</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-5xl mx-auto">
            {categories.map((cat) => (
              <CategoryCard 
                key={cat}
                category={cat}
                count={cat === 'All' ? shayariList.length : shayariList.filter(s => s.category === cat).length}
                isActive={selectedCategory === cat}
                onClick={setSelectedCategory}
              />
            ))}
          </div>
        </section>

        <section id="library" className="space-y-24 min-h-[800px]">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-10 border-b-2 border-burgundy/5 pb-16">
            <div className="space-y-4 text-center lg:text-left">
              <h2 className="text-6xl font-serif">Library</h2>
              <p className="text-[12px] opacity-30 uppercase tracking-[0.6em] font-black">Muhafiz-e-Alfaaz: {filteredShayari.length} Kalams</p>
            </div>
            
            <div className="relative w-full lg:w-[450px] group">
              <input 
                type="text" 
                placeholder="Dard, Ishq, Yaadein... Kya talaash hai?" 
                className="w-full bg-white/70 border-2 border-burgundy/5 rounded-[2rem] px-16 py-6 focus:outline-none focus:ring-4 focus:ring-gold/10 focus:border-gold/50 transition-all shadow-xl text-lg placeholder:opacity-30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="w-7 h-7 absolute left-6 top-1/2 -translate-y-1/2 text-burgundy/20 group-focus-within:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {filteredShayari.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
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
            <div className="flex flex-col items-center justify-center py-40 text-center opacity-30">
              <div className="text-9xl mb-10">🖋️</div>
              <p className="text-4xl font-serif italic max-w-xl">Maafi chahte hain, in jazbaato ke liye abhi koi alfaaz naseeb nahi hue.</p>
              <button 
                onClick={() => {setSelectedCategory('All'); setSearchQuery('')}}
                className="mt-12 px-10 py-5 bg-burgundy/10 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-burgundy hover:text-cream transition-all shadow-lg active:scale-95"
              >
                Restore Search
              </button>
            </div>
          )}
        </section>

        <AboutSection />
      </main>

      <Footer onAdminClick={() => setIsAdminOpen(true)} />

      {/* Notifications Portal */}
      <div className="fixed bottom-10 right-10 z-[3000] flex flex-col items-end space-y-4 pointer-events-none">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className="pointer-events-auto bg-burgundy text-cream px-8 py-5 rounded-3xl shadow-[0_20px_40px_rgba(107,15,26,0.3)] border border-gold/20 animate-toast-in flex items-center space-x-4 backdrop-blur-xl bg-burgundy/90"
          >
            {n.type === 'like' ? (
              <svg className="w-5 h-5 text-red-400 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            ) : (
              <svg className="w-5 h-5 text-gold fill-current" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
            )}
            <span className="font-sans font-bold text-sm tracking-wide">{n.message}</span>
          </div>
        ))}
      </div>

      {/* View Modal */}
      {viewingShayari && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-12 backdrop-blur-[20px] bg-burgundy/40 animate-fade-in" onClick={() => setViewingShayari(null)}>
          <div className="bg-cream w-full max-w-4xl rounded-[3rem] md:rounded-[4rem] p-8 md:p-16 lg:p-24 shadow-2xl border border-white/20 relative overflow-hidden text-center max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -top-32 -left-32 text-[20rem] md:text-[30rem] font-accent text-burgundy/[0.04] select-none -z-10 italic">
               {viewingShayari.category[0]}
            </div>
            
            <button 
              onClick={() => setViewingShayari(null)}
              className="absolute top-6 right-6 md:top-10 md:right-10 p-4 md:p-5 bg-burgundy/5 rounded-full hover:bg-burgundy hover:text-white transition-all shadow-sm group"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8 transform group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <span className="text-[10px] md:text-xs uppercase tracking-[0.6em] font-black text-gold mb-4 md:mb-6 block">{viewingShayari.category}</span>
            {viewingShayari.title && (
              <h3 className="font-serif text-3xl md:text-5xl text-burgundy/80 font-bold mb-8 md:mb-12 tracking-tight decoration-gold/40 underline underline-offset-[12px]">
                {viewingShayari.title}
              </h3>
            )}
            <p className="font-accent text-2xl md:text-5xl text-burgundy leading-[1.3] mb-12 md:mb-20 italic font-medium whitespace-pre-wrap px-2 md:px-6">
              {viewingShayari.content}
            </p>
            <div className="flex flex-col items-center space-y-10 md:space-y-12">
              <div className="space-y-2">
                <div className="flex items-center space-x-6 opacity-30 justify-center">
                  <div className="w-12 md:w-16 h-px bg-burgundy"></div>
                  <span className="font-serif text-2xl md:text-3xl font-bold">{viewingShayari.author}</span>
                  <div className="w-12 md:w-16 h-px bg-burgundy"></div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                <button 
                  onClick={() => handleLike(viewingShayari.id)}
                  className={`flex items-center space-x-3 md:space-x-4 px-6 md:px-10 py-4 md:py-5 rounded-2xl border-2 transition-all font-black text-[10px] tracking-[0.2em] uppercase ${userActions.likes.includes(viewingShayari.id) ? 'bg-red-500 border-red-500 text-white shadow-2xl' : 'border-burgundy/10 text-burgundy/60 hover:border-red-400 hover:text-red-500'}`}
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                  <span>{userActions.likes.includes(viewingShayari.id) ? 'Dil Se' : 'Pasand'}</span>
                </button>
                <button 
                  onClick={() => { setViewingShayari(null); setTimeout(() => { const el = document.getElementById('library'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 300); }}
                  className="flex items-center space-x-3 md:space-x-4 px-6 md:px-10 py-4 md:py-5 rounded-2xl border-2 border-burgundy text-burgundy font-black text-[10px] tracking-[0.2em] uppercase hover:bg-burgundy hover:text-white transition-all shadow-lg"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  <span>Wapas Library</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel Modal */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-[2000] flex justify-center items-start pt-4 pb-12 md:pt-10 md:pb-16 px-0 md:px-4 backdrop-blur-[40px] bg-burgundy/60 animate-fade-in overflow-y-auto" onClick={closeAdmin}>
          <div className="bg-cream w-full max-w-6xl md:rounded-[3rem] shadow-2xl border border-white/20 relative min-h-screen md:min-h-0 flex flex-col justify-start overflow-hidden" onClick={(e) => e.stopPropagation()}>
            
            {/* STICKY HEADER */}
            <div className="flex justify-between items-center px-6 md:px-12 py-5 border-b border-burgundy/10 bg-cream/95 backdrop-blur-md sticky top-0 z-[2010] w-full shadow-sm">
               <button 
                  onClick={handleAdminBack}
                  className="flex items-center space-x-3 text-burgundy font-black group transition-all shrink-0"
               >
                  <div className="p-3 bg-burgundy text-cream rounded-full group-hover:bg-gold group-hover:text-burgundy transition-all shadow-md active:scale-90">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                  </div>
                  <span className="text-[11px] md:text-[12px] uppercase tracking-[0.2em] font-black hidden xs:block">{isAdminVerified ? 'WAPAS' : 'BAND'}</span>
               </button>

               {/* Center Title */}
               <div className="font-serif italic text-burgundy text-xl md:text-3xl absolute left-1/2 -translate-x-1/2 select-none pointer-events-none whitespace-nowrap font-bold">Admin Panel</div>

               <button 
                onClick={closeAdmin}
                className="text-burgundy/40 hover:text-burgundy transition-all p-3 bg-burgundy/5 rounded-full hover:shadow-inner active:scale-95 shrink-0"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 p-6 md:p-12 overflow-visible">
              {!isAdminVerified ? (
                <div className="max-w-md mx-auto w-full text-center space-y-12 animate-fade-in py-20 flex flex-col justify-center min-h-[50vh]">
                  <div className="space-y-4">
                    <div className="w-24 h-24 bg-burgundy/5 rounded-3xl mx-auto flex items-center justify-center mb-6">
                      <svg className="w-12 h-12 text-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-serif text-burgundy font-bold">Pehchan-e-Admin</h3>
                    <div className="w-20 h-1 bg-gold mx-auto rounded-full opacity-40"></div>
                    <p className="text-[10px] md:text-[12px] uppercase tracking-[0.5em] font-black opacity-40">Verify identity to continue</p>
                  </div>
                  
                  <form onSubmit={handlePinSubmit} className="space-y-8">
                    <input 
                      type="password"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder="••••••"
                      className="w-full bg-white border-2 border-burgundy/10 rounded-[2rem] p-6 text-center text-4xl tracking-[0.5em] focus:outline-none focus:border-gold/50 transition-all shadow-sm font-sans"
                      autoFocus
                    />
                    <button 
                      type="submit"
                      className="w-full bg-burgundy text-cream py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[13px] hover:bg-gold hover:text-burgundy transition-all shadow-xl active:scale-[0.98]"
                    >
                      ENTER SYSTEM
                    </button>
                  </form>
                </div>
              ) : (
                <div className="animate-fade-in w-full space-y-12">
                  <div id="admin-form-top" className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-burgundy/5 pb-10">
                    <div className="space-y-3">
                      <h3 className="text-5xl md:text-7xl font-serif text-burgundy font-bold">Library Console</h3>
                      <div className="flex items-center space-x-5">
                        <span className="w-12 h-px bg-gold"></span>
                        <p className="text-[11px] uppercase tracking-[0.6em] font-black opacity-30">Managing {shayariList.length} Verses</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleRestoreDefaults}
                      className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 hover:text-cream hover:bg-red-500 transition-all border-2 border-red-500/20 rounded-2xl px-10 py-4 bg-red-50/50 shadow-sm"
                    >
                      RESET DATABASE
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
                    {/* FORM SECTION */}
                    <div className="lg:col-span-2 space-y-8 bg-white/60 backdrop-blur-md p-8 md:p-12 rounded-[3.5rem] border border-burgundy/5 shadow-xl sticky top-28">
                      <div className="space-y-3">
                        <h4 className="text-3xl md:text-4xl font-serif text-gold font-bold">{editingShayari ? 'Kalam Ki Islaah' : 'Naya Kalam Peshesh'}</h4>
                        <div className="w-16 h-2 bg-gold/20 rounded-full"></div>
                      </div>
                      
                      <form onSubmit={handleAddPoetry} className="space-y-8">
                        <div className="space-y-4">
                          <label className="text-[11px] uppercase font-black tracking-[0.5em] opacity-40 ml-1">POEM TITLE</label>
                          <input 
                            type="text"
                            value={newPoetry.title}
                            onChange={(e) => setNewPoetry({...newPoetry, title: e.target.value})}
                            className="w-full bg-white border-2 border-burgundy/5 rounded-2xl p-6 focus:outline-none focus:border-gold/50 text-[14px] font-serif font-bold shadow-sm"
                            placeholder="Heading/Title..."
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[11px] uppercase font-black tracking-[0.5em] opacity-40 ml-1">POEM CONTENT</label>
                          <textarea 
                            required
                            rows={6}
                            value={newPoetry.content}
                            onChange={(e) => setNewPoetry({...newPoetry, content: e.target.value})}
                            className="w-full bg-white border-2 border-burgundy/5 rounded-[2.5rem] p-8 focus:outline-none focus:border-gold/50 transition-all font-accent text-2xl italic shadow-sm resize-none custom-scrollbar leading-relaxed"
                            placeholder="Yahan likhein..."
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <label className="text-[11px] uppercase font-black tracking-[0.5em] opacity-40 ml-1">CATEGORY</label>
                            <div className="relative">
                              <select 
                                value={newPoetry.category}
                                onChange={(e) => setNewPoetry({...newPoetry, category: e.target.value as Category})}
                                className="w-full bg-white border-2 border-burgundy/5 rounded-3xl p-6 focus:outline-none focus:border-gold/50 text-[11px] font-black uppercase tracking-[0.2em] cursor-pointer shadow-sm appearance-none pr-12"
                              >
                                {categories.filter(c => c !== 'All').map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gold">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <label className="text-[11px] uppercase font-black tracking-[0.5em] opacity-40 ml-1">WRITER</label>
                            <input 
                              type="text"
                              value={newPoetry.author}
                              onChange={(e) => setNewPoetry({...newPoetry, author: e.target.value})}
                              className="w-full bg-white border-2 border-burgundy/5 rounded-3xl p-6 focus:outline-none focus:border-gold/50 text-[11px] font-black uppercase tracking-[0.2em] shadow-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 bg-burgundy/5 p-8 rounded-[2.5rem] border border-burgundy/5 group cursor-pointer transition-all hover:bg-burgundy/10" onClick={() => setNewPoetry({...newPoetry, isFeatured: !newPoetry.isFeatured})}>
                          <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${newPoetry.isFeatured ? 'bg-burgundy border-burgundy' : 'bg-white border-burgundy/10'}`}>
                            {newPoetry.isFeatured && <svg className="w-5 h-5 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <label className="text-[11px] font-black uppercase tracking-[0.4em] opacity-70 cursor-pointer select-none">MARK AS TRENDING ★</label>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-6 pt-6">
                          <button 
                            type="submit"
                            className="flex-1 bg-burgundy text-cream py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[12px] hover:bg-gold hover:text-burgundy transition-all shadow-xl active:scale-[0.98] border-2 border-burgundy"
                          >
                            {editingShayari ? 'SAVE CHANGES' : 'ADD TO LIBRARY'}
                          </button>
                          {editingShayari && (
                            <button 
                              type="button"
                              onClick={() => { setEditingShayari(null); setNewPoetry({ title: '', content: '', category: 'Ishq', author: 'Ali', isFeatured: false }); }}
                              className="flex-1 px-10 py-6 rounded-[2.5rem] border-2 border-burgundy/10 font-black uppercase text-[12px] hover:bg-burgundy/5 transition-all text-burgundy/40"
                            >
                              CANCEL
                            </button>
                          )}
                        </div>
                      </form>
                    </div>

                    {/* LIST SECTION */}
                    <div className="lg:col-span-3 space-y-10">
                      <div className="flex items-end justify-between border-b-2 border-gold/10 pb-8">
                        <h4 className="text-3xl md:text-4xl font-serif text-gold font-bold">Kalam Library</h4>
                        <div className="flex items-center space-x-4 text-[11px] font-black uppercase tracking-widest opacity-30">
                           <span className="w-2.5 h-2.5 rounded-full bg-gold"></span>
                           <span>{filteredShayari.length} Found</span>
                        </div>
                      </div>
                      
                      <div className="space-y-8 max-h-[1000px] overflow-y-auto pr-4 custom-scrollbar pb-10">
                        {filteredShayari.map((s) => (
                          <div key={s.id} className="bg-white p-8 md:p-10 rounded-[3.5rem] border border-burgundy/5 flex flex-col md:flex-row justify-between items-center gap-10 hover:shadow-2xl transition-all duration-700 border-l-[8px] border-l-gold group relative">
                            <div className="flex-1 min-w-0 pr-0 md:pr-6 text-center md:text-left">
                              {s.title && <h5 className="font-serif font-bold text-lg mb-2 text-burgundy/80">{s.title}</h5>}
                              <p className="font-accent text-2xl md:text-3xl italic line-clamp-4 mb-6 text-burgundy/90 leading-relaxed font-medium">"{s.content}"</p>
                              <div className="flex items-center justify-center md:justify-start flex-wrap gap-6 opacity-40 text-[10px] font-black uppercase tracking-[0.5em]">
                                <span className="bg-burgundy/5 px-4 py-1.5 rounded-full">{s.category}</span>
                                <span className="w-1.5 h-1.5 bg-burgundy rounded-full"></span>
                                <span className="underline decoration-gold/50 underline-offset-8 decoration-2">{s.author}</span>
                                {s.isFeatured && <span className="text-gold tracking-normal bg-gold/10 px-4 py-1.5 rounded-full font-bold">★ FEATURED</span>}
                              </div>
                            </div>
                            <div className="flex space-x-5 shrink-0">
                              <button 
                                onClick={() => handleEdit(s)}
                                className="p-6 bg-burgundy/5 text-burgundy hover:bg-burgundy hover:text-cream rounded-3xl transition-all shadow-md active:scale-90"
                                title="Edit"
                              >
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </button>
                              <button 
                                onClick={() => handleRemove(s.id)}
                                className="p-6 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-3xl transition-all shadow-md active:scale-90"
                                title="Delete"
                              >
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </div>
                        ))}
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-delayed {
          animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
          opacity: 0;
        }
        .animate-toast-in {
          animation: toastIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default App;
