
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface NavbarProps {
  onNavigateHome?: () => void;
  onNavigateCareers?: () => void;
  onNavigateAcademy?: () => void;
  onNavigateContact?: () => void;
  onNavigateBlog?: () => void;
  isStandalonePage?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigateHome, onNavigateCareers, onNavigateAcademy, onNavigateContact, onNavigateBlog, isStandalonePage = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { heroSettings } = useContent();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (href === '#careers-page') {
      if (onNavigateCareers) onNavigateCareers();
      return;
    }

    if (href === '#academy-page') {
      if (onNavigateAcademy) onNavigateAcademy();
      return;
    }

    if (href === '#contact-page') {
      if (onNavigateContact) onNavigateContact();
      return;
    }

    if (href === '#blog-page') {
      if (onNavigateBlog) onNavigateBlog();
      return;
    }

    if (isStandalonePage) {
      if (onNavigateHome) {
        onNavigateHome();
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }, 100);
      }
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Location', href: '#locations' },
    { name: 'Blog', href: '#blog-page' },
    { name: 'Academy', href: '#academy-page' },
    { name: 'Careers', href: '#careers-page' },
    { name: 'Contact', href: '#contact-page' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 animate-fade-in-down ${
        isScrolled || isStandalonePage ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={(e) => handleLinkClick(e, '#home')}>
            {heroSettings.logo ? (
              <div className="h-6 flex items-center justify-center bg-transparent mr-2">
                <img 
                  src={heroSettings.logo} 
                  alt="Logo" 
                  className="h-full w-auto object-contain transition-all" 
                />
              </div>
            ) : null}
            <span className={`text-xl tracking-tight transition-colors ${isScrolled || isStandalonePage ? 'text-gray-900' : 'text-white'}`}>
              <span className="font-bold">PIXEL</span><span className="font-light">BARBERSHOP</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`text-[13px] font-medium tracking-tight transition-colors duration-200 hover:text-[#0c7565] cursor-pointer ${
                  isScrolled || isStandalonePage ? 'text-gray-800' : 'text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition-all ${isScrolled || isStandalonePage ? 'text-gray-800' : 'text-white'}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-2xl absolute top-full left-0 w-full border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-6 py-6 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="block px-4 py-3 text-sm font-medium text-gray-800 hover:text-[#0c7565] hover:bg-gray-50 transition-all cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;