import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Mail, ShoppingBag, BarChart3, Ban, Trash2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../translations';
import { adminAPI, emailAPI } from '../services/api';
import Navbar from '../components/Navbar';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [emails, setEmails] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/');
    } else {
      loadData();
    }
  }, [user, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, emailsData, requestsData] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllUsers(),
        emailAPI.getAllEmails(),
        adminAPI.getPurchaseRequests()
      ]);
      setStats(statsData);
      setUsers(usersData);
      setEmails(emailsData);
      setRequests(requestsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, currentStatus) => {
    if (!window.confirm(t('admin.users.confirmBan'))) return;
    
    try {
      if (currentStatus === 'banned') {
        await adminAPI.unbanUser(userId);
      } else {
        await adminAPI.banUser(userId);
      }
      await loadData();
    } catch (error) {
      alert(error.response?.data?.detail || 'Error updating user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm(t('admin.users.confirmDelete'))) return;
    
    try {
      await adminAPI.deleteUser(userId);
      await loadData();
    } catch (error) {
      alert(error.response?.data?.detail || 'Error deleting user');
    }
  };

  const handleDeleteEmail = async (emailId) => {
    if (!window.confirm('Delete this email?')) return;
    
    try {
      await adminAPI.deleteEmail(emailId);
      await loadData();
    } catch (error) {
      alert(error.response?.data?.detail || 'Error deleting email');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors mb-6"
            >
              <ArrowLeft size={20} />
              {language === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}
            </button>
            
            <h1 className="text-4xl font-bold text-white mb-2">{t('admin.title')}</h1>
            <p className="text-gray-400">{t('admin.subtitle')}</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-800 overflow-x-auto">
            {['overview', 'users', 'emails', 'requests'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'requests' 
                  ? (language === 'tr' ? 'Satın Alma Talepleri' : 'Purchase Requests')
                  : t(`admin.tabs.${tab}`)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading...</p>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard icon={<Users />} label={t('admin.stats.totalUsers')} value={stats.total_users} color="blue" />
                  <StatCard icon={<CheckCircle />} label={t('admin.stats.activeUsers')} value={stats.active_users} color="green" />
                  <StatCard icon={<Mail />} label={t('admin.stats.totalEmails')} value={stats.total_emails} color="purple" />
                  <StatCard icon={<ShoppingBag />} label={t('admin.stats.totalRevenue')} value={stats.total_revenue} color="red" />
                  <StatCard icon={<Ban />} label={language === 'tr' ? 'Yasaklı Kullanıcı' : 'Banned Users'} value={stats.banned_users} color="red" />
                  <StatCard icon={<BarChart3 />} label={t('admin.stats.todayRegistrations')} value={stats.today_registrations} color="green" />
                  <StatCard icon={<ShoppingBag />} label={language === 'tr' ? 'Bekleyen Talepler' : 'Pending Requests'} value={stats.pending_purchase_requests} color="yellow" />
                  <StatCard icon={<Users />} label={language === 'tr' ? 'Bu Hafta Yeni' : 'New This Week'} value={stats.new_users_this_week} color="blue" />
                </div>
              )}

              {/* Purchase Requests Tab */}
              {activeTab === 'requests' && (
                <>
                  {/* Bulk Actions */}
                  {requests.length > 0 && (
                    <div className="mb-4 flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedRequests.length === requests.length && requests.length > 0}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-red-600 focus:ring-red-600"
                          />
                          <span className="text-sm">
                            {language === 'tr' ? 'Tümünü Seç' : 'Select All'} ({selectedRequests.length})
                          </span>
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedRequests.length > 0 && (
                          <button
                            onClick={handleBulkDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                          >
                            {language === 'tr' ? `Seçilenleri Sil (${selectedRequests.length})` : `Delete Selected (${selectedRequests.length})`}
                          </button>
                        )}
                        <button
                          onClick={handleClearProcessed}
                          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-semibold"
                        >
                          {language === 'tr' ? 'İşlenenleri Temizle' : 'Clear Processed'}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-900/50 border-b border-gray-800">
                          <tr>
                            <th className="text-left px-6 py-4 text-gray-400 font-semibold w-12"></th>
                            <th className="text-left px-6 py-4 text-gray-400 font-semibold">Email</th>
                            <th className="text-left px-6 py-4 text-gray-400 font-semibold">Discord</th>
                            <th className="text-left px-6 py-4 text-gray-400 font-semibold">{language === 'tr' ? 'Ürün' : 'Product'}</th>
                            <th className="text-left px-6 py-4 text-gray-400 font-semibold">{language === 'tr' ? 'Mesaj' : 'Message'}</th>
                            <th className="text-left px-6 py-4 text-gray-400 font-semibold">{language === 'tr' ? 'Durum' : 'Status'}</th>
                            <th className="text-right px-6 py-4 text-gray-400 font-semibold">{language === 'tr' ? 'İşlemler' : 'Actions'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requests.map((req) => (
                            <tr key={req.id} className="border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors">
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  checked={selectedRequests.includes(req.id)}
                                  onChange={() => toggleSelectRequest(req.id)}
                                  className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-red-600 focus:ring-red-600"
                                />
                              </td>
                              <td className="px-6 py-4 text-white">{req.email}</td>
                              <td className="px-6 py-4 text-gray-400">{req.discord_username}</td>
                              <td className="px-6 py-4 text-gray-400">{req.product}</td>
                              <td className="px-6 py-4 text-gray-400 max-w-xs truncate" title={req.message || 'N/A'}>
                                {req.message || '-'}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                                  req.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                  req.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                  'bg-yellow-500/10 text-yellow-500'
                                }`}>
                                  {req.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {req.status === 'pending' && (
                                    <>
                                      <button
                                        onClick={() => handleRequestAction(req.id, 'approved')}
                                        className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                                        title={language === 'tr' ? 'Onayla' : 'Approve'}
                                      >
                                        <CheckCircle size={18} />
                                      </button>
                                      <button
                                        onClick={() => handleRequestAction(req.id, 'rejected')}
                                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title={language === 'tr' ? 'Reddet' : 'Reject'}
                                      >
                                        <Ban size={18} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-900/50 border-b border-gray-800">
                        <tr>
                          <th className="text-left px-6 py-4 text-gray-400 font-semibold">{t('admin.users.columns.name')}</th>
                          <th className="text-left px-6 py-4 text-gray-400 font-semibold">{t('admin.users.columns.email')}</th>
                          <th className="text-left px-6 py-4 text-gray-400 font-semibold">{language === 'tr' ? 'Rol' : 'Role'}</th>
                          <th className="text-left px-6 py-4 text-gray-400 font-semibold">{t('admin.users.columns.status')}</th>
                          <th className="text-right px-6 py-4 text-gray-400 font-semibold">{t('admin.users.columns.actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors">
                            <td className="px-6 py-4 text-white">{user.name}</td>
                            <td className="px-6 py-4 text-gray-400">{user.email}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                                user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                                user.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {user.role !== 'admin' && (
                                  <>
                                    <button
                                      onClick={() => handleBanUser(user.id, user.status)}
                                      className={`p-2 rounded-lg transition-colors ${
                                        user.status === 'banned'
                                          ? 'text-green-500 hover:bg-green-500/10'
                                          : 'text-yellow-500 hover:bg-yellow-500/10'
                                      }`}
                                      title={user.status === 'banned' ? t('admin.users.actions.unban') : t('admin.users.actions.ban')}
                                    >
                                      <Ban size={18} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                      title={t('admin.users.actions.delete')}
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Emails Tab */}
              {activeTab === 'emails' && (
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-900/50 border-b border-gray-800">
                        <tr>
                          <th className="text-left px-6 py-4 text-gray-400 font-semibold">{t('admin.emails.columns.email')}</th>
                          <th className="text-left px-6 py-4 text-gray-400 font-semibold">{t('admin.emails.columns.date')}</th>
                          <th className="text-right px-6 py-4 text-gray-400 font-semibold">{t('admin.emails.columns.actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emails.map((email) => (
                          <tr key={email.id} className="border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors">
                            <td className="px-6 py-4 text-white">{email.email}</td>
                            <td className="px-6 py-4 text-gray-400">
                              {new Date(email.created_at).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleDeleteEmail(email.id)}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    red: 'from-red-600 to-red-700',
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-red-600/50 transition-all">
      <div className={`inline-flex p-3 bg-gradient-to-br ${colorClasses[color]} rounded-lg mb-4`}>
        {React.cloneElement(icon, { className: 'w-6 h-6 text-white' })}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
};

export default AdminPanel;

  const handleRequestAction = async (requestId, action) => {
    try {
      await adminAPI.updateRequestStatus(requestId, action);
      await loadData();
      setSelectedRequests([]);
    } catch (error) {
      alert(error.response?.data?.detail || 'Error updating request');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRequests.length === 0) return;
    
    if (!window.confirm(`${selectedRequests.length} talebi silmek istediğinizden emin misiniz?`)) return;
    
    try {
      await Promise.all(
        selectedRequests.map(id => adminAPI.deleteRequest(id))
      );
      await loadData();
      setSelectedRequests([]);
    } catch (error) {
      alert('Silme işlemi sırasında hata oluştu');
    }
  };

  const handleClearProcessed = async () => {
    if (!requests || requests.length === 0) {
      alert(language === 'tr' ? 'Temizlenecek talep yok' : 'No requests to clear');
      return;
    }
    
    const processedRequests = requests.filter(r => r.status !== 'pending');
    if (processedRequests.length === 0) {
      alert(language === 'tr' ? 'Temizlenecek işlenmiş talep yok' : 'No processed requests to clear');
      return;
    }
    
    if (!window.confirm(`${processedRequests.length} ${language === 'tr' ? 'işlenmiş talebi temizlemek istediğinizden emin misiniz?' : 'processed requests will be deleted. Are you sure?'}`)) return;
    
    try {
      await Promise.all(
        processedRequests.map(r => adminAPI.deleteRequest(r.id))
      );
      await loadData();
      setSelectedRequests([]);
    } catch (error) {
      alert(language === 'tr' ? 'Temizleme işlemi sırasında hata oluştu' : 'Error during cleanup operation');
    }
  };

  const toggleSelectAll = () => {
    if (!requests || requests.length === 0) return;
    
    if (selectedRequests.length === requests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(requests.map(r => r.id));
    }
  };

  const toggleSelectRequest = (id) => {
    if (selectedRequests.includes(id)) {
      setSelectedRequests(selectedRequests.filter(rid => rid !== id));
    } else {
      setSelectedRequests([...selectedRequests, id]);
    }
  };
