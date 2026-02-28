import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Mail, MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { purchaseRequestAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PurchaseRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    discord_username: user?.discord_username || '',
    product: 'JustPeek - 1 Month',
    message: ''
  });
  
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await purchaseRequestAPI.createRequest(formData);
      setStatus('success');
      
      setTimeout(() => {
        navigate('/purchases');
      }, 2000);
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.detail || 'Error creating request');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 shadow-2xl">
            {status === 'success' ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  {language === 'tr' ? 'Talebiniz Alındı!' : 'Request Received!'}
                </h2>
                <p className="text-gray-400 mb-6">
                  {language === 'tr' 
                    ? 'Satın alma talebiniz başarıyla oluşturuldu. En kısa sürede sizinle iletişime geçeceğiz.'
                    : 'Your purchase request has been created. We will contact you soon.'}
                </p>
                <Link 
                  to="/purchases"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all"
                >
                  {language === 'tr' ? 'Satın Alımlarım' : 'My Purchases'}
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full mb-4">
                    <ShoppingBag className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {language === 'tr' ? 'Satın Alma Talebi' : 'Purchase Request'}
                  </h2>
                  <p className="text-gray-400">
                    {language === 'tr' 
                      ? 'Bilgilerinizi doldurun, en kısa sürede sizinle iletişime geçelim'
                      : 'Fill in your details and we will contact you soon'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Mail className="inline w-4 h-4 mr-2" />
                      {language === 'tr' ? 'E-posta' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <MessageCircle className="inline w-4 h-4 mr-2" />
                      {language === 'tr' ? 'Discord Kullanıcı Adı' : 'Discord Username'}
                    </label>
                    <input
                      type="text"
                      value={formData.discord_username}
                      onChange={(e) => setFormData({ ...formData, discord_username: e.target.value })}
                      placeholder="username#1234"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {language === 'tr' ? 'Ürün' : 'Product'}
                    </label>
                    <select
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                    >
                      <option value="JustPeek - 1 Week">JustPeek - 1 {language === 'tr' ? 'Hafta' : 'Week'}</option>
                      <option value="JustPeek - 1 Month">JustPeek - 1 {language === 'tr' ? 'Ay' : 'Month'}</option>
                      <option value="JustPeek - 3 Months">JustPeek - 3 {language === 'tr' ? 'Ay' : 'Months'}</option>
                      <option value="JustPeek - Lifetime">JustPeek - {language === 'tr' ? 'Ömür Boyu' : 'Lifetime'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {language === 'tr' ? 'Mesaj (Opsiyonel)' : 'Message (Optional)'}
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                      placeholder={language === 'tr' ? 'Ek bilgiler...' : 'Additional information...'}
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm">
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all hover:shadow-xl hover:shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {language === 'tr' ? 'Gönderiliyor...' : 'Sending...'}
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        {language === 'tr' ? 'Talebi Gönder' : 'Send Request'}
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PurchaseRequest;
