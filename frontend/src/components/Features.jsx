import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Eye, Zap, Crosshair, Users, Ghost, Sparkles } from 'lucide-react';
import { features } from '../mock';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';

const Features = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);
  
  const iconMap = {
    Target: Target,
    Eye: Eye,
    Zap: Zap,
    Crosshair: Crosshair,
    Users: Users,
    Ghost: Ghost
  };

  return (
    <section id="features" className="relative py-24 bg-gradient-to-b from-black to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-red-600/10 rounded-full filter blur-[128px]"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-red-800/10 rounded-full filter blur-[128px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/30 rounded-full mb-4">
            <Sparkles size={16} className="text-red-500" />
            <span className="text-sm text-red-400 font-semibold">Ana Cephanelik</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Profesyonel <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">Özellikler</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Oyunun kurallarını değiştiren, rakipsiz yetenekler
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <div 
                key={feature.id}
                className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 hover:border-red-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-600/20 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${feature.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-600/0 to-red-600/20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6 text-lg">
            Tüm özellikleri deneyimlemek için hemen aramıza katıl
          </p>
          <a 
            href="https://discord.gg/Z2MdBahqcN"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-lg hover:from-red-700 hover:to-red-800 transition-all hover:shadow-2xl hover:shadow-red-600/50 hover:scale-105"
          >
            Discord'a Katıl
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;
