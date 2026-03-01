import React from 'react';
import { Rocket, Target, Palette, Globe, Eraser, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';

const itemKeys = ['weapon', 'chams', 'world', 'cleansing', 'trigger'];
const icons = [Target, Palette, Globe, Eraser, Zap];
const gradients = ['from-amber-500 to-orange-600', 'from-pink-500 to-rose-600', 'from-emerald-500 to-teal-600', 'from-sky-500 to-blue-600', 'from-red-500 to-rose-600'];

const ComingSoon = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  return (
    <section className="relative py-24 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[400px] bg-amber-600/5 rounded-full filter blur-[200px]"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600/10 border border-amber-600/30 rounded-full mb-4">
            <Rocket size={16} className="text-amber-500" />
            <span className="text-sm text-amber-400 font-semibold">{t('comingSoon.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('comingSoon.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{t('comingSoon.titleHighlight')}</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t('comingSoon.description')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {itemKeys.map((key, i) => {
            const Icon = icons[i];
            return (
              <div key={key} data-testid={`coming-card-${key}`} className="group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 text-center hover:border-amber-600/40 transition-all duration-300 hover:-translate-y-1">
                <div className={`inline-flex p-3 bg-gradient-to-br ${gradients[i]} rounded-xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{t(`comingSoon.items.${key}.title`)}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{t(`comingSoon.items.${key}.desc`)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;
