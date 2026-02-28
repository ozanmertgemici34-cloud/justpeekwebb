import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Calendar, DollarSign, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import { purchaseAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PurchaseHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);
  
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      loadPurchases();
    }
  }, [user, navigate]);

  const loadPurchases = async () => {
    try {
      const data = await purchaseAPI.getUserPurchases();
      setPurchases(data);
    } catch (error) {
      console.error('Error loading purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const userPurchases = purchases;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 border-green-500/30 text-green-500';
      case 'expired':
        return 'bg-red-500/10 border-red-500/30 text-red-500';
      case 'pending':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors mb-6"
            >
              <ArrowLeft size={20} />
              {language === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}
            </button>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">{t('purchases.title')}</h1>
                <p className="text-gray-400">{t('purchases.subtitle')}</p>
              </div>
            </div>
          </div>

          {/* Purchases List */}
          {loading ? (
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-12 text-center">
              <div className="w-12 h-12 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">{language === 'tr' ? 'Yükleniyor...' : 'Loading...'}</p>
            </div>
          ) : userPurchases.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{t('purchases.empty')}</h3>
              <p className="text-gray-400 mb-6">{language === 'tr' ? 'Satın alma talebi oluşturun!' : 'Create a purchase request!'}</p>
              <Link
                to="/purchase-request"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all hover:shadow-xl hover:shadow-red-600/30"
              >
                {language === 'tr' ? 'Satın Alma Talebi Oluştur' : 'Create Purchase Request'}
              </Link>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50 border-b border-gray-800">
                    <tr>
                      <th className="text-left px-6 py-4 text-gray-400 font-semibold">{t('purchases.columns.product')}</th>
                      <th className="text-left px-6 py-4 text-gray-400 font-semibold">{t('purchases.columns.date')}</th>
                      <th className="text-left px-6 py-4 text-gray-400 font-semibold">{t('purchases.columns.price')}</th>
                      <th className="text-left px-6 py-4 text-gray-400 font-semibold">{t('purchases.columns.status')}</th>
                      <th className="text-left px-6 py-4 text-gray-400 font-semibold">
                        {language === 'tr' ? 'Son Kullanım' : 'Expiry Date'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userPurchases.map((purchase) => (
                      <tr key={purchase.id} className="border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                              <ShoppingBag className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white font-medium">{purchase.product}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            {new Date(purchase.purchased_at).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-green-500 font-semibold">
                            <DollarSign size={16} />
                            {purchase.price}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${getStatusColor(purchase.status)}`}>
                            {getStatusIcon(purchase.status)}
                            {t(`purchases.status.${purchase.status}`)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(purchase.expiry_date).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PurchaseHistory;
