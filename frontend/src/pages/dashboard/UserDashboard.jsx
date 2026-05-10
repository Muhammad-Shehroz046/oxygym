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

//         const { data } = await axios.get('${API_BASE_URL}/api/users/profile', config);
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
import { FaDumbbell, FaUser, FaWeight, FaRuler, FaBullseye } from 'react-icons/fa';
import WorkoutPlanModal from './WorkoutPlanModal';
import DietPlanModal from './DietPlanModalMemberDsh';
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




  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        const { data } = await axios.get('${API_BASE_URL}/api/users/profile', config);
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
      `}</style>
    </div>
  );
};

export default UserDashboard;








