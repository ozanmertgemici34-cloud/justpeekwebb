import React from 'react';
import { Shield, Lock, EyeOff, CheckCircle } from 'lucide-react';
import { securityFeatures } from '../mock';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';

const Security = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);
  
  return (
    <section id="security" className="relative py-24 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-gradient-to-b from-red-900/5 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMjAsMjAsMjAsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/30 rounded-full mb-6">
              <Shield size={16} className="text-red-500" />
              <span className="text-sm text-red-400 font-semibold">{t('security.badge')}</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {t('security.title')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">
                {t('security.titleHighlight')}
              </span>{' '}
              {t('security.titleEnd')}
            </h2>

            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              {t('security.description')}{' '}
              <span className="text-red-500 font-semibold">{t('security.ghostSignature')}</span>{' '}
              {t('security.descriptionEnd')}
            </p>

            {/* Security Features List */}
            <div className="space-y-6">
              {securityFeatures.map((feature, index) => (
                <div 
                  key={feature.id} 
                  className="flex items-start gap-4 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1 group-hover:text-red-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-12 hover:border-red-600/50 transition-all duration-500">
              {/* Center Shield Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-full p-12 mx-auto w-64 h-64 flex items-center justify-center">
                  <Shield className="w-32 h-32 text-red-500" strokeWidth={1.5} />
                </div>
              </div>

              {/* Orbiting Icons */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 animate-float">
                  <div className="bg-gray-900 border border-red-600/50 rounded-full p-3">
                    <Lock className="w-6 h-6 text-red-500" />
                  </div>
                </div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="bg-gray-900 border border-red-600/50 rounded-full p-3">
                    <EyeOff className="w-6 h-6 text-red-500" />
                  </div>
                </div>
                <div className="absolute top-1/2 left-8 transform -translate-y-1/2 animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="bg-gray-900 border border-red-600/50 rounded-full p-3">
                    <Shield className="w-6 h-6 text-red-500" />
                  </div>
                </div>
                <div className="absolute top-1/2 right-8 transform -translate-y-1/2 animate-float" style={{ animationDelay: '1.5s' }}>
                  <div className="bg-gray-900 border border-red-600/50 rounded-full p-3">
                    <CheckCircle className="w-6 h-6 text-red-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4 text-center hover:border-red-600/50 transition-all">
                <div className="text-2xl font-bold text-red-500 mb-1">100%</div>
                <div className="text-xs text-gray-400">Gizlilik</div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4 text-center hover:border-red-600/50 transition-all">
                <div className="text-2xl font-bold text-red-500 mb-1">0</div>
                <div className="text-xs text-gray-400">İz</div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4 text-center hover:border-red-600/50 transition-all">
                <div className="text-2xl font-bold text-red-500 mb-1">24/7</div>
                <div className="text-xs text-gray-400">Koruma</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Security;
