import React from 'react';
import Logo from './Logo';
import { Mail, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-black border-t border-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Brand */}
          <div>
            <Logo size="md" className="mb-4" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Görünmezliğin gücü, zaferin adresi. JustPeek ile oyunun kurallarını değiştir.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Hızlı Erişim</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                >
                  Özellikler
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('security').scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                >
                  Güvenlik
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                >
                  İletişim
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">İletişim</h3>
            <div className="space-y-3">
              <a 
                href="https://discord.gg/Z2MdBahqcN"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm"
              >
                <MessageCircle size={16} />
                Discord Sunucusu
              </a>
              <button 
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm"
              >
                <Mail size={16} />
                E-posta ile İletişim
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 JustPeek Internal. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-red-500 transition-colors text-sm">
              Kullanım Koşulları
            </a>
            <a href="#" className="text-gray-500 hover:text-red-500 transition-colors text-sm">
              Gizlilik Politikası
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
