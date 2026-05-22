import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';
import { FaUsers, FaUserCircle, FaClipboardList, FaFire, FaCalendarCheck, FaDumbbell, FaChartBar } from 'react-icons/fa';
import ProgressCalendar from '../../components/ProgressCalendar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  const [clientLogs, setClientLogs] = useState([]);
  const [clientStats, setClientStats] = useState(null);
  const [progressTab, setProgressTab] = useState('overview'); // 'overview' | 'calendar'



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

  const handleUserSelect = async (assignedUser) => {
    setSelectedUser(assignedUser);
    setClientLogs([]);
    setClientStats(null);
    setProgressTab('overview');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [logsRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/daily-logs/user/${assignedUser._id}`, config),
        axios.get(`${API_BASE_URL}/api/daily-logs/user/${assignedUser._id}/stats`, config)
      ]);
      setClientLogs(logsRes.data);
      setClientStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching client progress:', err);
    }
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
                  <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    Create Workout Plan
                  </button>
                  <button className="btn btn-outline" onClick={() => setShowDietModal(true)}>
                    Create Diet Plan
                  </button>
                </div>

                {/* ── Client Progress ── */}
                <div className="progress-panel">
                  <div className="progress-panel-header">
                    <FaChartBar /> Client Progress
                  </div>

                  {/* Stats row */}
                  {clientStats ? (
                    <>
                      <div className="cp-stats-row">
                        <div className="cp-stat orange">
                          <FaFire className="cp-icon" />
                          <div>
                            <div className="cp-val">{clientStats.streak}</div>
                            <div className="cp-lbl">Streak</div>
                          </div>
                        </div>
                        <div className="cp-stat green">
                          <FaCalendarCheck className="cp-icon" />
                          <div>
                            <div className="cp-val">{clientStats.weekRate}%</div>
                            <div className="cp-lbl">This Week</div>
                          </div>
                        </div>
                        <div className="cp-stat blue">
                          <FaDumbbell className="cp-icon" />
                          <div>
                            <div className="cp-val">{clientStats.completed}</div>
                            <div className="cp-lbl">Completed</div>
                          </div>
                        </div>
                        <div className="cp-stat red">
                          <FaUsers className="cp-icon" />
                          <div>
                            <div className="cp-val">{clientStats.missed}</div>
                            <div className="cp-lbl">Missed</div>
                          </div>
                        </div>
                      </div>

                      {/* Tab bar */}
                      <div className="cp-tabs">
                        <button className={`cp-tab ${progressTab === 'overview' ? 'active' : ''}`} onClick={() => setProgressTab('overview')}>Overview Chart</button>
                        <button className={`cp-tab ${progressTab === 'calendar' ? 'active' : ''}`} onClick={() => setProgressTab('calendar')}>Calendar</button>
                        <button className={`cp-tab ${progressTab === 'logs' ? 'active' : ''}`} onClick={() => setProgressTab('logs')}>Recent Logs</button>
                      </div>

                      {progressTab === 'overview' && clientStats.weeklyData?.length > 0 && (
                        <div className="cp-chart">
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={clientStats.weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                              <Tooltip />
                              <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                              <Bar dataKey="completed" fill="#16a34a" radius={[3,3,0,0]} name="Completed" stackId="a" />
                              <Bar dataKey="partial"   fill="#ca8a04" radius={[3,3,0,0]} name="Partial"   stackId="a" />
                              <Bar dataKey="missed"    fill="#dc2626" radius={[3,3,0,0]} name="Missed"    stackId="a" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {progressTab === 'calendar' && (
                        <div style={{ marginTop: '0.75rem' }}>
                          <ProgressCalendar logs={clientLogs} readOnly={true} />
                        </div>
                      )}

                      {progressTab === 'logs' && (
                        <div className="recent-logs">
                          {clientLogs.slice(0, 10).map(log => (
                            <div key={log._id} className="log-row">
                              <span className="log-date">{new Date(log.date + 'T12:00:00').toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })}</span>
                              <span className={`log-badge ws-${log.workout?.status}`}>{log.workout?.status}</span>
                              <span className={`log-badge ds-${log.diet?.status}`}>{log.diet?.status}</span>
                              {log.mood && <span className="log-mood">{{'great':'😄','good':'🙂','okay':'😐','tired':'😴','sick':'🤒'}[log.mood]}</span>}
                            </div>
                          ))}
                          {clientLogs.length === 0 && <p className="no-logs">No logs yet from this client.</p>}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="no-logs">Loading progress data…</p>
                  )}
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

        /* Client progress panel */
        .progress-panel {
          margin-top: 1.5rem;
          border-top: 1px solid var(--gray-200);
          padding-top: 1.25rem;
        }
        .progress-panel-header {
          font-size: 1rem;
          font-weight: 700;
          color: var(--secondary-color);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .cp-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.6rem;
          margin-bottom: 1rem;
        }
        .cp-stat {
          background: var(--gray-100);
          border-radius: 10px;
          padding: 0.7rem 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-left: 3px solid transparent;
        }
        .cp-stat.orange { border-left-color: #f97316; }
        .cp-stat.green  { border-left-color: #16a34a; }
        .cp-stat.blue   { border-left-color: #1e40af; }
        .cp-stat.red    { border-left-color: #dc2626; }
        .cp-icon { font-size: 1rem; }
        .cp-stat.orange .cp-icon { color: #f97316; }
        .cp-stat.green  .cp-icon { color: #16a34a; }
        .cp-stat.blue   .cp-icon { color: #1e40af; }
        .cp-stat.red    .cp-icon { color: #dc2626; }
        .cp-val  { font-size: 1.3rem; font-weight: 700; color: var(--dark-color); line-height: 1; }
        .cp-lbl  { font-size: 0.72rem; color: var(--gray-500); }

        .cp-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
        }
        .cp-tab {
          padding: 0.35rem 0.9rem;
          border-radius: 6px;
          border: 1.5px solid var(--gray-300);
          background: white;
          cursor: pointer;
          font-size: 0.82rem;
          font-family: inherit;
          transition: all 0.2s;
        }
        .cp-tab.active {
          background: var(--secondary-color);
          color: white;
          border-color: var(--secondary-color);
        }
        .cp-chart { margin-top: 0.5rem; }

        .recent-logs {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-top: 0.5rem;
        }
        .log-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--gray-100);
          padding: 0.45rem 0.75rem;
          border-radius: 8px;
          font-size: 0.82rem;
        }
        .log-date { font-weight: 600; color: var(--gray-700); min-width: 110px; }
        .log-badge {
          padding: 0.1rem 0.55rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        .log-badge.ws-completed, .log-badge.ds-completed { background: #dcfce7; color: #15803d; }
        .log-badge.ws-partial,   .log-badge.ds-partial   { background: #fef9c3; color: #a16207; }
        .log-badge.ws-missed,    .log-badge.ds-missed    { background: #fee2e2; color: #b91c1c; }
        .log-badge.ws-rest,      .log-badge.ds-rest      { background: #f1f5f9; color: #64748b; }
        .log-mood { font-size: 1rem; }
        .no-logs { color: var(--gray-400); font-size: 0.85rem; text-align: center; padding: 1rem 0; }
      `}</style>


    </div>
  );
};

export default TrainerDashboard;





