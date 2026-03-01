import React from 'react';
import Logo from './Logo';
import BrandText from './BrandText';
import { Mail, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';

const Footer = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  return (
    <footer className="relative bg-black border-t border-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Brand */}
          <div>
            <Logo size="md" className="mb-4" />
            <p className="text-gray-400 text-sm leading-relaxed">
              <BrandText text={t('footer.description')} />
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                >
                  {t('nav.features')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                >
                  {t('nav.security')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                >
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">{t('footer.contact')}</h3>
            <div className="space-y-3">
              <a 
                href="https://discord.gg/Z2MdBahqcN"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm"
              >
                <MessageCircle size={16} />
                {t('footer.discordServer')}
              </a>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm"
              >
                <Mail size={16} />
                {t('footer.emailContact')}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-red-500 transition-colors text-sm">
              {t('footer.terms')}
            </a>
            <a href="#" className="text-gray-500 hover:text-red-500 transition-colors text-sm">
              {t('footer.privacy')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
