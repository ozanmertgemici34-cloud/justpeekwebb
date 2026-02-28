import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Lock, Zap, Crown, Shield, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';

const Pricing = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);
  const [openFaq, setOpenFaq] = useState(null);

  const plans = [
    {
      id: 'weekly',
      name: t('pricing.plans.weekly.name'),
      price: '$2.99',
      duration: t('pricing.plans.weekly.duration'),
      icon: Zap,
      popular: false,
      tagline: t('pricing.plans.weekly.tagline'),
      bottomNote: t('pricing.plans.weekly.bottomNote'),
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
      tagline: t('pricing.plans.monthly.tagline'),
      bottomNote: t('pricing.plans.monthly.bottomNote'),
      features: [
        t('pricing.plans.monthly.features.0'),
        t('pricing.plans.monthly.features.1'),
        t('pricing.plans.monthly.features.2'),
        t('pricing.plans.monthly.features.3'),
      ]
    },
    {
      id: 'bimonthly',
      name: t('pricing.plans.bimonthly.name'),
      price: '$11.99',
      duration: t('pricing.plans.bimonthly.duration'),
      icon: Crown,
      popular: false,
      saveBadge: t('pricing.plans.bimonthly.saveBadge'),
      tagline: t('pricing.plans.bimonthly.tagline'),
      bottomNote: t('pricing.plans.bimonthly.bottomNote'),
      features: [
        t('pricing.plans.bimonthly.features.0'),
        t('pricing.plans.bimonthly.features.1'),
        t('pricing.plans.bimonthly.features.2'),
        t('pricing.plans.bimonthly.features.3'),
      ]
    }
  ];

  const faqItems = [
    { q: t('pricing.faq.q1'), a: t('pricing.faq.a1') },
    { q: t('pricing.faq.q2'), a: t('pricing.faq.a2') },
    { q: t('pricing.faq.q3'), a: t('pricing.faq.a3') },
  ];

  const trustItems = [
    t('pricing.trust.0'),
    t('pricing.trust.1'),
    t('pricing.trust.2'),
    t('pricing.trust.3'),
  ];

  return (
    <section id="pricing" className="relative py-28 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full filter blur-[128px]"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-800/10 rounded-full filter blur-[128px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Trust Band */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-12">
          {trustItems.map((item, i) => (
            <span key={i} className="flex items-center gap-2 text-sm text-gray-400">
              <Check className="w-4 h-4 text-green-500" />
              {item}
            </span>
          ))}
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                data-testid={`pricing-card-${plan.id}`}
                className={`relative bg-gradient-to-br from-gray-900 to-black border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 flex flex-col ${
                  plan.popular
                    ? 'border-red-600 hover:border-red-500 shadow-xl shadow-red-600/20 md:scale-105'
                    : 'border-gray-800 hover:border-red-600/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold rounded-full whitespace-nowrap">
                    {t('pricing.popular')}
                  </div>
                )}

                {plan.saveBadge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-bold rounded-full whitespace-nowrap">
                    {plan.saveBadge}
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${
                    plan.popular ? 'bg-gradient-to-br from-red-600 to-red-700' : 'bg-gray-800'
                  }`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-gray-500 text-xs mb-3">{plan.tagline}</p>
                  
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

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-300 text-sm">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div>
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
                  <p className="text-center text-gray-600 text-xs mt-2">{plan.bottomNote}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">{t('pricing.faqTitle')}</h3>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div
                key={i}
                data-testid={`faq-item-${i}`}
                className="bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 rounded-xl overflow-hidden hover:border-red-600/30 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-white font-semibold text-sm">{item.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-red-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-gray-400 text-sm leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Global users banner */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-full">
            <Globe className="w-5 h-5 text-red-500" />
            <span className="text-gray-400 text-sm font-medium">{t('pricing.globalBanner')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
