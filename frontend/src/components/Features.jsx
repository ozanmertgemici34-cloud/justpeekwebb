import React from 'react';
import { Target, Eye, Zap, Crosshair, Users, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';

const featureKeys = ['aimbot', 'esp', 'triggerbot', 'rcs', 'spectator'];
const iconMap = [Target, Eye, Zap, Crosshair, Users];
const gradients = [
  'from-red-600 to-rose-600',
  'from-rose-600 to-pink-600',
  'from-red-700 to-red-600',
  'from-red-600 to-orange-600',
  'from-rose-600 to-red-600'
];

const Features = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  return (
    <section id="features" className="relative py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-red-600/10 rounded-full filter blur-[128px]"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-red-800/10 rounded-full filter blur-[128px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/30 rounded-full mb-4">
            <Sparkles size={16} className="text-red-500" />
            <span className="text-sm text-red-400 font-semibold">{t('features.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('features.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">
              {t('features.titleHighlight')}
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureKeys.map((key, index) => {
            const Icon = iconMap[index];
            return (
              <div 
                key={key}
                data-testid={`feature-card-${key}`}
                className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 hover:border-red-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-600/20 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                
                <div className="relative mb-6">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${gradients[index]} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                  {t(`features.items.${key}.title`)}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {t(`features.items.${key}.desc`)}
                </p>

                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-600/0 to-red-600/20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            {t('features.cta')}
          </h3>
          <p className="text-gray-400 mb-8 text-lg max-w-xl mx-auto">
            {t('features.ctaDesc')}
          </p>
          <a 
            href="https://discord.gg/Z2MdBahqcN"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="features-discord-btn"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:from-red-700 hover:to-red-800 transition-all hover:shadow-2xl hover:shadow-red-600/50 hover:scale-105"
          >
            {t('nav.discord')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;
