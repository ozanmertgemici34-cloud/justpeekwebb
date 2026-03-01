import React from 'react';
import { ShieldCheck, Bug, FileWarning, EyeOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';

const itemKeys = ['clean', 'engineering', 'falsePositive', 'privacy'];
const icons = [ShieldCheck, Bug, FileWarning, EyeOff];

const TrustGuarantee = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  return (
    <section className="relative py-24 bg-gradient-to-b from-black to-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-600/5 rounded-full filter blur-[200px]"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/10 border border-green-600/30 rounded-full mb-4">
            <ShieldCheck size={16} className="text-green-500" />
            <span className="text-sm text-green-400 font-semibold">{t('trustGuarantee.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('trustGuarantee.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">{t('trustGuarantee.titleHighlight')}</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">{t('trustGuarantee.description')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {itemKeys.map((key, i) => {
            const Icon = icons[i];
            return (
              <div key={key} data-testid={`trust-card-${key}`} className="group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 hover:border-green-600/40 transition-all duration-300">
                <div className="inline-flex p-3 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">{t(`trustGuarantee.items.${key}.title`)}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t(`trustGuarantee.items.${key}.desc`)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustGuarantee;
