import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect based on user role
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'trainer') {
        navigate('/trainer/dashboard');
      } else {
        // For normal users
        if (!user.isProfileComplete) {
          navigate('/user/select-trainer');
        } else {
          navigate('/user/dashboard');
        }
      }
    }
  }, [user, navigate]);
  
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Redirecting to your dashboard...</p>
      <style jsx>{`
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
          border-top: 5px solid var(--primary-color);
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

export default Dashboard;