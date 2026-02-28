import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X, User, LogOut, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const t = (key) => getTranslation(language, key);

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
    } else {
      // If not on home page, navigate there first
      navigate('/');
      setTimeout(() => {
        const elem = document.getElementById(id);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-red-900/20 shadow-2xl' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Logo size="md" />
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-red-500 transition-colors font-medium">
              {t('nav.features')}
            </button>
            <button onClick={() => scrollToSection('security')} className="text-gray-300 hover:text-red-500 transition-colors font-medium">
              {t('nav.security')}
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-red-500 transition-colors font-medium">
              {t('nav.contact')}
            </button>

            <LanguageSwitcher />

            {user ? (
              <>
                {user.role !== 'admin' && (
                  <Link 
                    to="/purchases"
                    className="text-gray-300 hover:text-red-500 transition-colors font-medium flex items-center gap-2"
                  >
                    <ShoppingBag size={18} />
                    {t('nav.purchases')}
                  </Link>
                )}
                
                {user.role === 'admin' && (
                  <Link 
                    to="/admin"
                    className="text-gray-300 hover:text-red-500 transition-colors font-medium"
                  >
                    {t('nav.admin')}
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg hover:border-red-600 transition-all"
                  >
                    <User size={18} className="text-red-500" />
                    <span className="text-white text-sm">{user.name?.split(' ')[0]}</span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-red-600/10 hover:text-red-500 transition-colors"
                      >
                        <LogOut size={18} />
                        {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-gray-300 hover:text-red-500 transition-colors font-medium"
                >
                  {t('nav.login')}
                </Link>
                <Link 
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all hover:shadow-xl hover:shadow-red-600/30 hover:scale-105"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}

            <a 
              href="https://discord.gg/Z2MdBahqcN" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-[#5865F2] text-white rounded-lg font-semibold hover:bg-[#4752C4] transition-all hover:shadow-xl hover:shadow-[#5865F2]/30 hover:scale-105"
            >
              {t('nav.discord')}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2 hover:bg-red-600/20 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-red-900/20 pt-4 space-y-3">
            <button onClick={() => scrollToSection('features')} className="block w-full text-left text-gray-300 hover:text-red-500 transition-colors font-medium py-2">
              {t('nav.features')}
            </button>
            <button onClick={() => scrollToSection('security')} className="block w-full text-left text-gray-300 hover:text-red-500 transition-colors font-medium py-2">
              {t('nav.security')}
            </button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-gray-300 hover:text-red-500 transition-colors font-medium py-2">
              {t('nav.contact')}
            </button>

            <div className="py-2">
              <LanguageSwitcher />
            </div>

            {user ? (
              <>
                {user.role !== 'admin' && (
                  <Link 
                    to="/purchases"
                    className="block text-gray-300 hover:text-red-500 transition-colors font-medium py-2"
                  >
                    {t('nav.purchases')}
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link 
                    to="/admin"
                    className="block text-gray-300 hover:text-red-500 transition-colors font-medium py-2"
                  >
                    {t('nav.admin')}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-300 hover:text-red-500 transition-colors font-medium py-2"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="block text-gray-300 hover:text-red-500 transition-colors font-medium py-2"
                >
                  {t('nav.login')}
                </Link>
                <Link 
                  to="/register"
                  className="block text-center px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}

            <a 
              href="https://discord.gg/Z2MdBahqcN" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-center px-6 py-2.5 bg-[#5865F2] text-white rounded-lg font-semibold hover:bg-[#4752C4] transition-all"
            >
              {t('nav.discord')}
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
