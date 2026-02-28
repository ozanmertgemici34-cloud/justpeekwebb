import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import { mockUsers } from '../mock';
import Logo from '../components/Logo';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call real API
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      // Save user data with token
      const userData = {
        ...response.user,
        token: response.access_token
      };

      login(userData);
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/purchases');
      }
    } catch (err) {
      setError(err.response?.data?.detail || t('auth.login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-6 py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-red-600/10 rounded-full filter blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-red-800/10 rounded-full filter blur-[128px] animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <Logo size="lg" className="mx-auto mb-4" />
          </Link>
        </div>

        {/* Login Form */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{t('auth.login.title')}</h2>
            <p className="text-gray-400">{t('auth.login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.login.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.login.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all hover:shadow-xl hover:shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t('auth.login.submit')}...
                </>
              ) : (
                t('auth.login.submit')
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {t('auth.login.noAccount')}{' '}
              <Link to="/register" className="text-red-500 hover:text-red-400 font-semibold">
                {t('auth.login.register')}
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Demo: test@example.com / test123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
