import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu as MenuIcon, X } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Book a Table', href: '#book-table' },
  { label: 'Contact Us', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = navItems.map(item => item.href.substring(1));
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-background-luxury/85 backdrop-blur-md py-2.5 border-b border-white/5 shadow-lg'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

          {/* Logo */}
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center group">
            <div className="relative w-36 h-12 md:w-44 md:h-16 transition-transform duration-500 group-hover:scale-105">
              <img
                src="/logo-cropped.png"
                alt="365 The Travel Café Logo"
                className="absolute inset-0 w-full h-full object-contain object-left"
              />
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const itemSec = item.href.substring(1);
              const isActive = activeSection === itemSec;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="relative text-sm font-medium tracking-wider uppercase transition-colors duration-300 py-1"
                  style={{ color: isActive ? '#D4A373' : '#CFCFCF' }}
                >
                  <span className="hover:text-white transition-colors">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[1px] bg-accent-luxury"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Book A Table Button */}
          <div className="hidden lg:block">
            <a
              href="#book-table"
              onClick={(e) => handleNavClick(e, '#book-table')}
              className="btn-gold px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest text-background-luxury shadow-md hover:scale-105"
            >
              Book a Table
            </a>
          </div>

          {/* Mobile Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="block lg:hidden p-2 text-white hover:text-accent-luxury transition-colors"
            aria-label="Toggle navigation drawer"
          >
            {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-secondary-luxury border-l border-white/5 p-8 flex flex-col justify-between z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col gap-8 mt-12">
                <div className="flex justify-between items-center pb-6 border-b border-white/5 w-full">
                  <div className="relative w-36 h-12">
                    <img
                      src="/logo-cropped.png"
                      alt="365 Logo"
                      className="absolute inset-0 w-full h-full object-contain object-left"
                    />
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-white hover:text-accent-luxury">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex flex-col gap-6">
                  {navItems.map((item) => {
                    const itemSec = item.href.substring(1);
                    const isActive = activeSection === itemSec;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className={`text-base font-semibold tracking-widest uppercase transition-colors ${
                          isActive ? 'text-accent-luxury' : 'text-gray-luxury hover:text-white'
                        }`}
                      >
                        {item.label}
                      </a>
                    );
                  })}
                </div>
              </div>
              <div className="pb-8 mt-8">
                <a
                  href="#book-table"
                  onClick={(e) => handleNavClick(e, '#book-table')}
                  className="btn-gold w-full text-center block py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest text-background-luxury shadow-md"
                >
                  Book a Table
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
