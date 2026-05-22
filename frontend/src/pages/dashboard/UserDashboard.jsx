// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '../../context/AuthContext';
// import { FaDumbbell, FaUser, FaWeight, FaRuler, FaBullseye } from 'react-icons/fa';
// import WorkoutPlanModal from './WorkoutPlanModal';


// const UserDashboard = () => {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showWorkoutModal, setShowWorkoutModal] = useState(false);

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const config = {
//           headers: {
//             Authorization: `Bearer ${user.token}`
//           }
//         };

//         const { data } = await axios.get(`${API_BASE_URL}/api/users/profile`, config);
//         setProfile(data);
//       } catch (error) {
//         console.error('Error fetching profile:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, [user.token]);

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner"></div>
//         <p>Loading your dashboard...</p>
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="container">
//         <div className="error-message">
//           <p>Failed to load profile data. Please try again later.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="user-dashboard">
//       <div className="container">
//         <div className="welcome-banner">
//           <h1>Welcome, {profile.name}</h1>
//           <p>Your personal fitness dashboard</p>
//         </div>

//         <div className="dashboard-grid">
//           {/* Profile Card */}
//           <div className="dashboard-card profile-card">
//             <div className="card-header">
//               <h2><FaUser className="card-icon" /> Profile</h2>
//             </div>
//             <div className="card-body">
//               <div className="profile-info">
//                 <div className="profile-photo">
//                   <div className="avatar-placeholder">
//                     {profile.name.charAt(0).toUpperCase()}
//                   </div>
//                 </div>
//                 <div className="profile-details">
//                   <h3>{profile.name}</h3>
//                   <p>{profile.email}</p>
//                   <p>Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Physical Stats Card */}
//           <div className="dashboard-card stats-card">
//             <div className="card-header">
//               <h2><FaDumbbell className="card-icon" /> Physical Stats</h2>
//             </div>
//             <div className="card-body">
//               <div className="stats-grid">
//                 <div className="stat-item">
//                   <div className="stat-icon"><FaUser /></div>
//                   <div className="stat-info">
//                     <p className="stat-label">Age</p>
//                     <h3 className="stat-value">{profile.profileDetails?.age} years</h3>
//                   </div>
//                 </div>
//                 <div className="stat-item">
//                   <div className="stat-icon"><FaRuler /></div>
//                   <div className="stat-info">
//                     <p className="stat-label">Height</p>
//                     <h3 className="stat-value">{profile.profileDetails?.height} cm</h3>
//                   </div>
//                 </div>
//                 <div className="stat-item">
//                   <div className="stat-icon"><FaWeight /></div>
//                   <div className="stat-info">
//                     <p className="stat-label">Weight</p>
//                     <h3 className="stat-value">{profile.profileDetails?.weight} kg</h3>
//                   </div>
//                 </div>
//                 <div className="stat-item">
//                   <div className="stat-icon"><FaBullseye /></div>
//                   <div className="stat-info">
//                     <p className="stat-label">Goal</p>
//                     <h3 className="stat-value">{profile.profileDetails?.fitnessGoal}</h3>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Trainer Card */}
//           <div className="dashboard-card trainer-card">
//             <div className="card-header">
//               <h2>🏋️ Your Trainer</h2>
//             </div>
//             <div className="card-body">
//               {profile.selectedTrainer ? (
//                 <div className="trainer-info">
//                   <div className="trainer-photo">
//                     <img
//                       src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${profile.selectedTrainer.name}`}
//                       alt={profile.selectedTrainer.name}
//                     />
//                   </div>
//                   <div className="trainer-details">
//                     <h3>{profile.selectedTrainer.name}</h3>
//                     <p>{profile.selectedTrainer.email}</p>
//                     <p>Specialist in {profile.selectedTrainer.category} Training</p>
//                     <button className="btn btn-outline btn-sm">Contact Trainer</button>
//                   </div>
//                 </div>
//               ) : (
//                 <p className="no-conditions">No trainer selected yet.</p>
//               )}
//             </div>
//           </div>

//           {/* Workout Plan Card */}
//           <div className="dashboard-card">
//             <div className="card-header">
//               <h2>📋 Workout Plan</h2>
//             </div>
//             <div className="card-body">
//               <p>Click below to view your weekly workout plan.</p>
//               <button className="btn btn-primary" onClick={() => setShowWorkoutModal(true)}>
//                 View Workout Plan
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Workout Modal */}
//       {showWorkoutModal && (
//         <WorkoutPlanModal
//           onClose={() => setShowWorkoutModal(false)}
//           category={profile.profileDetails?.fitnessGoal}
//         />
//       )}
//        <style jsx>{`
//         .user-dashboard {
//           padding: 3rem 0;
//           min-height: calc(100vh - 70px - 400px);
//         }

