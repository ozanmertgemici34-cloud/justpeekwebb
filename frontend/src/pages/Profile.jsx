import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MessageCircle, Save, ArrowLeft, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { language } = useLanguage();
  const tr = language === 'tr';
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    discord_username: user?.discord_username || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [pwMessage, setPwMessage] = useState({ text: '', type: '' });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const updated = await userAPI.updateProfile(formData);
      login({ ...user, ...updated });
      setMessage({ text: tr ? 'Profil başarıyla güncellendi!' : 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      setMessage({ text: error.response?.data?.detail || (tr ? 'Profil güncellenirken hata oluştu' : 'Error updating profile'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwMessage({ text: '', type: '' });

    if (passwordData.new_password.length < 6) {
      setPwMessage({ text: tr ? 'Yeni şifre en az 6 karakter olmalıdır' : 'New password must be at least 6 characters', type: 'error' });
      return;
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPwMessage({ text: tr ? 'Şifreler eşleşmiyor' : 'Passwords do not match', type: 'error' });
      return;
    }

    setPwLoading(true);
    try {
      await userAPI.changePassword(passwordData.current_password, passwordData.new_password);
      setPwMessage({ text: tr ? 'Şifre başarıyla değiştirildi!' : 'Password changed successfully!', type: 'success' });
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      setPwMessage({ text: error.response?.data?.detail || (tr ? 'Şifre değiştirilirken hata oluştu' : 'Error changing password'), type: 'error' });
    } finally {
      setPwLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate('/')} data-testid="profile-back-btn" className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors mb-6">
            <ArrowLeft size={20} /> {tr ? 'Ana Sayfaya Dön' : 'Back to Home'}
          </button>

          {/* Profile Info Section */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 mb-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{tr ? 'Profil Bilgileri' : 'Profile Information'}</h2>
                <p className="text-gray-400 text-sm">{tr ? 'Kişisel bilgilerinizi güncelleyin' : 'Update your personal information'}</p>
              </div>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="inline w-4 h-4 mr-2" />{tr ? 'Ad Soyad' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  data-testid="profile-name-input"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="inline w-4 h-4 mr-2" />Email
                </label>
                <input type="email" value={user.email} disabled className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-500 cursor-not-allowed" />
                <p className="text-gray-600 text-xs mt-1">{tr ? 'Email değiştirilemez' : 'Email cannot be changed'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MessageCircle className="inline w-4 h-4 mr-2" />{tr ? 'Discord Kullanıcı Adı' : 'Discord Username'}
                </label>
                <input
                  type="text"
                  value={formData.discord_username}
                  onChange={(e) => setFormData({ ...formData, discord_username: e.target.value })}
                  placeholder="username#1234"
                  data-testid="profile-discord-input"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                />
              </div>

              {message.text && (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'bg-green-500/10 text-green-500 border border-green-500/30'}`}>
                  {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                  {message.text}
                </div>
              )}

              <button type="submit" disabled={loading} data-testid="profile-save-btn" className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all hover:shadow-xl hover:shadow-red-600/30 disabled:opacity-50 flex items-center justify-center gap-2">
                <Save size={20} /> {loading ? (tr ? 'Kaydediliyor...' : 'Saving...') : (tr ? 'Profili Kaydet' : 'Save Profile')}
              </button>
            </form>
          </div>

          {/* Password Change Section */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{tr ? 'Şifre Değiştir' : 'Change Password'}</h2>
                <p className="text-gray-400 text-sm">{tr ? 'Hesap güvenliğinizi koruyun' : 'Keep your account secure'}</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {tr ? 'Mevcut Şifre' : 'Current Password'}
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    data-testid="current-password-input"
                    className="w-full px-4 py-3 pr-12 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                    required
                  />
                  <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {tr ? 'Yeni Şifre' : 'New Password'}
                </label>
                <div className="relative">
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    data-testid="new-password-input"
                    className="w-full px-4 py-3 pr-12 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                    placeholder={tr ? 'En az 6 karakter' : 'At least 6 characters'}
                    required
                  />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {tr ? 'Yeni Şifre (Tekrar)' : 'Confirm New Password'}
                </label>
                <input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  data-testid="confirm-password-input"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                  required
                />
              </div>

              {pwMessage.text && (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${pwMessage.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'bg-green-500/10 text-green-500 border border-green-500/30'}`}>
                  {pwMessage.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                  {pwMessage.text}
                </div>
              )}

              <button type="submit" disabled={pwLoading} data-testid="change-password-btn" className="w-full px-6 py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                <Lock size={20} /> {pwLoading ? (tr ? 'Değiştiriliyor...' : 'Changing...') : (tr ? 'Şifreyi Değiştir' : 'Change Password')}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
