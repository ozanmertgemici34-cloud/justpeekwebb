import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Lock, Zap, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Pricing = () => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const plans = [
    {
      id: 'weekly',
      name: language === 'tr' ? 'Haftalık' : 'Weekly',
      nameEn: 'Weekly',
      price: '$5.99',
      duration: language === 'tr' ? '7 Gün' : '7 Days',
      icon: Zap,
      popular: false,
      features: [
        language === 'tr' ? 'Tüm Premium Özellikler' : 'All Premium Features',
        language === 'tr' ? '24/7 Destek' : '24/7 Support',
        language === 'tr' ? 'Otomatik Güncellemeler' : 'Auto Updates',
        language === 'tr' ? '7 Günlük Erişim' : '7 Days Access'
      ]
    },
    {
      id: 'monthly',
      name: language === 'tr' ? '1 Aylık' : '1 Month',
      nameEn: '1 Month',
      price: '$4.99',
      duration: language === 'tr' ? '30 Gün' : '30 Days',
      icon: Crown,
      popular: true,
      features: [
        language === 'tr' ? 'Tüm Premium Özellikler' : 'All Premium Features',
        language === 'tr' ? '24/7 Öncelikli Destek' : '24/7 Priority Support',
        language === 'tr' ? 'Otomatik Güncellemeler' : 'Auto Updates',
        language === 'tr' ? '30 Günlük Erişim' : '30 Days Access',
        language === 'tr' ? 'En İyi Değer!' : 'Best Value!'
      ]
    },
    {
      id: 'bimonthly',
      name: language === 'tr' ? '2 Aylık' : '2 Months',
      nameEn: '2 Months',
      price: '$6.99',
      duration: language === 'tr' ? '60 Gün' : '60 Days',
      icon: Crown,
      popular: false,
      features: [
        language === 'tr' ? 'Tüm Premium Özellikler' : 'All Premium Features',
        language === 'tr' ? '24/7 VIP Destek' : '24/7 VIP Support',
        language === 'tr' ? 'Otomatik Güncellemeler' : 'Auto Updates',
        language === 'tr' ? '60 Günlük Erişim' : '60 Days Access',
        language === 'tr' ? 'Maksimum Tasarruf' : 'Maximum Savings'
      ]
    }
  ];

  return (
    <section id="pricing" className="relative py-24 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full filter blur-[128px]"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-800/10 rounded-full filter blur-[128px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {language === 'tr' ? 'Basit ve Şeffaf' : 'Simple and Transparent'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">
              {language === 'tr' ? 'Fiyatlandırma' : 'Pricing'}
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            {language === 'tr' 
              ? 'Size en uygun paketi seçin ve hemen başlayın'
              : 'Choose the plan that suits you best and get started'}
          </p>
        </div>

        {user ? (
          /* Logged in - Show Prices */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.id}
                  className={`relative bg-gradient-to-br from-gray-900 to-black border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 ${
                    plan.popular
                      ? 'border-red-600 hover:border-red-500 shadow-xl shadow-red-600/20 scale-105'
                      : 'border-gray-800 hover:border-red-600/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold rounded-full">
                      {language === 'tr' ? 'EN POPÜLER' : 'MOST POPULAR'}
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`inline-flex p-3 rounded-xl mb-4 ${
                      plan.popular ? 'bg-gradient-to-br from-red-600 to-red-700' : 'bg-gray-800'
                    }`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-red-500 mb-1">{plan.price}</div>
                    <div className="text-gray-500 text-sm">{plan.duration}</div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-300">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/purchase-request"
                    className={`block text-center px-6 py-3 rounded-xl font-bold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:shadow-red-600/30'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    {language === 'tr' ? 'Satın Al' : 'Purchase'}
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          /* Not logged in - Show locked prices */
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-12">
              <Lock className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                {language === 'tr' ? 'Fiyatları Görmek İçin Giriş Yapın' : 'Sign In to View Pricing'}
              </h3>
              <p className="text-gray-400 mb-8">
                {language === 'tr'
                  ? 'Özel fiyatlandırmamızı ve paketlerimizi görmek için lütfen giriş yapın veya kayıt olun.'
                  : 'Please sign in or register to view our exclusive pricing and packages.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all"
                >
                  {language === 'tr' ? 'Giriş Yap' : 'Sign In'}
                </Link>
                <Link
                  to="/register"
                  className="px-8 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-all"
                >
                  {language === 'tr' ? 'Kayıt Ol' : 'Register'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;
