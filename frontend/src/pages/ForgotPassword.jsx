import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { userAPI } from '../services/api';
import Logo from '../components/Logo';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const result = await userAPI.requestPasswordReset(email);
      if (result.token) {
        // Email service is mocked - redirect directly with token
        navigate(`/reset-password?token=${result.token}`);
      } else {
        setStatus('success');
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.detail || (tr ? 'Bir hata oluştu' : 'An error occurred'));
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-red-600/10 rounded-full filter blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-red-800/10 rounded-full filter blur-[128px] animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <Logo size="lg" className="mx-auto mb-4" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {status === 'success' ? (
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">
                {tr ? 'E-posta Gönderildi' : 'Email Sent'}
              </h2>
              <p className="text-gray-400 mb-6">
                {tr ? 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.' : 'A password reset link has been sent to your email.'}
              </p>
              <Link to="/login" className="text-red-500 hover:text-red-400 font-semibold text-sm">
                {tr ? 'Giriş sayfasına dön' : 'Back to login'}
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {tr ? 'Şifremi Unuttum' : 'Forgot Password'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {tr ? 'E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim' : 'Enter your email and we\'ll send you a reset link'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {tr ? 'E-posta Adresi' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                      placeholder="email@example.com"
                      data-testid="forgot-email-input"
                      required
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm">
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  data-testid="forgot-submit-btn"
                  className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all hover:shadow-xl hover:shadow-red-600/30 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {tr ? 'Gönderiliyor...' : 'Sending...'}
                    </>
                  ) : (
                    tr ? 'Sıfırlama Bağlantısı Gönder' : 'Send Reset Link'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-gray-400 hover:text-red-500 transition-colors text-sm flex items-center justify-center gap-2">
                  <ArrowLeft size={16} />
                  {tr ? 'Giriş sayfasına dön' : 'Back to login'}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
