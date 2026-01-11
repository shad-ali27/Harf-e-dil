
import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onAdminClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAdminClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Categories', href: '#categories' },
    { name: 'Library', href: '#library' },
    { name: 'Reflection', href: '#about' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-500 px-4 md:px-12 py-4 ${
        isScrolled ? 'bg-cream shadow-lg py-3 border-b border-burgundy/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <a 
            href="#home" 
            onClick={(e) => handleLinkClick(e, '#home')} 
            className="text-2xl md:text-3xl font-serif font-bold text-burgundy tracking-tight hover:text-gold transition-colors"
          >
            Harf-e-Ali
          </a>
        </div>

        <div className="hidden md:flex space-x-8 lg:space-x-12 items-center">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="font-sans text-[11px] font-black uppercase tracking-[0.2em] text-burgundy/60 hover:text-burgundy transition-all relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <button 
            onClick={onAdminClick}
            className="px-6 py-3 bg-burgundy text-cream rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gold hover:text-burgundy transition-all shadow-md active:scale-95 font-sans"
          >
            Admin Panel
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden relative text-burgundy p-3 focus:outline-none bg-white/80 rounded-2xl border border-burgundy/10 shadow-sm z-[600]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1.5">
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-4 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-[550] bg-burgundy transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center justify-center p-8 ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18rem] font-accent text-white/[0.03] italic pointer-events-none select-none">
            Ali
          </div>
          
          <div className="flex flex-col items-center space-y-8 relative z-10 w-full">
            <span className="font-serif italic text-gold text-2xl mb-2 border-b border-gold/20 pb-2">Harf-e-Ali</span>
            
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="font-accent text-4xl font-medium text-cream hover:text-gold transition-all transform hover:scale-105 active:scale-95 text-center"
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.name}
              </a>
            ))}
            
            <div className="w-20 h-px bg-gold/20 my-2"></div>

            <div className="flex flex-col space-y-6 w-full max-w-xs">
              <button 
                onClick={(e) => handleLinkClick(e, '#contact')}
                className="w-full py-5 bg-gold text-burgundy rounded-2xl font-sans text-xs font-black uppercase tracking-[0.3em] shadow-xl active:scale-95"
              >
                Get in Touch
              </button>
              
              <button 
                onClick={() => { onAdminClick(); setIsMobileMenuOpen(false); }}
                className="w-full py-5 border-2 border-gold/30 text-gold rounded-2xl font-sans text-xs font-black uppercase tracking-[0.3em] active:scale-95"
              >
                Admin Console
              </button>
            </div>
          </div>
      </div>
    </nav>
  );
};

export default Navbar;
