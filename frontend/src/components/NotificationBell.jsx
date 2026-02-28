import React, { useState, useEffect } from 'react';
import { Bell, Check, X, CheckCheck } from 'lucide-react';
import { notificationAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const loadNotifications = async () => {
    try {
      const data = await notificationAPI.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  useEffect(() => {
    loadNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      await notificationAPI.markAllAsRead();
      await loadNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'border-green-500/30 bg-green-500/10';
      case 'error': return 'border-red-500/30 bg-red-500/10';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
      default: return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-300 hover:text-red-500 transition-colors"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-96 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-white font-bold">
                {language === 'tr' ? 'Bildirimler' : 'Notifications'} ({unreadCount})
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={loading}
                  className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1"
                >
                  <CheckCheck size={14} />
                  {language === 'tr' ? 'Tümünü Okundu İşaretle' : 'Mark All Read'}
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>{language === 'tr' ? 'Bildirim yok' : 'No notifications'}</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                      !notif.read ? 'bg-gray-800/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-1 ${getNotificationColor(notif.type)} border rounded-lg p-3`}>
                        <h4 className="text-white font-semibold text-sm mb-1">{notif.title}</h4>
                        <p className="text-gray-400 text-xs">{notif.message}</p>
                        <p className="text-gray-600 text-xs mt-2">
                          {new Date(notif.created_at).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        {!notif.read && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="p-1 text-green-500 hover:bg-green-500/10 rounded transition-colors"
                            title={language === 'tr' ? 'Okundu işaretle' : 'Mark as read'}
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          title={language === 'tr' ? 'Sil' : 'Delete'}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
