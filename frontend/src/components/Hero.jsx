import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { ArrowRight, Shield, Ghost } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import { DISCORD_LINK } from '../mock';

const Hero = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600 rounded-full filter blur-[128px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-800 rounded-full filter blur-[128px] animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMjAsMjAsMjAsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8 animate-float">
          <Logo size="xl" className="drop-shadow-2xl" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/30 rounded-full mb-6 backdrop-blur-sm">
          <Ghost size={16} className="text-red-500" />
          <span className="text-sm text-red-400 font-semibold">{t('hero.badge')}</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="text-white">{t('hero.title')}</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-rose-600 animate-gradient">
            {t('hero.subtitle')}
          </span>
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
          {t('hero.description')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            to="/purchase-request"
            className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:from-red-700 hover:to-red-800 transition-all hover:shadow-2xl hover:shadow-red-600/50 hover:scale-105 flex items-center gap-2"
          >
            {t('hero.buyNow')}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button 
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all hover:border-red-600/50"
          >
            {t('hero.explore')}
          </button>
        </div>

        {/* Stats/Features Quick Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-red-600/50 transition-all hover:bg-white/10">
            <Shield className="w-8 h-8 text-red-500 mb-3 mx-auto" />
            <h3 className="text-white font-bold text-lg mb-2">{t('hero.stats.zeroTrace')}</h3>
            <p className="text-gray-400 text-sm">{t('hero.stats.zeroTraceDesc')}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-red-600/50 transition-all hover:bg-white/10">
            <Ghost className="w-8 h-8 text-red-500 mb-3 mx-auto" />
            <h3 className="text-white font-bold text-lg mb-2">{t('hero.stats.ghostSignature')}</h3>
            <p className="text-gray-400 text-sm">{t('hero.stats.ghostSignatureDesc')}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-red-600/50 transition-all hover:bg-white/10">
            <div className="w-8 h-8 text-red-500 mb-3 mx-auto font-bold text-2xl">6+</div>
            <h3 className="text-white font-bold text-lg mb-2">{t('hero.stats.features')}</h3>
            <p className="text-gray-400 text-sm">{t('hero.stats.featuresDesc')}</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-red-600/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-red-600 rounded-full animate-scroll"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
