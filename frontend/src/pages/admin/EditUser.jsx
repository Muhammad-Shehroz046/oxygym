import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';
import { FaUser, FaEnvelope, FaUserTag, FaToggleOn, FaToggleOff, FaArrowLeft, FaSave } from 'react-icons/fa';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    isProfileComplete: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        
        const { data } = await axios.get(`${API_BASE_URL}/api/admin/users/${id}`, config);
        
        setFormData({
          name: data.name,
          email: data.email,
          role: data.role,
          isProfileComplete: data.isProfileComplete
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to fetch user data');
        navigate('/admin/users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [id, user.token, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleToggleProfileStatus = () => {
    setFormData(prev => ({ 
      ...prev, 
      isProfileComplete: !prev.isProfileComplete 
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      
      await axios.put(
        `${API_BASE_URL}/api/admin/users/${id}`, 
        formData,
        config
      );
      
      toast.success('User updated successfully');
      navigate('/admin/users');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading user data...</p>
      </div>
    );
  }
  
  return (
    <div className="edit-user-page">
      <div className="container">
        <div className="page-header">
          <Link to="/admin/users" className="back-link">
            <FaArrowLeft /> Back to Users
          </Link>
          <h1>Edit User</h1>
        </div>
        
        <div className="edit-form-card">
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <FaUser className="form-icon" /> Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <FaEnvelope className="form-icon" /> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="role" className="form-label">
                <FaUserTag className="form-icon" /> Role
              </label>
              <select
                id="role"
                name="role"
                className="form-control"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="user">Member</option>
                <option value="trainer">Trainer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="form-group toggle-group">
              <span className="form-label">
                {formData.isProfileComplete ? <FaToggleOn className="toggle-icon on" /> : <FaToggleOff className="toggle-icon off" />}
                Profile Status
              </span>
              <button
                type="button"
                className={`toggle-button ${formData.isProfileComplete ? 'complete' : 'incomplete'}`}
                onClick={handleToggleProfileStatus}
              >
                {formData.isProfileComplete ? 'Profile Complete' : 'Profile Incomplete'}
              </button>
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/users')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <FaSave className="button-icon" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <style jsx>{`
        .edit-user-page {
          padding: 3rem 0;
          min-height: calc(100vh - 70px - 400px);
        }
        
        .page-header {
          margin-bottom: 2rem;
        }
        
        .back-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--gray-600);
          margin-bottom: 0.75rem;
          font-weight: 500;
        }
        
        .page-header h1 {
          font-size: 2rem;
          color: var(--accent-color);
        }
        
        .edit-form-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: var(--box-shadow);
          overflow: hidden;
          max-width: 700px;
        }
        
        .edit-form {
          padding: 2rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .form-icon {
          color: var(--accent-color);
        }
        
        .form-control {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid var(--gray-300);
          border-radius: 4px;
          transition: border-color 0.3s ease;
        }
        
        .form-control:focus {
          border-color: var(--accent-color);
          outline: none;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }
        
        .toggle-group {
          display: flex;
          flex-direction: column;
        }
        
        .toggle-icon {
          font-size: 1.25rem;
        }
        
        .toggle-icon.on {
          color: var(--success-color);
        }
        
        .toggle-icon.off {
          color: var(--gray-500);
        }
        
        .toggle-button {
          display: inline-block;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
        }
        
        .toggle-button.complete {
          background-color: rgba(34, 197, 94, 0.1);
          color: var(--success-color);
        }
        
        .toggle-button.incomplete {
          background-color: rgba(245, 158, 11, 0.1);
          color: var(--warning-color);
        }
        
        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .button-icon {
          margin-right: 0.5rem;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 70px - 400px);
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid var(--gray-200);
          border-top: 5px solid var(--accent-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EditUser;