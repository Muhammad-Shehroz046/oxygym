import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';
import { FaUsers, FaUserCircle, FaClipboardList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import WorkoutPlanModal from './WorkoutPlanModal';
import DietPlanModal from './DietPlanModal';


const TrainerDashboard = () => {
  const { user } = useAuth();
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memberPlans, setMemberPlans] = useState({});
  const [showDietModal, setShowDietModal] = useState(false);



  const Navigate = useNavigate();

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };

        const { data } = await axios.get(`${API_BASE_URL}/api/trainers/assigned-users`, config);
        setAssignedUsers(data);
      } catch (error) {
        console.error('Error fetching assigned users:', error);
        toast.error('Failed to fetch assigned users');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedUsers();
  }, [user.token]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };


  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="trainer-dashboard">
      <div className="container">
        <div className="welcome-banner">
          <h1>Welcome, Trainer {user.name}</h1>
          <p>Manage your assigned clients and training programs</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-info">
              <h3 className="stat-number">{assignedUsers.length}</h3>
              <p className="stat-label">Total Clients</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaClipboardList />
            </div>
            <div className="stat-info">
              <h3 className="stat-number">0</h3>
              <p className="stat-label">Active Programs</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-section users-list-section">
            <div className="section-header">
              <h2>Your Clients</h2>
            </div>

            {assignedUsers.length === 0 ? (
              <div className="no-users-message">
                <FaUsers className="icon" />
                <h3>No clients assigned yet</h3>
                <p>When members select you as their trainer, they will appear here</p>
              </div>
            ) : (
              <div className="users-list">
                {assignedUsers.map((assignedUser) => (
                  <div
                    key={assignedUser._id}
                    className={`user-card ${selectedUser && selectedUser._id === assignedUser._id ? 'selected' : ''}`}
                    onClick={() => handleUserSelect(assignedUser)}
                  >
                    <div className="user-avatar">
                      {assignedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <h3>{assignedUser.name}</h3>
                      <p>{assignedUser.email}</p>
                      <p className="status">
                        <span className="status-dot active"></span>
                        Active Member
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-section user-details-section">
            <div className="section-header">
              <h2>Client Details</h2>
            </div>

            {selectedUser ? (
              <div className="user-details-card">
                <div className="user-details-header">
                  <div className="user-avatar large">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <h3>{selectedUser.name}</h3>
                    <p>{selectedUser.email}</p>
                  </div>
                </div>

                <div className="user-stats">
                  <div className="user-stat">
                    <span className="stat-label">Age:</span>
                    <span className="stat-value">{selectedUser.profileDetails?.age || 'N/A'}</span>
                  </div>
                  <div className="user-stat">
                    <span className="stat-label">Height:</span>
                    <span className="stat-value">{selectedUser.profileDetails?.height ? `${selectedUser.profileDetails.height} cm` : 'N/A'}</span>
                  </div>
                  <div className="user-stat">
                    <span className="stat-label">Weight:</span>
                    <span className="stat-value">{selectedUser.profileDetails?.weight ? `${selectedUser.profileDetails.weight} kg` : 'N/A'}</span>
                  </div>
                  <div className="user-stat">
                    <span className="stat-label">Fitness Goal:</span>
                    <span className="stat-value">{selectedUser.profileDetails?.fitnessGoal || 'N/A'}</span>
                  </div>
                </div>

                <div className="user-medical-conditions">
                  <h4>Medical Conditions:</h4>
                  {selectedUser.profileDetails?.medicalConditions &&
                    selectedUser.profileDetails.medicalConditions.length > 0 ? (
                    <ul>
                      {selectedUser.profileDetails.medicalConditions.map((condition, index) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No medical conditions reported</p>
                  )}
                </div>

                <div className="user-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                  >
                    Create Workout Plan
                  </button>

                  <button
                    className="btn btn-outline"
                    onClick={() => setShowDietModal(true)}
                  >
                    Create Diet Plan
                  </button>

                </div>

                {showModal && (
                  <WorkoutPlanModal
                    mode="trainer"
                    onClose={() => setShowModal(false)}
                    targetUserEmail={selectedUser.email}
                  // category={selectedUser.category}
                  />)}
                {showDietModal && (
                  <DietPlanModal
                    memberId={selectedUser._id}
                    category={selectedUser.profileDetails?.fitnessGoal || "General"}
                    onClose={() => setShowDietModal(false)}
                  />
                )}


              </div>
            ) : (
              <div className="no-user-selected">
                <FaUserCircle className="icon" />
                <h3>No Client Selected</h3>
                <p>Select a client from the list to view their details</p>
              </div>
            )}
          </div>
        </div>
      </div>
     <style jsx>{`
        .trainer-dashboard {
          padding: 3rem 0;
          min-height: calc(100vh - 70px - 400px);
        }
        .welcome-banner {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .welcome-banner h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: var(--secondary-dark);
        }
        .welcome-banner p {
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
        }
        .stat-icon {
          width: 60px;
          height: 60px;
          background-color: rgba(21, 128, 61, 0.1);
          color: var(--secondary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 1.5rem;
        }
        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          color: var(--dark-color);
        }
        .stat-label {
          color: var(--gray-600);
          font-size: 0.9rem;
        }
        .dashboard-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1.5rem;
        }
        .dashboard-section {
          background-color: white;
          border-radius: 8px;
          box-shadow: var(--box-shadow);
          overflow: hidden;
        }
        .section-header {
          padding: 1.25rem 1.5rem;
          background-color: var(--secondary-color);
          color: white;
        }
        .section-header h2 {
          font-size: 1.2rem;
          margin: 0;
        }
        .no-users-message,
        .no-user-selected {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          text-align: center;
        }
        .icon {
          font-size: 3rem;
          color: var(--gray-400);
          margin-bottom: 1rem;
        }
        .users-list {
          padding: 1rem;
          max-height: 500px;
          overflow-y: auto;
        }
        .user-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 0.5rem;
        }
        .user-card:hover {
          background-color: var(--gray-100);
        }
        .user-card.selected {
          background-color: var(--secondary-color);
          color: white;
        }
        .user-card.selected .user-info p {
          color: rgba(255, 255, 255, 0.8);
        }
        .user-avatar {
          width: 50px;
          height: 50px;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 1.5rem;
          font-weight: 600;
          flex-shrink: 0;
        }
        .user-avatar.large {
          width: 80px;
          height: 80px;
          font-size: 2rem;
        }
        .user-info h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
        }
        .user-info p {
          margin: 0;
          font-size: 0.9rem;
          color: var(--gray-600);
        }
        .status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .status-dot.active {
          background-color: var(--success-color);
        }
        .user-details-card {
          padding: 1.5rem;
        }
        .user-details-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--gray-200);
        }
        .user-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .user-stat {
          padding: 1rem;
          background-color: var(--gray-100);
          border-radius: 8px;
        }
        .stat-label {
          font-weight: 600;
          margin-right: 0.5rem;
        }
        .user-medical-conditions {
          margin-bottom: 2rem;
        }
        .user-medical-conditions h4 {
          font-size: 1.1rem;
          margin-bottom: 0.75rem;
        }
        .user-medical-conditions ul {
          list-style: disc;
          padding-left: 1.5rem;
        }
        .user-medical-conditions li {
          margin-bottom: 0.5rem;
        }
        .user-actions {
          display: flex;
          gap: 1rem;
        }
        @media (max-width: 992px) {
          .dashboard-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>


    </div>
  );
};

export default TrainerDashboard;





