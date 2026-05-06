import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaLock, FaDumbbell } from 'react-icons/fa';

const Login = () => {
  useEffect(()=>{
    let token = JSON.parse(localStorage.getItem('user'))
    if(token){
      if(token.role == 'trainer'){
        navigate('/trainer/dashboard')
      }
      else if(token.role == 'user') {
        navigate('/user/dashboard')
      }
    };

  },[])
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return toast.error('Please fill in all fields');
    }
    
    try {
      setLoading(true);
      const userData = await login(email, password);
      
      toast.success('Login successful!');
      
      // Redirect based on role
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (userData.role === 'trainer') {
        navigate('/trainer/dashboard');
      } else {
        // If user hasn't completed profile and selected a trainer
        if (!userData.isProfileComplete) {
          navigate('/user/select-trainer');
        } else {
          navigate('/user/dashboard');
        }
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FaDumbbell className="auth-logo" />
          <h2>Login to OxyGym</h2>
          <p>Welcome back! Please login to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <FaUser className="input-icon" /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <FaLock className="input-icon" /> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </p>
        </div>
      </div>
      <style jsx>{`
        .auth-container {
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background: linear-gradient(135deg, var(--dark-color) 0%, var(--gray-800) 100%);
        }
        
        .auth-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 450px;
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        
        .auth-header {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
          color: white;
          padding: 2rem;
          text-align: center;
          position: relative;
        }
        
        .auth-logo {
          font-size: 3rem;
          margin-bottom: 1rem;
          animation: pulse 2s infinite;
        }
        
        .auth-header h2 {
          margin-bottom: 0.5rem;
        }
        
        .auth-form {
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
        
        .input-icon {
          color: var(--primary-color);
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
          border-color: var(--primary-color);
          outline: none;
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
        }
        
        .btn-block {
          width: 100%;
          padding: 0.75rem;
          margin-top: 1rem;
          font-size: 1rem;
          font-weight: 600;
        }
        
        .auth-footer {
          padding: 1.5rem 2rem;
          text-align: center;
          background-color: var(--gray-100);
          border-top: 1px solid var(--gray-200);
        }
        
        .auth-link {
          color: var(--primary-color);
          font-weight: 600;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;