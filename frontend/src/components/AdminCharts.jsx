import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts';

const COLORS = ['#EAB308', '#3B82F6', '#22C55E', '#EF4444', '#6B7280'];

const ChartCard = ({ title, children }) => (
  <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
    <h3 className="text-white font-semibold text-lg mb-4">{title}</h3>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-white text-sm font-semibold">
          {entry.name}: {typeof entry.value === 'number' && entry.name?.toLowerCase().includes('gelir') ? `$${entry.value.toFixed(2)}` : entry.value}
        </p>
      ))}
    </div>
  );
};

const AdminCharts = ({ analytics, language }) => {
  if (!analytics) return null;

  const tr = language === 'tr';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Daily Revenue */}
      <ChartCard title={tr ? 'Günlük Gelir (Son 14 Gün)' : 'Daily Revenue (Last 14 Days)'}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={analytics.daily_revenue}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DC143C" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#DC143C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" name={tr ? 'Gelir' : 'Revenue'} stroke="#DC143C" fill="url(#revenueGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Daily Registrations */}
      <ChartCard title={tr ? 'Günlük Kayıtlar (Son 14 Gün)' : 'Daily Registrations (Last 14 Days)'}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={analytics.daily_registrations}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name={tr ? 'Kayıt' : 'Registrations'} fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Monthly Revenue */}
      <ChartCard title={tr ? 'Aylık Gelir (Son 6 Ay)' : 'Monthly Revenue (Last 6 Months)'}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={analytics.monthly_revenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="revenue" name={tr ? 'Gelir' : 'Revenue'} stroke="#22C55E" strokeWidth={2} dot={{ fill: '#22C55E', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Request Status Distribution */}
      <ChartCard title={tr ? 'Talep Durumu Dağılımı' : 'Request Status Distribution'}>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={analytics.status_distribution?.filter(d => d.value > 0) || []}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {(analytics.status_distribution || []).filter(d => d.value > 0).map((entry, index) => (
                <Cell key={index} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Product Popularity */}
      {analytics.product_distribution?.length > 0 && (
        <ChartCard title={tr ? 'Ürün Popülerliği' : 'Product Popularity'}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analytics.product_distribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 10 }} width={130} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name={tr ? 'Talep' : 'Requests'} fill="#DC143C" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
};

export default AdminCharts;
