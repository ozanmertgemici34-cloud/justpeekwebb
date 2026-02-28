import React from 'react';
import { Shield, Lock, EyeOff, CheckCircle, Fingerprint, Ghost, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';

const Security = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  const features = [
    { key: 'zeroTrace', icon: Fingerprint, color: 'from-red-500 to-rose-600' },
    { key: 'digitalCamo', icon: Ghost, color: 'from-rose-600 to-red-700' },
    { key: 'fullPrivacy', icon: ShieldAlert, color: 'from-red-700 to-red-600' }
  ];

  return (
    <section id="security" className="relative py-28 bg-black overflow-hidden">
      {/* Dramatic background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-950/20 via-transparent to-transparent"></div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-red-600/8 rounded-full filter blur-[200px]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMjAsMjAsMjAsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Big centered JustShield™ header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600/15 border border-red-500/40 rounded-full mb-6 shadow-lg shadow-red-600/10">
            <Shield size={18} className="text-red-400" />
            <span className="text-sm text-red-400 font-bold tracking-wider">JustShield™</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
            {t('security.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-600">
              {t('security.titleHighlight')}
            </span>{' '}
            {t('security.titleEnd')}
          </h2>

          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            {t('security.description')}{' '}
            <span className="text-red-500 font-bold">{t('security.ghostSignature')}</span>{' '}
            {t('security.descriptionEnd')}
          </p>
        </div>

        {/* 3 Feature Cards - horizontal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {features.map(({ key, icon: Icon, color }) => (
            <div
              key={key}
              data-testid={`shield-feature-${key}`}
              className="group relative bg-gradient-to-br from-gray-900/80 to-black border border-red-900/30 rounded-2xl p-8 hover:border-red-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-red-600/15 hover:-translate-y-1"
            >
              <div className={`inline-flex p-4 bg-gradient-to-br ${color} rounded-xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                {t(`security.features.${key}`)}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {t(`security.features.${key}Desc`)}
              </p>
            </div>
          ))}
        </div>

        {/* Big visual shield centerpiece */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            {/* Glow ring */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-full filter blur-[60px] opacity-25 animate-pulse"></div>
            
            <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-red-600/60 rounded-full w-40 h-40 flex items-center justify-center shadow-2xl shadow-red-600/20">
              <Shield className="w-20 h-20 text-red-500" strokeWidth={1.5} />
            </div>

            {/* Orbiting icons */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="bg-gray-900 border border-red-600/50 rounded-full p-2.5 shadow-lg">
                <Lock className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }}>
              <div className="bg-gray-900 border border-red-600/50 rounded-full p-2.5 shadow-lg">
                <EyeOff className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>
              <div className="bg-gray-900 border border-red-600/50 rounded-full p-2.5 shadow-lg">
                <Fingerprint className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 animate-bounce" style={{ animationDuration: '3s', animationDelay: '1.5s' }}>
              <div className="bg-gray-900 border border-red-600/50 rounded-full p-2.5 shadow-lg">
                <CheckCircle className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/80 to-black border border-red-900/30 rounded-xl p-5 text-center hover:border-red-500/50 transition-all">
            <div className="text-3xl font-black text-red-500 mb-1">100%</div>
            <div className="text-xs text-gray-400 font-medium">{t('security.stats.privacy')}</div>
          </div>
          <div className="bg-gradient-to-br from-gray-900/80 to-black border border-red-900/30 rounded-xl p-5 text-center hover:border-red-500/50 transition-all">
            <div className="text-3xl font-black text-red-500 mb-1">0</div>
            <div className="text-xs text-gray-400 font-medium">{t('security.stats.trace')}</div>
          </div>
          <div className="bg-gradient-to-br from-gray-900/80 to-black border border-red-900/30 rounded-xl p-5 text-center hover:border-red-500/50 transition-all">
            <div className="text-3xl font-black text-red-500 mb-1">24/7</div>
            <div className="text-xs text-gray-400 font-medium">{t('security.stats.protection')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Security;
