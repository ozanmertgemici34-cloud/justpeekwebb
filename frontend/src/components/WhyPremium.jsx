import React from 'react';
import { Rocket, Cpu, Layout, Diamond } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';

const premiumKeys = ['plugPlay', 'performance', 'ui'];
const iconMap = [Rocket, Cpu, Layout];
const gradients = [
  'from-red-600 to-rose-600',
  'from-rose-600 to-red-700',
  'from-red-700 to-red-600'
];

const WhyPremium = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full filter blur-[128px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/30 rounded-full mb-4">
            <Diamond size={16} className="text-red-500" />
            <span className="text-sm text-red-400 font-semibold">{t('whyPremium.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('whyPremium.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">
              {t('whyPremium.titleHighlight')}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {premiumKeys.map((key, index) => {
            const Icon = iconMap[index];
            return (
              <div
                key={key}
                data-testid={`premium-card-${key}`}
                className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 text-center hover:border-red-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-600/20 hover:-translate-y-2"
              >
                <div className={`inline-flex p-4 bg-gradient-to-br ${gradients[index]} rounded-xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                  {t(`whyPremium.items.${key}.title`)}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {t(`whyPremium.items.${key}.desc`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyPremium;
