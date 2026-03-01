import React from 'react';
import { Eye, Bone, Backpack, AlertTriangle, Radio } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';

const itemKeys = ['skeleton', 'inventory', 'indicators', 'dormant'];
const icons = [Bone, Backpack, AlertTriangle, Radio];
const gradients = ['from-blue-600 to-cyan-600', 'from-cyan-600 to-blue-700', 'from-blue-700 to-indigo-600', 'from-indigo-600 to-blue-600'];

const EspSection = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[128px]"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-600/30 rounded-full mb-4">
            <Eye size={16} className="text-blue-500" />
            <span className="text-sm text-blue-400 font-semibold">{t('tacticalEsp.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('tacticalEsp.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">{t('tacticalEsp.titleHighlight')}</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t('tacticalEsp.description')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {itemKeys.map((key, i) => {
            const Icon = icons[i];
            return (
              <div key={key} data-testid={`esp-card-${key}`} className="group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-7 hover:border-blue-600/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-600/10">
                <div className={`inline-flex p-3 bg-gradient-to-br ${gradients[i]} rounded-xl shadow-lg mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{t(`tacticalEsp.items.${key}.title`)}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t(`tacticalEsp.items.${key}.desc`)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EspSection;
