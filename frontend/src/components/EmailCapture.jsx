import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import BrandText from './BrandText';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import { emailAPI } from '../services/api';

const EmailCapture = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage(t('contact.error'));
      return;
    }

    setStatus('loading');

    try {
      await emailAPI.saveEmail(email);
      setStatus('success');
      setMessage(t('contact.success'));
      setEmail('');
      setTimeout(() => { setStatus('idle'); setMessage(''); }, 5000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.detail || t('contact.error'));
      setTimeout(() => { setStatus('idle'); setMessage(''); }, 5000);
    }
  };

  return (
    <section id="contact" className="relative py-24 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/20 rounded-full filter blur-[128px] animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-12 hover:border-red-600/50 transition-all duration-500 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/30 rounded-full mb-4">
              <Mail size={16} className="text-red-500" />
              <span className="text-sm text-red-400 font-semibold">{t('contact.badge')}</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('contact.title')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">
                {t('contact.titleHighlight')}
              </span>
            </h2>
            
            <p className="text-gray-400 text-lg">
              <BrandText text={t('contact.description')} />
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto" data-testid="email-capture-form">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('contact.emailPlaceholder')}
                data-testid="email-capture-input"
                className="flex-1 px-6 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                data-testid="email-capture-submit"
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all hover:shadow-xl hover:shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {t('contact.sending')}
                  </>
                ) : (
                  <>
                    {t('contact.send')}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>

            {status === 'success' && (
              <div className="mt-4 flex items-center gap-2 text-green-500 bg-green-500/10 border border-green-500/30 rounded-lg p-4" data-testid="email-success-msg">
                <CheckCircle size={20} />
                <span>{message}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="mt-4 flex items-center gap-2 text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg p-4" data-testid="email-error-msg">
                <AlertCircle size={20} />
                <span>{message}</span>
              </div>
            )}
          </form>

          <div className="mt-12 pt-12 border-t border-gray-800 text-center">
            <p className="text-gray-400 mb-6 text-lg">
              {t('contact.discordText')}
            </p>
            <a 
              href="https://discord.gg/Z2MdBahqcN"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-discord-btn"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#5865F2] text-white rounded-xl font-bold text-lg hover:bg-[#4752C4] transition-all hover:shadow-xl hover:shadow-[#5865F2]/30 hover:scale-105"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              {t('contact.discordButton')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailCapture;
