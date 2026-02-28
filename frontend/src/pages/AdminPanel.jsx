import React, { useState, useEffect } from 'react';
import { Mail, Calendar, Trash2, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { mockEmails } from '../mock';

const AdminPanel = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Simple authentication (will be replaced with real backend auth)
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setAuthError('');
      loadEmails();
    } else {
      setAuthError('Hatalı şifre!');
    }
  };

  const loadEmails = () => {
    setLoading(true);
    // Mock data - will be replaced with actual API call
    setTimeout(() => {
      setEmails(mockEmails);
      setLoading(false);
    }, 1000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu e-postayı silmek istediğinizden emin misiniz?')) {
      setEmails(emails.filter(email => email.id !== id));
      // Here we'll add actual API call to delete from database
    }
  };

  const exportEmails = () => {
    const emailList = emails.map(e => e.email).join('\n');
    const blob = new Blob([emailList], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emails.txt';
    a.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Admin Paneli</h2>
            <p className="text-gray-400">Giriş yapmak için şifrenizi girin</p>
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all mb-4"
            />
            
            {authError && (
              <div className="mb-4 flex items-center gap-2 text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm">
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all hover:shadow-xl hover:shadow-red-600/30"
            >
              Giriş Yap
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Demo şifre: <code className="text-red-500">admin123</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">E-posta Yönetimi</h1>
              <p className="text-gray-400">Toplanan e-posta adreslerini görüntüleyin ve yönetin</p>
            </div>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPassword('');
              }}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
            >
              Çıkış Yap
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
              <Mail className="w-8 h-8 text-red-500 mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{emails.length}</div>
              <div className="text-gray-400 text-sm">Toplam E-posta</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
              <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{emails.filter(e => e.status === 'active').length}</div>
              <div className="text-gray-400 text-sm">Aktif</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
              <Calendar className="w-8 h-8 text-blue-500 mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                {emails.length > 0 ? new Date(emails[0].date).toLocaleDateString('tr-TR') : '-'}
              </div>
              <div className="text-gray-400 text-sm">Son Kayıt</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={loadEmails}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
          >
            Yenile
          </button>
          <button
            onClick={exportEmails}
            className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
          >
            E-postaları Dışa Aktar
          </button>
        </div>

        {/* Email List */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Yükleniyor...</p>
            </div>
          ) : emails.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Henüz e-posta kaydı yok</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50 border-b border-gray-800">
                  <tr>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold">E-posta</th>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold">Tarih</th>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold">Durum</th>
                    <th className="text-right px-6 py-4 text-gray-400 font-semibold">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.map((email) => (
                    <tr key={email.id} className="border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{email.email}</td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(email.date).toLocaleDateString('tr-TR', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-500 text-sm">
                          <CheckCircle size={14} />
                          {email.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(email.id)}
                          className="text-red-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
