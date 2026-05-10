import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaArrowLeft } from 'react-icons/fa';

const UsersList = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  useEffect(() => {
    fetchUsers();
  }, [user.token]);
  
  const fetchUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/users`, config);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };
  
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
        <p>Loading users...</p>
      </div>
    );
  }
  
  return (
    <div className="users-list-page">
      <div className="container">
        <div className="page-header">
          <div className="page-title">
            <Link to="/admin/dashboard" className="back-link">
              <FaArrowLeft /> Back to Dashboard
            </Link>
            <h1>Users Management</h1>
          </div>
          
          <Link to="/register/admin" className="btn btn-primary">
            <FaPlus /> Add User
          </Link>
        </div>
        
        <div className="users-filters">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-box">
            <FaFilter className="filter-icon" />
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
        
        <div className="users-table-container">
          {filteredUsers.length > 0 ? (
            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Profile Status</th>
                    <th>Date Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id}>
                      <td className="user-name-cell">
                        <div className="user-avatar">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{u.name}</span>
                      </td>
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
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
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
                            disabled={u._id === user._id} // Prevent self-deletion
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-results">
              <p>No users found matching your criteria</p>
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setSearchTerm('');
                  setFilterRole('all');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .users-list-page {
          padding: 3rem 0;
          min-height: calc(100vh - 70px - 400px);
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .back-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--gray-600);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .page-header h1 {
          font-size: 2rem;
          margin: 0;
          color: var(--accent-color);
        }
        
        .users-filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        
        .search-box {
          flex: 1;
          min-width: 300px;
          position: relative;
        }
        
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-500);
        }
        
        .search-input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border-radius: 8px;
          border: 1px solid var(--gray-300);
          font-size: 1rem;
        }
        
        .filter-box {
          position: relative;
          min-width: 200px;
        }
        
        .filter-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-500);
        }
        
        .filter-select {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border-radius: 8px;
          border: 1px solid var(--gray-300);
          font-size: 1rem;
          appearance: none;
          background-color: white;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
          background-position: right 1rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
        }
        
        .users-table-container {
          background-color: white;
          border-radius: 8px;
          box-shadow: var(--box-shadow);
          overflow: hidden;
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
        
        .users-table tr:hover {
          background-color: var(--gray-50);
        }
        
        .users-table tr:last-child td {
          border-bottom: none;
        }
        
        .user-name-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .user-avatar {
          width: 36px;
          height: 36px;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 1rem;
          font-weight: 600;
        }
        
        .role-badge,
        .status-badge {
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
        
        .btn-icon.delete:hover:not(:disabled) {
          background-color: #dc2626;
        }
        
        .btn-icon:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .no-results {
          text-align: center;
          padding: 3rem;
        }
      `}</style>
    </div>
  );
};

export default UsersList;