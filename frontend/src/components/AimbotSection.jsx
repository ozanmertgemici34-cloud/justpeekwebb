import React from 'react';
import { Target, Crosshair, MousePointer } from 'lucide-react';
import BrandText from './BrandText';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';

const itemKeys = ['magnet', 'rageLock', 'smartTarget'];
const icons = [Target, Crosshair, MousePointer];
const gradients = ['from-red-600 to-rose-600', 'from-rose-600 to-red-700', 'from-red-700 to-red-600'];

const AimbotSection = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  return (
    <section className="relative py-24 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-red-600/10 rounded-full filter blur-[128px]"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/30 rounded-full mb-4">
            <Target size={16} className="text-red-500" />
            <span className="text-sm text-red-400 font-semibold">{t('aimbot.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('aimbot.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">{t('aimbot.titleHighlight')}</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto"><BrandText text={t('aimbot.description')} /></p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {itemKeys.map((key, i) => {
            const Icon = icons[i];
            return (
              <div key={key} data-testid={`aimbot-card-${key}`} className="group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 hover:border-red-600/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-600/20">
                <div className={`inline-flex p-4 bg-gradient-to-br ${gradients[i]} rounded-xl shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">{t(`aimbot.items.${key}.title`)}</h3>
                <p className="text-gray-400 leading-relaxed text-sm"><BrandText text={t(`aimbot.items.${key}.desc`)} /></p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AimbotSection;
