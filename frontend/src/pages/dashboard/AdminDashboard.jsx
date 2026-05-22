import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';
import { FaUsers, FaUserTie, FaUserShield, FaClipboardList, FaEdit, FaTrash, FaSearch, FaCheck, FaTimes, FaClock, FaCreditCard } from 'react-icons/fa';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrainers: 0,
    totalMembers: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${API_BASE_URL}/api/admin/pending`, config);
        setPendingUsers(data);
      } catch (error) {
        console.error('Error fetching pending users:', error);
      } finally {
        setPendingLoading(false);
      }
    };
    fetchPendingUsers();
  }, [user.token]);

  const handleApprove = async (userId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${API_BASE_URL}/api/admin/users/${userId}`, { isApproved: true }, config);
      setPendingUsers(pendingUsers.filter(u => u._id !== userId));
      toast.success('User approved successfully');
    } catch (error) {
      toast.error('Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    if (window.confirm('Are you sure you want to reject and delete this registration?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`${API_BASE_URL}/api/admin/users/${userId}`, config);
        setPendingUsers(pendingUsers.filter(u => u._id !== userId));
        toast.success('User rejected and removed');
      } catch (error) {
        toast.error('Failed to reject user');
      }
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        
        const { data } = await axios.get(`${API_BASE_URL}/api/admin/users`, config);
        setUsers(data);
        
        // Calculate stats
        const trainers = data.filter(u => u.role === 'trainer').length;
        const members = data.filter(u => u.role === 'user').length;
        
        setStats({
          totalUsers: data.length,
          totalTrainers: trainers,
          totalMembers: members
        });
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [user.token]);
  
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        
        await axios.delete(`${API_BASE_URL}/api/admin/users/${userId}`, config);
        
        // Update local state
        setUsers(users.filter(u => u._id !== userId));
        
        // Update stats
        const deletedUser = users.find(u => u._id === userId);
        if (deletedUser) {
          setStats({
            ...stats,
            totalUsers: stats.totalUsers - 1,
            totalTrainers: deletedUser.role === 'trainer' ? stats.totalTrainers - 1 : stats.totalTrainers,
            totalMembers: deletedUser.role === 'user' ? stats.totalMembers - 1 : stats.totalMembers
          });
        }
        
        toast.success('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };
  
  // Filter users based on search term and role filter
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-welcome-banner">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user.name}. Manage your gym users and data</p>
        </div>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon users">
              <FaUsers />
            </div>
            <div className="stat-info">
              <h3 className="stat-number">{stats.totalUsers}</h3>
              <p className="stat-label">Total Users</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon members">
              <FaUserShield />
            </div>
            <div className="stat-info">
              <h3 className="stat-number">{stats.totalMembers}</h3>
              <p className="stat-label">Members</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon trainers">
              <FaUserTie />
            </div>
            <div className="stat-info">
              <h3 className="stat-number">{stats.totalTrainers}</h3>
              <p className="stat-label">Trainers</p>
            </div>
          </div>
        </div>
        
        <div className="admin-actions">
          <Link to="/admin/users" className="btn btn-primary">
            <FaClipboardList /> Manage Users
          </Link>
          <Link to="/admin/memberships" className="btn btn-accent">
            <FaCreditCard /> Membership Records
          </Link>
        </div>

        {/* Pending Approvals Section */}
        <div className="pending-section">
          <div className="pending-header">
            <h2><FaClock /> Pending Approvals {pendingUsers.length > 0 && <span className="pending-badge">{pendingUsers.length}</span>}</h2>
          </div>
          {pendingLoading ? (
            <p className="pending-loading">Loading pending requests...</p>
          ) : pendingUsers.length === 0 ? (
            <p className="pending-empty">No pending registration requests.</p>
          ) : (
            <div className="pending-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>
                        <span className={`role-badge ${u.role}`}>
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon approve"
                            onClick={() => handleApprove(u._id)}
                            title="Approve"
                          >
                            <FaCheck />
                          </button>
                          <button
                            className="btn-icon reject"
                            onClick={() => handleReject(u._id)}
                            title="Reject"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="users-table-container">
          <div className="table-header">
            <h2>Users Management</h2>
            
            <div className="table-actions">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="role-filter">
                <select 
                  value={filterRole} 
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Members</option>
                  <option value="trainer">Trainers</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Profile Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role}`}>
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                      </td>
                      <td>
                        {u.isProfileComplete ? (
                          <span className="status-badge complete">Complete</span>
                        ) : (
                          <span className="status-badge incomplete">Incomplete</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link 
                            to={`/admin/users/${u._id}/edit`} 
                            className="btn-icon edit"
                            title="Edit User"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            className="btn-icon delete"
                            onClick={() => handleDeleteUser(u._id)}
                            title="Delete User"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-results">
                      No users found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style jsx>{`
        .admin-dashboard {
          padding: 3rem 0;
          min-height: calc(100vh - 70px - 400px);
        }
        
        .admin-welcome-banner {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        
        .admin-welcome-banner h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: var(--accent-color);
        }
        
        .admin-welcome-banner p {
          font-size: 1.2rem;
          color: var(--gray-600);
        }
        
        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        
        .stat-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: var(--box-shadow);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
        }
        
        .stat-icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 1.5rem;
          color: white;
        }
        
        .stat-icon.users {
          background-color: var(--accent-color);
        }
        
        .stat-icon.members {
          background-color: var(--primary-color);
        }
        
        .stat-icon.trainers {
          background-color: var(--secondary-color);
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          color: var(--dark-color);
        }
        
        .admin-actions {
          margin-bottom: 2rem;
          display: flex;
          gap: 1rem;
        }
        
        .admin-actions .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
        }
        
        .users-table-container {
          background-color: white;
          border-radius: 8px;
          box-shadow: var(--box-shadow);
          overflow: hidden;
        }
        
        .table-header {
          padding: 1.25rem 1.5rem;
          background-color: var(--accent-color);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .table-header h2 {
          font-size: 1.2rem;
          margin: 0;
        }
        
        .table-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .search-box {
          position: relative;
        }
        
        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-500);
        }
        
        .search-input {
          padding: 0.5rem 0.5rem 0.5rem 2rem;
          border-radius: 4px;
          border: none;
          font-size: 0.9rem;
          min-width: 200px;
        }
        
        .filter-select {
          padding: 0.5rem;
          border-radius: 4px;
          border: none;
          font-size: 0.9rem;
        }
        
        .users-table-wrapper {
          overflow-x: auto;
        }
        
        .users-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .users-table th,
        .users-table td {
          padding: 1rem 1.5rem;
          text-align: left;
          border-bottom: 1px solid var(--gray-200);
        }
        
        .users-table th {
          font-weight: 600;
          color: var(--gray-700);
          background-color: var(--gray-100);
        }
        
        .users-table tr:last-child td {
          border-bottom: none;
        }
        
        .role-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .role-badge.user {
          background-color: rgba(13, 148, 136, 0.1);
          color: var(--primary-dark);
        }
        
        .role-badge.trainer {
          background-color: rgba(30, 64, 175, 0.1);
          color: var(--secondary-dark);
        }
        
        .role-badge.admin {
          background-color: rgba(249, 115, 22, 0.1);
          color: var(--accent-color);
        }
        
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .status-badge.complete {
          background-color: rgba(34, 197, 94, 0.1);
          color: var(--success-color);
        }
        
        .status-badge.incomplete {
          background-color: rgba(245, 158, 11, 0.1);
          color: var(--warning-color);
        }
        
        .action-buttons {
          display: flex;
          gap: 0.75rem;
        }
        
        .btn-icon {
          width: 34px;
          height: 34px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          color: white;
        }
        
        .btn-icon.edit {
          background-color: var(--primary-color);
        }
        
        .btn-icon.edit:hover {
          background-color: var(--primary-dark);
        }
        
        .btn-icon.delete {
          background-color: var(--danger-color);
        }
        
        .btn-icon.delete:hover {
          background-color: #dc2626;
        }
        
        .no-results {
          text-align: center;
          padding: 2rem;
          color: var(--gray-500);
        }

        .pending-section {
          background-color: white;
          border-radius: 8px;
          box-shadow: var(--box-shadow);
          margin-bottom: 2rem;
          overflow: hidden;
        }

        .pending-header {
          padding: 1.25rem 1.5rem;
          background-color: #7c3aed;
          color: white;
        }

        .pending-header h2 {
          font-size: 1.2rem;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pending-badge {
          background-color: #ef4444;
          color: white;
          border-radius: 999px;
          padding: 0.1rem 0.6rem;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .pending-loading,
        .pending-empty {
          padding: 1.5rem;
          color: var(--gray-500);
          text-align: center;
        }

        .pending-table-wrapper {
          overflow-x: auto;
        }

        .btn-icon.approve {
          background-color: var(--success-color);
        }

        .btn-icon.approve:hover {
          background-color: #16a34a;
        }

        .btn-icon.reject {
          background-color: var(--danger-color);
        }

        .btn-icon.reject:hover {
          background-color: #dc2626;
        }
        
        @media (max-width: 768px) {
          .table-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .table-actions {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
          }
          
          .search-box, .filter-select, .search-input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;