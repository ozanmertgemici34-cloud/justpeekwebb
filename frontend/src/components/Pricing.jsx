import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Lock, Zap, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';

const Pricing = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  const plans = [
    {
      id: 'weekly',
      name: t('pricing.plans.weekly.name'),
      price: '$2.99',
      duration: t('pricing.plans.weekly.duration'),
      icon: Zap,
      popular: false,
      features: [
        t('pricing.plans.weekly.features.0'),
        t('pricing.plans.weekly.features.1'),
        t('pricing.plans.weekly.features.2'),
        t('pricing.plans.weekly.features.3'),
      ]
    },
    {
      id: 'monthly',
      name: t('pricing.plans.monthly.name'),
      price: '$6.99',
      duration: t('pricing.plans.monthly.duration'),
      icon: Crown,
      popular: true,
      subBadge: language === 'tr' ? 'Sadece $0.23 / gün' : 'Only $0.23 / day',
      features: [
        t('pricing.plans.monthly.features.0'),
        t('pricing.plans.monthly.features.1'),
        t('pricing.plans.monthly.features.2'),
        t('pricing.plans.monthly.features.3'),
        t('pricing.plans.monthly.features.4'),
      ]
    },
    {
      id: 'bimonthly',
      name: t('pricing.plans.bimonthly.name'),
      price: '$11.99',
      duration: t('pricing.plans.bimonthly.duration'),
      icon: Crown,
      popular: false,
      saveBadge: language === 'tr' ? '%10 tasarruf' : '10% savings',
      features: [
        t('pricing.plans.bimonthly.features.0'),
        t('pricing.plans.bimonthly.features.1'),
        t('pricing.plans.bimonthly.features.2'),
        t('pricing.plans.bimonthly.features.3'),
        t('pricing.plans.bimonthly.features.4'),
      ]
    }
  ];

  return (
    <section id="pricing" className="relative py-24 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full filter blur-[128px]"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-800/10 rounded-full filter blur-[128px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('pricing.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">
              {t('pricing.titleHighlight')}
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Show plan cards to ALL users, hide prices if not logged in */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                data-testid={`pricing-card-${plan.id}`}
                className={`relative bg-gradient-to-br from-gray-900 to-black border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 ${
                  plan.popular
                    ? 'border-red-600 hover:border-red-500 shadow-xl shadow-red-600/20 scale-105'
                    : 'border-gray-800 hover:border-red-600/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold rounded-full">
                    {t('pricing.popular')}
                  </div>
                )}

                {plan.saveBadge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-bold rounded-full">
                    {plan.saveBadge}
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${
                    plan.popular ? 'bg-gradient-to-br from-red-600 to-red-700' : 'bg-gray-800'
                  }`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  
                  {user ? (
                    <>
                      <div className="text-4xl font-bold text-red-500 mb-1" data-testid={`price-${plan.id}`}>{plan.price}</div>
                      <div className="text-gray-500 text-sm">{plan.duration}</div>
                      {plan.subBadge && (
                        <div className="text-xs text-green-400 font-semibold mt-1">{plan.subBadge}</div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 my-3">
                      <Lock className="w-8 h-8 text-gray-500" />
                      <span className="text-gray-500 text-sm" data-testid={`price-locked-${plan.id}`}>
                        {t('pricing.loginToSee')}
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {user ? (
                  <Link
                    to="/purchase-request"
                    data-testid={`purchase-btn-${plan.id}`}
                    className={`block text-center px-6 py-3 rounded-xl font-bold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:shadow-red-600/30'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    {t('pricing.purchase')}
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    data-testid={`login-to-purchase-${plan.id}`}
                    className="block text-center px-6 py-3 rounded-xl font-bold bg-gray-800 text-white hover:bg-gray-700 transition-all"
                  >
                    {t('pricing.loginToPurchase')}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
