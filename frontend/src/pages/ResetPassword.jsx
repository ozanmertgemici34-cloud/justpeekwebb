import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { userAPI } from '../services/api';
import Logo from '../components/Logo';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const tr = language === 'tr';
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(token ? 'idle' : 'no-token'); // idle, success, error, no-token
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg(tr ? 'Şifre en az 6 karakter olmalıdır' : 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(tr ? 'Şifreler eşleşmiyor' : 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await userAPI.resetPassword(token, password);
      setStatus('success');
    } catch (error) {
      setErrorMsg(error.response?.data?.detail || (tr ? 'Geçersiz veya süresi dolmuş token' : 'Invalid or expired token'));
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
          {status === 'no-token' ? (
            <div className="text-center py-6">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">
                {tr ? 'Geçersiz Bağlantı' : 'Invalid Link'}
              </h2>
              <p className="text-gray-400 mb-6">
                {tr ? 'Şifre sıfırlama bağlantısı geçersiz veya eksik.' : 'The password reset link is invalid or missing.'}
              </p>
              <Link to="/forgot-password" className="text-red-500 hover:text-red-400 font-semibold">
                {tr ? 'Yeni sıfırlama bağlantısı al' : 'Get a new reset link'}
              </Link>
            </div>
          ) : status === 'success' ? (
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">
                {tr ? 'Şifre Sıfırlandı!' : 'Password Reset!'}
              </h2>
              <p className="text-gray-400 mb-6">
                {tr ? 'Şifreniz başarıyla değiştirildi. Yeni şifrenizle giriş yapabilirsiniz.' : 'Your password has been changed. You can now log in with your new password.'}
              </p>
              <button
                onClick={() => navigate('/login')}
                data-testid="go-to-login-btn"
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all"
              >
                {tr ? 'Giriş Yap' : 'Log In'}
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {tr ? 'Yeni Şifre Belirle' : 'Set New Password'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {tr ? 'Hesabınız için yeni bir şifre oluşturun' : 'Create a new password for your account'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {tr ? 'Yeni Şifre' : 'New Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                      placeholder={tr ? 'En az 6 karakter' : 'At least 6 characters'}
                      data-testid="reset-password-input"
                      required
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {tr ? 'Şifre Tekrar' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                      data-testid="reset-confirm-password-input"
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
                  data-testid="reset-submit-btn"
                  className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all hover:shadow-xl hover:shadow-red-600/30 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {tr ? 'Sıfırlanıyor...' : 'Resetting...'}
                    </>
                  ) : (
                    tr ? 'Şifreyi Sıfırla' : 'Reset Password'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
