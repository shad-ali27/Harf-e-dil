
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

  // Prevent scrolling when mobile menu is open
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
    { name: 'Essence', href: '#about' },
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
      className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-500 px-6 md:px-12 py-4 ${
        isScrolled ? 'bg-cream shadow-lg py-3 border-b border-burgundy/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <a 
            href="#home" 
            onClick={(e) => handleLinkClick(e, '#home')} 
            className="text-2xl font-serif font-bold text-burgundy tracking-tight hover:text-gold transition-colors"
          >
            Harf-e-Ali
          </a>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-10 items-center">
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
            className="px-5 py-2.5 bg-burgundy text-cream rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gold hover:text-burgundy transition-all shadow-md active:scale-95"
          >
            Admin Panel
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden relative text-burgundy p-2.5 focus:outline-none bg-white/80 rounded-xl border border-burgundy/10 shadow-sm z-[600]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1.5">
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-[550] bg-burgundy transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center justify-center p-12 ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-accent text-white/[0.03] italic pointer-events-none select-none">
            Ali
          </div>
          
          <div className="flex flex-col items-center space-y-10 relative z-10">
            <span className="font-serif italic text-gold text-3xl mb-4 border-b border-gold/20 pb-2">Harf-e-Ali</span>
            
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="font-accent text-5xl font-medium text-cream hover:text-gold transition-all transform hover:scale-105 active:scale-95 text-center"
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.name}
              </a>
            ))}
            
            <div className="w-24 h-px bg-gold/20 my-4"></div>

            <button 
              onClick={() => { onAdminClick(); setIsMobileMenuOpen(false); }}
              className="font-sans text-xl font-black uppercase tracking-[0.4em] text-gold hover:text-cream transition-all group flex flex-col items-center space-y-1"
            >
              <span>Admin Console</span>
              <span className="w-0 group-hover:w-full h-px bg-cream transition-all duration-500"></span>
            </button>
          </div>

          <div className="absolute bottom-12 flex flex-col items-center space-y-2 opacity-40">
            <p className="font-sans text-[9px] uppercase tracking-[0.4em] text-gold">Dil Se Dil Tak</p>
            <div className="flex items-center space-x-4">
              <span className="w-8 h-px bg-gold/20"></span>
              <span className="font-serif italic text-gold text-base">Alfaaz-e-Dil</span>
              <span className="w-8 h-px bg-gold/20"></span>
            </div>
          </div>
      </div>
    </nav>
  );
};

export default Navbar;