//         .welcome-banner {
//           text-align: center;
//           margin-bottom: 3rem;
//         }

//         .welcome-banner h1 {
//           font-size: 2.5rem;
//           margin-bottom: 0.5rem;
//           color: var(--primary-dark);
//         }

//         .welcome-banner p {
//           font-size: 1.2rem;
//           color: var(--gray-600);
//         }

//         .dashboard-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//           gap: 1.5rem;
//         }

//         .dashboard-card {
//           background-color: white;
//           border-radius: 8px;
//           overflow: hidden;
//           box-shadow: var(--box-shadow);
//           transition: transform 0.3s ease;
//           height: 100%;
//         }

//         .dashboard-card:hover {
//           transform: translateY(-5px);
//         }

//         .card-header {
//           padding: 1.25rem;
//           background-color: var(--primary-color);
//           color: white;
//         }

//         .card-header h2 {
//           font-size: 1.2rem;
//           margin: 0;
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//         }

//         .card-icon {
//           font-size: 1.2rem;
//         }

//         .card-body {
//           padding: 1.5rem;
//         }

//         .profile-info {
//           display: flex;
//           align-items: center;
//           gap: 1.5rem;
//         }

//         .profile-photo {
//           flex-shrink: 0;
//         }

//         .avatar-placeholder {
//           width: 80px;
//           height: 80px;
//           background-color: var(--primary-color);
//           color: white;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 50%;
//           font-size: 2rem;
//           font-weight: 600;
//         }

//         .profile-details h3 {
//           margin-bottom: 0.25rem;
//         }

//         .profile-details p {
//           color: var(--gray-600);
//           margin-bottom: 0.25rem;
//         }

//         .stats-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
//           gap: 1rem;
//         }

//         .stat-item {
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//         }

//         .stat-icon {
//           width: 40px;
//           height: 40px;
//           background-color: var(--gray-100);
//           color: var(--primary-color);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 50%;
//           flex-shrink: 0;
//         }

//         .stat-info {
//           flex-grow: 1;
//         }

//         .stat-label {
//           color: var(--gray-600);
//           font-size: 0.9rem;
//           margin-bottom: 0.25rem;
//         }

//         .stat-value {
//           font-size: 1.2rem;
//           font-weight: 600;
//           margin: 0;
//           color: var(--dark-color);
//         }

//         .trainer-info {
//           display: flex;
//           align-items: center;
//           gap: 1.5rem;
//         }

//         .trainer-photo {
//           flex-shrink: 0;
//           width: 80px;
//           height: 80px;
//           border-radius: 50%;
//           overflow: hidden;
//         }

//         .trainer-photo img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         .trainer-details h3 {
//           margin-bottom: 0.25rem;
//         }

//         .trainer-details p {
//           color: var(--gray-600);
//           margin-bottom: 0.25rem;
//         }

//         .trainer-details .btn-sm {
//           margin-top: 0.5rem;
//           padding: 0.3rem 0.75rem;
//           font-size: 0.8rem;
//         }

//         .no-trainer-message,
//         .no-conditions {
//           text-align: center;
//           padding: 1.5rem;
//           color: var(--gray-500);
//         }

//         .conditions-list {
//           list-style: none;
//         }

//         .conditions-list li {
//           padding: 0.5rem 0;
//           border-bottom: 1px solid var(--gray-200);
//           color: var(--gray-700);
//         }

//         .conditions-list li:last-child {
//           border-bottom: none;
//         }

//         .loading-container {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           min-height: calc(100vh - 70px - 400px);
//         }

//         .loading-spinner {
//           width: 50px;
//           height: 50px;
//           border: 5px solid var(--gray-200);
//           border-top: 5px solid var(--primary-color);
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//           margin-bottom: 1rem;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>

//     </div>
//   );
// };

// export default UserDashboard;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaDumbbell, FaUser, FaWeight, FaRuler, FaBullseye, FaFire, FaCalendarCheck, FaChartLine } from 'react-icons/fa';
import WorkoutPlanModal from './WorkoutPlanModal';
import DietPlanModal from './DietPlanModalMemberDsh';
import ProgressCalendar from '../../components/ProgressCalendar';
import DailyLogModal from '../../components/DailyLogModal';
import { API_BASE_URL } from '../../config';


const UserDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [userPlan, setUserPlan] = useState(null);
  const [dietPlan, setDietPlan] = useState([]);
const [currentDay, setCurrentDay] = useState(0);
const [showDietModal, setShowDietModal] = useState(false);
const [logs, setLogs] = useState([]);
const [logModalDate, setLogModalDate] = useState(null);
const [logModalExisting, setLogModalExisting] = useState(null);




  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        const { data } = await axios.get(`${API_BASE_URL}/api/users/profile`, config);
        setProfile(data);
        try {
  const dietRes = await axios.get(`${API_BASE_URL}/api/diet-plans/user/${data._id}`);
  setDietPlan(dietRes.data.dietPlan); // This should be an array of days
} catch (err) {
  console.error("Diet plan not found or failed to load:", err);
}

        try {
  const response = await axios.get(`${API_BASE_URL}/api/plan/${data.email}`);
  setUserPlan(response.data.plan); // plan contains { Monday: {...}, ... }
} catch (err) {
  console.error('Workout plan not found or failed to load:', err);
}
        
        // Fetch daily logs
        try {
          const logsRes = await axios.get(`${API_BASE_URL}/api/daily-logs/my`, config);
          setLogs(logsRes.data);
        } catch (err) {
          console.error('Logs fetch error:', err);
        }
      }
       catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user.token]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container">
        <div className="error-message">
          <p>Failed to load profile data. Please try again later.</p>
        </div>
      </div>
    );
  }
const trainer = {
  ...profile.selectedTrainer,
  phoneNumber: profile.selectedTrainer?.phone
};

