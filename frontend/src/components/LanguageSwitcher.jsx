import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-1 border border-gray-800">
      <button
        onClick={() => changeLanguage('tr')}
        className={`px-3 py-1.5 rounded-md transition-all text-sm font-medium ${
          language === 'tr'
            ? 'bg-red-600 text-white shadow-lg'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
        title="Türkçe"
      >
        🇹🇷 TR
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1.5 rounded-md transition-all text-sm font-medium ${
          language === 'en'
            ? 'bg-red-600 text-white shadow-lg'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
        title="English"
      >
        🇺🇸 EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
