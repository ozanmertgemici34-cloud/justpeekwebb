import React from 'react';
import { Gauge, Monitor, Layout, Diamond } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';

const itemKeys = ['latency', 'rendering', 'ui'];
const icons = [Gauge, Monitor, Layout];

const PremiumExperience = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  return (
    <section className="relative py-24 bg-gradient-to-b from-black to-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-600/8 rounded-full filter blur-[128px]"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/10 border border-purple-600/30 rounded-full mb-4">
            <Diamond size={16} className="text-purple-500" />
            <span className="text-sm text-purple-400 font-semibold">{t('premiumExperience.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('premiumExperience.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-violet-500">{t('premiumExperience.titleHighlight')}</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t('premiumExperience.description')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {itemKeys.map((key, i) => {
            const Icon = icons[i];
            return (
              <div key={key} data-testid={`premium-card-${key}`} className="group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 text-center hover:border-purple-600/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-600/10">
                <div className="inline-flex p-4 bg-gradient-to-br from-purple-600 to-violet-700 rounded-xl shadow-lg mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">{t(`premiumExperience.items.${key}.title`)}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{t(`premiumExperience.items.${key}.desc`)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PremiumExperience;
