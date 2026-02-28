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
                  {language === 'tr' ? 'Talebiniz Başarıyla Oluşturuldu!' : 'Request Successfully Created!'}
                </h2>
                <p className="text-gray-400 mb-8">
                  {language === 'tr' 
                    ? 'Satın alma talebiniz başarıyla oluşturuldu. Devam etmek için Discord sunucumuza katılın.'
                    : 'Your purchase request has been created successfully. Join our Discord server to continue.'}
                </p>
                
                {/* Discord Join Button - Primary Action */}
                <a 
                  href="https://discord.gg/Z2MdBahqcN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#5865F2] text-white rounded-xl font-bold text-lg hover:bg-[#4752C4] transition-all hover:shadow-xl hover:shadow-[#5865F2]/30 hover:scale-105 mb-4"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  {language === 'tr' ? 'Discord\'a Katıl' : 'Join Discord'}
                </a>
                
                {/* Secondary Action */}
                <div className="mt-4">
                  <Link 
                    to="/purchases"
                    className="text-gray-400 hover:text-red-500 transition-colors text-sm underline"
                  >
                    {language === 'tr' ? 'Taleplerime Dön' : 'Back to My Requests'}
                  </Link>
                </div>
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
