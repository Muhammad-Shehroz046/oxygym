import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  FaArrowLeft, FaDollarSign, FaCalendarAlt, FaUsers, FaCreditCard, FaChartBar
} from 'react-icons/fa';

const PLAN_COLORS = {
  Basic: '#0d9488',
  Premium: '#1e40af',
  Elite: '#f97316'
};
const PIE_COLORS = ['#0d9488', '#1e40af', '#f97316', '#8b5cf6'];

const AdminMemberships = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterBilling, setFilterBilling] = useState('all');

  const config = { headers: { Authorization: `Bearer ${user.token}` } };

  useEffect(() => {
    const load = async () => {
      try {
        const [recRes, statRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/membership-records`, config),
          axios.get(`${API_BASE_URL}/api/membership-records/stats`, config)
        ]);
        setRecords(recRes.data);
        setStats(statRes.data);
      } catch (err) {
        toast.error('Failed to load membership records');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = records.filter(r => {
    const matchSearch =
      r.userName?.toLowerCase().includes(search.toLowerCase()) ||
      r.userEmail?.toLowerCase().includes(search.toLowerCase());
    const matchPlan = filterPlan === 'all' || r.planName === filterPlan;
    const matchBilling = filterBilling === 'all' || r.billingPeriod === filterBilling;
    return matchSearch && matchPlan && matchBilling;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading membership records...</p>
      </div>
    );
  }

  return (
    <div className="memberships-admin-page">
      <div className="container">

        {/* Header */}
        <div className="page-header">
          <div>
            <Link to="/admin/dashboard" className="back-link">
              <FaArrowLeft /> Back to Dashboard
            </Link>
            <h1>Membership Records</h1>
            <p>Track all membership purchases and revenue</p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card green">
              <div className="stat-icon"><FaDollarSign /></div>
              <div>
                <div className="stat-value">${stats.totalRevenue?.toFixed(2)}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </div>
            <div className="stat-card blue">
              <div className="stat-icon"><FaCalendarAlt /></div>
              <div>
                <div className="stat-value">${stats.thisMonthRevenue?.toFixed(2)}</div>
                <div className="stat-label">This Month</div>
              </div>
            </div>
            <div className="stat-card orange">
              <div className="stat-icon"><FaCreditCard /></div>
              <div>
                <div className="stat-value">{stats.totalRecords}</div>
                <div className="stat-label">Total Purchases</div>
              </div>
            </div>
            <div className="stat-card purple">
              <div className="stat-icon"><FaUsers /></div>
              <div>
                <div className="stat-value">
                  ${stats.totalRecords > 0 ? (stats.totalRevenue / stats.totalRecords).toFixed(2) : '0.00'}
                </div>
                <div className="stat-label">Avg per Purchase</div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Row */}
        {stats && (
          <div className="charts-row">
            {/* Monthly Revenue Bar Chart */}
            <div className="chart-card wide">
              <div className="chart-title"><FaChartBar /> Monthly Revenue (Last 12 months)</div>
              {stats.monthly?.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={stats.monthly} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${v}`} />
                    <Tooltip formatter={v => [`$${v.toFixed(2)}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-empty">No data yet</div>
              )}
            </div>

            {/* Plan Revenue Pie Chart */}
            <div className="chart-card">
              <div className="chart-title">Revenue by Plan</div>
              {stats.planBreakdown?.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={stats.planBreakdown}
                      dataKey="revenue"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {stats.planBreakdown.map((entry, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={v => `$${v.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-empty">No data yet</div>
              )}
            </div>

            {/* Monthly Count Line Chart */}
            <div className="chart-card">
              <div className="chart-title">Purchases per Month</div>
              {stats.monthly?.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={stats.monthly} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#f97316' }}
                      name="Purchases"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-empty">No data yet</div>
              )}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="table-card">
          <div className="table-top">
            <h2>All Membership Purchases</h2>
            <div className="filters">
              <input
                type="text"
                placeholder="Search name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="filter-input"
              />
              <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)} className="filter-select">
                <option value="all">All Plans</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="Elite">Elite</option>
              </select>
              <select value={filterBilling} onChange={e => setFilterBilling(e.target.value)} className="filter-select">
                <option value="all">All Billing</option>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
          </div>

          <div className="table-wrapper">
            {filtered.length > 0 ? (
              <table className="records-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Member</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Plan</th>
                    <th>Billing</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, idx) => (
                    <tr key={r._id}>
                      <td className="row-num">{idx + 1}</td>
                      <td className="member-cell">
                        <div className="avatar">{r.userName?.charAt(0).toUpperCase()}</div>
                        <span>{r.userName}</span>
                      </td>
                      <td>{r.userEmail}</td>
                      <td>{r.userPhone || '—'}</td>
                      <td>
                        <span className="plan-badge" style={{ backgroundColor: `${PLAN_COLORS[r.planName] || '#888'}22`, color: PLAN_COLORS[r.planName] || '#888' }}>
                          {r.planName}
                        </span>
                      </td>
                      <td>
                        <span className={`billing-badge ${r.billingPeriod}`}>
                          {r.billingPeriod === 'annual' ? 'Annual' : 'Monthly'}
                        </span>
                      </td>
                      <td className="amount-cell">${Number(r.amount).toFixed(2)}</td>
                      <td>{new Date(r.paidAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      <td>
                        <span className={`status-badge ${r.status}`}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <FaCreditCard className="empty-icon" />
                <p>No membership records found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .memberships-admin-page {
          padding: 3rem 0;
          min-height: calc(100vh - 70px - 400px);
          background: var(--gray-100);
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--gray-600);
          margin-bottom: 0.5rem;
          font-weight: 500;
          text-decoration: none;
        }

        .page-header h1 {
          font-size: 2rem;
          color: var(--accent-color);
          margin: 0 0 0.25rem;
        }

        .page-header p {
          color: var(--gray-500);
          margin: 0;
        }

        /* Stats */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: var(--box-shadow);
          border-left: 4px solid transparent;
        }

        .stat-card.green { border-left-color: #0d9488; }
        .stat-card.blue  { border-left-color: #1e40af; }
        .stat-card.orange{ border-left-color: #f97316; }
        .stat-card.purple{ border-left-color: #7c3aed; }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          color: white;
          flex-shrink: 0;
        }

        .stat-card.green  .stat-icon { background: #0d9488; }
        .stat-card.blue   .stat-icon { background: #1e40af; }
        .stat-card.orange .stat-icon { background: #f97316; }
        .stat-card.purple .stat-icon { background: #7c3aed; }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--dark-color);
          line-height: 1;
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--gray-500);
          margin-top: 0.25rem;
        }

        /* Charts */
        .charts-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 1024px) {
          .charts-row { grid-template-columns: 1fr 1fr; }
          .chart-card.wide { grid-column: 1 / -1; }
        }

        @media (max-width: 640px) {
          .charts-row { grid-template-columns: 1fr; }
        }

        .chart-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: var(--box-shadow);
        }

        .chart-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--gray-700);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .chart-empty {
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gray-400);
          font-size: 0.9rem;
        }

        /* Table Card */
        .table-card {
          background: white;
          border-radius: 12px;
          box-shadow: var(--box-shadow);
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .table-top {
          padding: 1.25rem 1.5rem;
          background: var(--accent-color);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .table-top h2 { margin: 0; font-size: 1.1rem; }

        .filters {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .filter-input,
        .filter-select {
          padding: 0.45rem 0.75rem;
          border-radius: 6px;
          border: none;
          font-size: 0.9rem;
          background: white;
          color: #333;
        }

        .filter-input { min-width: 200px; }

        .table-wrapper { overflow-x: auto; }

        .records-table {
          width: 100%;
          border-collapse: collapse;
        }

        .records-table th,
        .records-table td {
          padding: 0.875rem 1rem;
          text-align: left;
          border-bottom: 1px solid var(--gray-200);
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .records-table th {
          background: var(--gray-100);
          font-weight: 600;
          color: var(--gray-700);
        }

        .records-table tr:hover { background: #fafafa; }
        .records-table tr:last-child td { border-bottom: none; }

        .row-num { color: var(--gray-400); font-size: 0.8rem; }

        .member-cell {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .avatar {
          width: 32px;
          height: 32px;
          background: var(--primary-color);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        .plan-badge {
          display: inline-block;
          padding: 0.2rem 0.7rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .billing-badge {
          display: inline-block;
          padding: 0.2rem 0.7rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 500;
        }

        .billing-badge.monthly {
          background: rgba(30, 64, 175, 0.1);
          color: #1e40af;
        }

        .billing-badge.annual {
          background: rgba(124, 58, 237, 0.1);
          color: #7c3aed;
        }

        .amount-cell {
          font-weight: 700;
          color: #0d9488;
        }

        .status-badge {
          display: inline-block;
          padding: 0.2rem 0.7rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .status-badge.succeeded {
          background: rgba(34, 197, 94, 0.1);
          color: var(--success-color);
        }

        .status-badge.failed {
          background: rgba(239, 68, 68, 0.1);
          color: var(--danger-color);
        }

        .status-badge.pending {
          background: rgba(245, 158, 11, 0.1);
          color: var(--warning-color);
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--gray-400);
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.4;
        }
      `}</style>
    </div>
  );
};

export default AdminMemberships;
