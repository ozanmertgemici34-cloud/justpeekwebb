import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-red-900/20 shadow-2xl' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo size="md" />
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-red-500 transition-colors font-medium">
              Özellikler
            </button>
            <button onClick={() => scrollToSection('security')} className="text-gray-300 hover:text-red-500 transition-colors font-medium">
              Güvenlik
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-red-500 transition-colors font-medium">
              İletişim
            </button>
            <a 
              href="https://discord.gg/Z2MdBahqcN" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all hover:shadow-xl hover:shadow-red-600/30 hover:scale-105"
            >
              Discord'a Katıl
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-red-600/20 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-red-900/20 pt-4 space-y-3">
            <button onClick={() => scrollToSection('features')} className="block w-full text-left text-gray-300 hover:text-red-500 transition-colors font-medium py-2">
              Özellikler
            </button>
            <button onClick={() => scrollToSection('security')} className="block w-full text-left text-gray-300 hover:text-red-500 transition-colors font-medium py-2">
              Güvenlik
            </button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-gray-300 hover:text-red-500 transition-colors font-medium py-2">
              İletişim
            </button>
            <a 
              href="https://discord.gg/Z2MdBahqcN" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-center px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all"
            >
              Discord'a Katıl
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