const whatsappNumber = trainer.phoneNumber?.replace(/\D/g, '');
const whatsappLink = `https://wa.me/+${whatsappNumber}`;

  // --- Progress helpers ---
  const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const todayDow = DAY_NAMES[today.getDay()];

  const todayLog = logs.find(l => l.date === todayStr);
  const completedLogs = logs.filter(l => l.workout?.status === 'completed').length;
  const thisWeekLogs = logs.filter(l => {
    const d = new Date(l.date);
    const wStart = new Date(today); wStart.setDate(today.getDate() - today.getDay());
    return d >= wStart;
  });
  const weekRate = thisWeekLogs.length
    ? Math.round((thisWeekLogs.filter(l => l.workout?.status === 'completed').length / thisWeekLogs.length) * 100) : 0;

  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const log = logs.find(l => l.date === key);
    if (log && (log.workout?.status === 'completed' || log.workout?.status === 'partial')) streak++;
    else break;
  }

  const handleDayClick = (dateStr, existingLog) => {
    setLogModalDate(dateStr);
    setLogModalExisting(existingLog || null);
  };

  const handleSaveLog = async (payload) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`${API_BASE_URL}/api/daily-logs`, payload, config);
      setLogs(prev => {
        const filtered = prev.filter(l => l.date !== data.date);
        return [...filtered, data];
      });
    } catch (err) {
      console.error('Error saving log:', err);
    }
  };

  // Get the plan for a given date (day of week)
  const getPlanForDate = (dateStr) => {
    const dow = DAY_NAMES[new Date(dateStr + 'T12:00:00').getDay()];
    const workoutDay = userPlan?.[dow] || null;
    const dietDayIdx = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].indexOf(dow);
    const dietDay = Array.isArray(dietPlan) ? dietPlan[dietDayIdx] : null;
    return { workoutDay, dietDay };
  };

  return (
    <div className="user-dashboard">
      <div className="container">
        <div className="welcome-banner">
          <h1>Welcome, {profile.name}</h1>
          <p>Your personal fitness dashboard</p>
        </div>

        <div className="dashboard-grid">

          {/* Profile Card */}
          <div className="dashboard-card profile-card">
            <div className="card-header">
              <h2><FaUser className="card-icon" /> Profile</h2>
            </div>
            <div className="card-body">
              <div className="profile-info">
                <div className="profile-photo">
                  <div className="avatar-placeholder">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="profile-details">
                  <h3>{profile.name}</h3>
                  <p>{profile.email}</p>
                  <p>Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Physical Stats */}
          <div className="dashboard-card stats-card">
            <div className="card-header">
              <h2><FaDumbbell className="card-icon" /> Physical Stats</h2>
            </div>
            <div className="card-body">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-icon"><FaUser /></div>
                  <div className="stat-info">
                    <p className="stat-label">Age</p>
                    <h3 className="stat-value">{profile.profileDetails?.age} years</h3>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon"><FaRuler /></div>
                  <div className="stat-info">
                    <p className="stat-label">Height</p>
                    <h3 className="stat-value">{profile.profileDetails?.height} cm</h3>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon"><FaWeight /></div>
                  <div className="stat-info">
                    <p className="stat-label">Weight</p>
                    <h3 className="stat-value">{profile.profileDetails?.weight} kg</h3>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon"><FaBullseye /></div>
                  <div className="stat-info">
                    <p className="stat-label">Goal</p>
                    <h3 className="stat-value">{profile.profileDetails?.fitnessGoal}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trainer Card */}
          <div className="dashboard-card trainer-card">
            <div className="card-header">
              <h2>🏋️ Your Trainer</h2>
            </div>
            <div className="card-body">
              {trainer ? (
                <div className="trainer-info">
                  <div className="trainer-photo">
                    <img
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${trainer.name}`}
                      alt={trainer.name}
                    />
                  </div>
                  <div className="trainer-details">
                    <h3>{trainer.name}</h3>
                    <p>{trainer.email}</p>
                    <p>Specialist in {trainer.category} Training</p>

                    {whatsappLink ? (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          backgroundColor: '#25D366',
                          color: 'white',
                          padding: '0.6rem 1.2rem',
                          borderRadius: '30px',
                          textDecoration: 'none',
                          fontWeight: 'bold',
                          fontSize: '0.95rem',
                          marginTop: '1rem'
                        }}
                      >
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
                          alt="WhatsApp"
                          style={{ width: '24px', height: '24px' }}
                        />
                        Chat on WhatsApp
                      </a>
                    ) : (
                      <p>No contact number available</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="no-conditions">No trainer selected yet.</p>
              )}
            </div>
          </div>

          {/* Workout Plan Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>📋 Workout Plan</h2>
            </div>
            <div className="card-body">
              <p>Click below to view your weekly workout plan.</p>
              <button className="btn btn-primary" onClick={() => setShowWorkoutModal(true)}>
                View Workout Plan
              </button>
            </div>
          </div>
{/* Diet Plan Card */}
<div className="dashboard-card">
  <div className="card-header">
    <h2>🥗 Diet Plan</h2>
  </div>
  <div className="card-body">
    <p>Click below to view your weekly diet plan.</p>
    <button className="btn btn-primary" onClick={() => setShowDietModal(true)}>
      View Diet Plan
    </button>
  </div>
</div>



        </div>
      </div>

      {/* ── Progress Section ── */}
      <div className="progress-section">
        <h2 className="progress-heading"><FaChartLine /> My Progress</h2>

        {/* Quick stats */}
        <div className="progress-stats-row">
          <div className="prog-stat orange">
            <FaFire className="prog-stat-icon" />
            <div>
              <div className="prog-stat-value">{streak}</div>
              <div className="prog-stat-label">Day Streak</div>
            </div>
          </div>
          <div className="prog-stat green">
            <FaCalendarCheck className="prog-stat-icon" />
            <div>
              <div className="prog-stat-value">{weekRate}%</div>
              <div className="prog-stat-label">This Week</div>
            </div>
          </div>
          <div className="prog-stat blue">
            <FaDumbbell className="prog-stat-icon" />
            <div>
              <div className="prog-stat-value">{completedLogs}</div>
              <div className="prog-stat-label">Total Completed</div>
            </div>
          </div>
          <div className="prog-stat teal">
            <FaUser className="prog-stat-icon" />
            <div>
              <div className="prog-stat-value">{logs.length}</div>
              <div className="prog-stat-label">Days Logged</div>
            </div>
          </div>
        </div>

        {/* Log Today CTA */}
        <div className="log-today-bar">
          <div>
            <strong>Today is {todayDow}</strong>
            {todayLog ? (
              <span className="today-logged">
                {' '} — Workout: <b>{todayLog.workout?.status}</b> · Diet: <b>{todayLog.diet?.status}</b>
              </span>
            ) : (
              <span className="today-not-logged"> — Not logged yet</span>
            )}
          </div>
          <button className="btn-log-today" onClick={() => handleDayClick(todayStr, todayLog)}>
            {todayLog ? 'Edit Today\'s Log' : 'Log Today'}
          </button>
        </div>

        {/* Calendar */}
        <ProgressCalendar logs={logs} onDayClick={handleDayClick} />
      </div>

      {/* Workout Modal */}
      {showWorkoutModal && (
  <WorkoutPlanModal
  mode="user"
  plan={userPlan} // ⬅️ pass the plan from DB
  onClose={() => setShowWorkoutModal(false)}
/>



      )}
      {showDietModal && (
  <DietPlanModal
    plan={dietPlan}
    onClose={() => setShowDietModal(false)}
  />
)}

      {logModalDate && (() => {
        const { workoutDay, dietDay } = getPlanForDate(logModalDate);
        return (
          <DailyLogModal
            date={logModalDate}
            existingLog={logModalExisting}
            workoutDayPlan={workoutDay}
            dietDayPlan={dietDay}
            onSave={handleSaveLog}
            onClose={() => { setLogModalDate(null); setLogModalExisting(null); }}
          />
        );
      })()}

            <style jsx>{`
        .user-dashboard {
          padding: 3rem 0;
          min-height: calc(100vh - 70px - 400px);
        }
        
        .welcome-banner {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .welcome-banner h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: var(--primary-dark);
        }
        
        .welcome-banner p {
          font-size: 1.2rem;
          color: var(--gray-600);
        }
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .dashboard-card {
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: var(--box-shadow);
          transition: transform 0.3s ease;
          height: 100%;
        }
        
        .dashboard-card:hover {
          transform: translateY(-5px);
        }
        
        .card-header {
          padding: 1.25rem;
          background-color: var(--primary-color);
          color: white;
        }
        
        .card-header h2 {
          font-size: 1.2rem;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .card-icon {
          font-size: 1.2rem;
        }
        
        .card-body {
          padding: 1.5rem;
        }
        
        .profile-info {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .profile-photo {
          flex-shrink: 0;
        }
        
        .avatar-placeholder {
          width: 80px;
          height: 80px;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 2rem;
          font-weight: 600;
        }
        
        .profile-details h3 {
          margin-bottom: 0.25rem;
        }
        
        .profile-details p {
          color: var(--gray-600);
          margin-bottom: 0.25rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .stat-icon {
          width: 40px;
          height: 40px;
          background-color: var(--gray-100);
          color: var(--primary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .stat-info {
          flex-grow: 1;
        }
        
        .stat-label {
          color: var(--gray-600);
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }
        
        .stat-value {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0;
          color: var(--dark-color);
        }
        
        .trainer-info {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .trainer-photo {
          flex-shrink: 0;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
        }
        
        .trainer-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .trainer-details h3 {
          margin-bottom: 0.25rem;
        }
        
        .trainer-details p {
          color: var(--gray-600);
          margin-bottom: 0.25rem;
        }
        
        .trainer-details .btn-sm {
          margin-top: 0.5rem;
          padding: 0.3rem 0.75rem;
          font-size: 0.8rem;
        }
        
        .no-trainer-message,
        .no-conditions {
          text-align: center;
          padding: 1.5rem;
          color: var(--gray-500);
        }
        
        .conditions-list {
          list-style: none;
        }
        
        .conditions-list li {
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--gray-200);
          color: var(--gray-700);
        }
        
        .conditions-list li:last-child {
          border-bottom: none;
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
          border-top: 5px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Progress section */
        .progress-section {
          margin-top: 2.5rem;
        }
        .progress-heading {
          font-size: 1.5rem;
          color: var(--primary-dark);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .progress-stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .prog-stat {
          background: white;
          border-radius: 12px;
          padding: 1.1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: var(--box-shadow);
          border-left: 4px solid transparent;
        }
        .prog-stat.orange { border-left-color: #f97316; }
        .prog-stat.green  { border-left-color: #16a34a; }
        .prog-stat.blue   { border-left-color: #1e40af; }
        .prog-stat.teal   { border-left-color: #0d9488; }
        .prog-stat-icon {
          font-size: 1.4rem;
        }
        .prog-stat.orange .prog-stat-icon { color: #f97316; }
        .prog-stat.green  .prog-stat-icon { color: #16a34a; }
        .prog-stat.blue   .prog-stat-icon { color: #1e40af; }
        .prog-stat.teal   .prog-stat-icon { color: #0d9488; }
        .prog-stat-value {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--dark-color);
          line-height: 1;
        }
        .prog-stat-label {
          font-size: 0.8rem;
          color: var(--gray-500);
          margin-top: 0.2rem;
        }
        .log-today-bar {
          background: white;
          border-radius: 12px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          box-shadow: var(--box-shadow);
          margin-bottom: 1.25rem;
          font-size: 0.95rem;
        }
        .today-logged { color: var(--success-color); }
        .today-not-logged { color: var(--warning-color); }
        .btn-log-today {
          background: #0d9488;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.55rem 1.25rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .btn-log-today:hover { background: #0f766e; }
      `}</style>
    </div>
  );
};

export default UserDashboard;








