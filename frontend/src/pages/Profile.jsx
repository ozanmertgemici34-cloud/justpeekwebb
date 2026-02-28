import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MessageCircle, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { language } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    discord_username: user?.discord_username || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const updated = await userAPI.updateProfile(formData);
      login({ ...user, ...updated });
      setMessage(language === 'tr' ? 'Profil güncellendi!' : 'Profile updated!');
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Error updating profile');
    } finally {
      setLoading(false);
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
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors mb-6">
            <ArrowLeft size={20} /> {language === 'tr' ? 'Geri' : 'Back'}
          </button>
          
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-8">{language === 'tr' ? 'Profil Ayarları' : 'Profile Settings'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="inline w-4 h-4 mr-2" />{language === 'tr' ? 'Ad Soyad' : 'Name'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="inline w-4 h-4 mr-2" />Email
                </label>
                <input type="email" value={user.email} disabled className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-500 cursor-not-allowed" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MessageCircle className="inline w-4 h-4 mr-2" />Discord Username
                </label>
                <input
                  type="text"
                  value={formData.discord_username}
                  onChange={(e) => setFormData({ ...formData, discord_username: e.target.value })}
                  placeholder="username#1234"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                />
              </div>

              {message && (
                <div className={`p-3 rounded-lg ${message.includes('Error') ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                  {message}
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2">
                <Save size={20} /> {loading ? (language === 'tr' ? 'Kaydediliyor...' : 'Saving...') : (language === 'tr' ? 'Kaydet' : 'Save')}
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
