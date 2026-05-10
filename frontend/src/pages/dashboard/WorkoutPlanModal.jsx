// import React, { useState } from 'react';

// const plans = {
//   Strength: {
//     Monday: {
//       type: 'Chest Day',
//       exercises: [
//         { name: 'Bench Press', sets: 4, reps: 10 },
//         { name: 'Incline Dumbbell Press', sets: 3, reps: 12 },
//         { name: 'Chest Fly', sets: 3, reps: 15 },
//       ],
//     },
//     Tuesday: {
//       type: 'Back Day',
//       exercises: [
//         { name: 'Deadlift', sets: 4, reps: 8 },
//         { name: 'Pull-Ups', sets: 3, reps: 10 },
//         { name: 'Lat Pulldown', sets: 3, reps: 12 },
//       ],
//     },
//     Wednesday: {
//       type: 'Shoulders',
//       exercises: [
//         { name: 'Shoulder Press', sets: 4, reps: 10 },
//         { name: 'Lateral Raise', sets: 3, reps: 12 },
//         { name: 'Front Raise', sets: 3, reps: 12 },
//       ],
//     },
//     Thursday: {
//       type: 'Arms Day',
//       exercises: [
//         { name: 'Bicep Curls', sets: 3, reps: 15 },
//         { name: 'Tricep Pushdown', sets: 3, reps: 12 },
//         { name: 'Hammer Curl', sets: 3, reps: 10 },
//       ],
//     },
//     Friday: {
//       type: 'Mix Strength',
//       exercises: [
//         { name: 'Push Press', sets: 3, reps: 8 },
//         { name: 'Pull-Ups', sets: 3, reps: 12 },
//         { name: 'Squat Jumps', sets: 3, reps: 15 },
//       ],
//     },
//     Saturday: {
//       type: 'Leg Day',
//       exercises: [
//         { name: 'Squats', sets: 4, reps: 10 },
//         { name: 'Lunges', sets: 3, reps: 12 },
//         { name: 'Leg Press', sets: 3, reps: 10 },
//       ],
//     },
//     Sunday: {
//       type: 'Rest & Recovery',
//       exercises: [],
//     },
//   },

//   WeightLoss: {
//     Monday: {
//       type: 'Cardio Blast',
//       exercises: [
//         { name: 'Treadmill Running', sets: 1, reps: 30 },
//         { name: 'Jump Rope', sets: 3, reps: 60 },
//         { name: 'Burpees', sets: 3, reps: 20 },
//       ],
//     },
//     Tuesday: {
//       type: 'HIIT',
//       exercises: [
//         { name: 'High Knees', sets: 4, reps: 30 },
//         { name: 'Mountain Climbers', sets: 3, reps: 40 },
//         { name: 'Plank Jacks', sets: 3, reps: 20 },
//       ],
//     },
//     Wednesday: {
//       type: 'Core Strength',
//       exercises: [
//         { name: 'Crunches', sets: 3, reps: 25 },
//         { name: 'Leg Raises', sets: 3, reps: 15 },
//         { name: 'Plank', sets: 3, reps: 60 },
//       ],
//     },
//     Thursday: {
//       type: 'Full Body Burn',
//       exercises: [
//         { name: 'Jump Squats', sets: 3, reps: 20 },
//         { name: 'Pushups', sets: 3, reps: 15 },
//         { name: 'Burpees', sets: 3, reps: 20 },
//       ],
//     },
//     Friday: {
//       type: 'Low Impact Cardio',
//       exercises: [
//         { name: 'Cycling', sets: 1, reps: 30 },
//         { name: 'Swimming', sets: 1, reps: 30 },
//         { name: 'Rowing Machine', sets: 2, reps: 20 },
//       ],
//     },
//     Saturday: {
//       type: 'Circuit Training',
//       exercises: [
//         { name: 'Jump Rope', sets: 3, reps: 50 },
//         { name: 'Pushups', sets: 3, reps: 15 },
//         { name: 'Squats', sets: 3, reps: 20 },
//       ],
//     },
//     Sunday: {
//       type: 'Rest & Recovery',
//       exercises: [],
//     },
//   },

//   Endurance: {
//     Monday: {
//       type: 'Endurance Build',
//       exercises: [
//         { name: 'Cycling', sets: 1, reps: 60 },
//         { name: 'Rowing Machine', sets: 3, reps: 20 },
//         { name: 'Box Jumps', sets: 3, reps: 15 },
//       ],
//     },
//     Tuesday: {
//       type: 'Cardio Endurance',
//       exercises: [
//         { name: 'Running', sets: 1, reps: 30 },
//         { name: 'Jumping Jacks', sets: 3, reps: 50 },
//         { name: 'Burpees', sets: 3, reps: 15 },
//       ],
//     },
//     Wednesday: {
//       type: 'Stamina Boost',
//       exercises: [
//         { name: 'Pushups', sets: 3, reps: 20 },
//         { name: 'Pull-Ups', sets: 3, reps: 10 },
//         { name: 'Running', sets: 1, reps: 40 },
//       ],
//     },
//     Thursday: {
//       type: 'Plyometric Drills',
//       exercises: [
//         { name: 'Jump Lunges', sets: 3, reps: 20 },
//         { name: 'Box Jumps', sets: 3, reps: 15 },
//         { name: 'Jump Squats', sets: 3, reps: 20 },
//       ],
//     },
//     Friday: {
//       type: 'Agility & Speed',
//       exercises: [
//         { name: 'Shuttle Runs', sets: 3, reps: 15 },
//         { name: 'Ladder Drills', sets: 3, reps: 30 },
//         { name: 'Side Hops', sets: 3, reps: 30 },
//       ],
//     },
//     Saturday: {
//       type: 'Endurance Mix',
//       exercises: [
//         { name: 'Cycling', sets: 1, reps: 45 },
//         { name: 'Running', sets: 1, reps: 30 },
//         { name: 'Rowing Machine', sets: 2, reps: 25 },
//       ],
//     },
//     Sunday: {
//       type: 'Rest & Recovery',
//       exercises: [],
//     },
//   },

//   MuscleGain: {
//     Monday: {
//       type: 'Chest Hypertrophy',
//       exercises: [
//         { name: 'Flat Bench Press', sets: 4, reps: 8 },
//         { name: 'Incline Barbell Press', sets: 4, reps: 10 },
//         { name: 'Cable Flys', sets: 3, reps: 12 },
//       ],
//     },
//     Tuesday: {
//       type: 'Back Growth',
//       exercises: [
//         { name: 'Barbell Row', sets: 4, reps: 8 },
//         { name: 'Lat Pulldown', sets: 3, reps: 12 },
//         { name: 'Seated Cable Row', sets: 3, reps: 10 },
//       ],
//     },
//     Wednesday: {
//       type: 'Shoulders',
//       exercises: [
//         { name: 'Military Press', sets: 4, reps: 10 },
//         { name: 'Lateral Raise', sets: 3, reps: 12 },
//         { name: 'Rear Delt Fly', sets: 3, reps: 12 },
//       ],
//     },
//     Thursday: {
//       type: 'Arms',
//       exercises: [
//         { name: 'Barbell Curl', sets: 4, reps: 10 },
//         { name: 'Triceps Extension', sets: 3, reps: 12 },
//         { name: 'Hammer Curl', sets: 3, reps: 10 },
//       ],
//     },
//     Friday: {
//       type: 'Legs',
//       exercises: [
//         { name: 'Squats', sets: 4, reps: 10 },
//         { name: 'Leg Press', sets: 4, reps: 10 },
//         { name: 'Leg Extension', sets: 3, reps: 12 },
//       ],
//     },
//     Saturday: {
//       type: 'Full Body Pump',
//       exercises: [
//         { name: 'Deadlift', sets: 3, reps: 8 },
//         { name: 'Push Press', sets: 3, reps: 10 },
//         { name: 'Clean and Press', sets: 3, reps: 6 },
//       ],
//     },
//     Sunday: {
//       type: 'Rest & Recovery',
//       exercises: [],
//     },
//   },

//   ImprovedFitness: {
//     Monday: {
//       type: 'Functional Cardio',
//       exercises: [
//         { name: 'Jogging', sets: 1, reps: 30 },
//         { name: 'Jump Rope', sets: 3, reps: 60 },
//         { name: 'Mountain Climbers', sets: 3, reps: 40 },
//       ],
//     },
//     Tuesday: {
//       type: 'Strength + Mobility',
//       exercises: [
//         { name: 'Bodyweight Squats', sets: 3, reps: 15 },
//         { name: 'Pushups', sets: 3, reps: 15 },
//         { name: 'Plank', sets: 3, reps: 60 },
//       ],
//     },
//     Wednesday: {
//       type: 'Core & Flexibility',
//       exercises: [
//         { name: 'Crunches', sets: 3, reps: 25 },
//         { name: 'Leg Raises', sets: 3, reps: 15 },
//         { name: 'Stretching Routine', sets: 1, reps: 15 },
//       ],
//     },
//     Thursday: {
//       type: 'Agility & Endurance',
//       exercises: [
//         { name: 'Shuttle Runs', sets: 3, reps: 15 },
//         { name: 'Ladder Drills', sets: 3, reps: 30 },
//         { name: 'Box Jumps', sets: 3, reps: 15 },
//       ],
//     },
//     Friday: {
//       type: 'Full Body Mix',
//       exercises: [
//         { name: 'Cycling', sets: 1, reps: 30 },
//         { name: 'Pushups', sets: 3, reps: 15 },
//         { name: 'Bodyweight Rows', sets: 3, reps: 12 },
//       ],
//     },
//     Saturday: {
//       type: 'Mobility Training',
//       exercises: [
//         { name: 'Dynamic Stretching', sets: 1, reps: 15 },
//         { name: 'Yoga Poses', sets: 1, reps: 20 },
//         { name: 'Foam Rolling', sets: 1, reps: 10 },
//       ],
//     },
//     Sunday: {
//       type: 'Rest & Recovery',
//       exercises: [],
//     },
//   },

//   Flexibility: {
//     Monday: {
//       type: 'Full Body Stretch',
//       exercises: [
//         { name: 'Neck Rolls', sets: 1, reps: 15 },
//         { name: 'Arm Circles', sets: 1, reps: 20 },
//         { name: 'Toe Touches', sets: 1, reps: 15 },
//       ],
//     },
//     Tuesday: {
//       type: 'Hip & Hamstrings',
//       exercises: [
//         { name: 'Lunges', sets: 3, reps: 12 },
//         { name: 'Hamstring Stretch', sets: 1, reps: 20 },
//         { name: 'Butterfly Stretch', sets: 1, reps: 20 },
//       ],
//     },
//     Wednesday: {
//       type: 'Yoga Flow',
//       exercises: [
//         { name: 'Sun Salutations', sets: 3, reps: 8 },
//         { name: 'Downward Dog', sets: 2, reps: 10 },
//         { name: 'Child’s Pose', sets: 2, reps: 15 },
//       ],
//     },
//     Thursday: {
//       type: 'Shoulder & Spine Mobility',
//       exercises: [
//         { name: 'Shoulder Rolls', sets: 2, reps: 15 },
//         { name: 'Torso Twists', sets: 2, reps: 15 },
//         { name: 'Cat-Cow Pose', sets: 2, reps: 15 },
//       ],
//     },
//     Friday: {
//       type: 'Lower Back & Core Flex',
//       exercises: [
//         { name: 'Seated Twist', sets: 2, reps: 15 },
//         { name: 'Bridge Pose', sets: 2, reps: 12 },
//         { name: 'Pelvic Tilts', sets: 2, reps: 15 },
//       ],
//     },
//     Saturday: {
//       type: 'Dynamic Mobility',
//       exercises: [
//         { name: 'High Knees', sets: 3, reps: 30 },
//         { name: 'Leg Swings', sets: 3, reps: 15 },
//         { name: 'Arm Swings', sets: 3, reps: 20 },
//       ],
//     },
//     Sunday: {
//       type: 'Rest & Recovery',
//       exercises: [],
//     },
//   },
// };

// export default function WorkoutPlanModal({ onClose, category = 'Strength' }) {
//   // Normalize category name to match keys
//   const formatKey = (key) => key?.replace(/\s+/g, '').toLowerCase();
//   const matchedKey = Object.keys(plans).find((key) => formatKey(key) === formatKey(category));
//   const workoutPlan = plans[matchedKey] || plans['Strength'];

//   const days = Object.keys(workoutPlan);
//   const [currentDayIndex, setCurrentDayIndex] = useState(0);
//   const currentDay = days[currentDayIndex];
//   const { type, exercises } = workoutPlan[currentDay];

//   const nextDay = () => setCurrentDayIndex((prev) => (prev + 1) % days.length);
//   const prevDay = () => setCurrentDayIndex((prev) => (prev - 1 + days.length) % days.length);

//   return (
//     <div className="modal-overlay">
//       <div className="modal-container">
//         <h2>{currentDay}</h2>
//         <h4>{type}</h4>

//         {exercises.length ? (
//           <ul>
//             {exercises.map((e, i) => (
//               <li key={i}>
//                 {e.name} — {e.sets} sets × {e.reps} reps
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>Enjoy your rest and recovery day!</p>
//         )}

//         <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
//           <button onClick={prevDay}>← Prev</button>
//           <button onClick={nextDay}>Next →</button>
//         </div>

//         <button onClick={onClose} style={{ marginTop: '1rem', background: '#e74c3c', color: '#fff' }}>
//           Close
//         </button>
//       </div>

//       <style jsx>{`
//         .modal-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           height: 100vh;
//           width: 100vw;
//           background: rgba(0, 0, 0, 0.6);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//         }
//         .modal-container {
//           background: white;
//           padding: 2rem;
//           border-radius: 12px;
//           max-width: 400px;
//           width: 100%;
//           text-align: center;
//         }
//         button {
//           padding: 0.5rem 1rem;
//           border: none;
//           border-radius: 6px;
//           background: #3498db;
//           color: white;
//           cursor: pointer;
//         }
//         button:hover {
//           background: #2980b9;
//         }
//       `}</style>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultDayData = {
  type: '',
  exercises: [],
};

export default function WorkoutPlanModal({ onClose, mode = 'user', targetUserEmail, category = '', plan: incomingPlan }) {

  const { token, user } = useAuth();
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
const [plan, setPlan] = useState(incomingPlan || {});

  const [planLoaded, setPlanLoaded] = useState(false);
  const workoutPlan = plan || plans['Strength'];

  const currentDay = days[currentDayIndex];
  const currentDayData = plan[currentDay] || defaultDayData;

  // Fetch saved plan for user
useEffect(() => {
  if (mode === 'user' && !incomingPlan && user?.email) {
    axios
      .get(`/api/plan/${user.email}`)
      .then((res) => {
        setPlan(res.data.plan || {});
        setPlanLoaded(true);
      })
      .catch(() => setPlanLoaded(true));
  } else if (mode === 'trainer' && targetUserEmail) {
    const emptyPlan = {};
    days.forEach((day) => {
      emptyPlan[day] = { type: '', exercises: [] };
    });
    setPlan(emptyPlan);
    setPlanLoaded(true);
  } else {
    setPlanLoaded(true); // plan was passed
  }
}, [mode, user, incomingPlan, targetUserEmail]);


  const updateExercise = (index, field, value) => {
    setPlan((prev) => {
      const exercises = [...(prev[currentDay]?.exercises || [])];
      exercises[index] = { ...exercises[index], [field]: value };
      return {
        ...prev,
        [currentDay]: {
          ...prev[currentDay],
          exercises,
        },
      };
    });
  };

  const addExercise = () => {
    setPlan((prev) => {
      const exercises = [...(prev[currentDay]?.exercises || [])];
      exercises.push({ name: '', sets: '', reps: '' });
      return {
        ...prev,
        [currentDay]: {
          ...prev[currentDay],
          exercises,
        },
      };
    });
  };

  const updateType = (type) => {
    setPlan((prev) => ({
      ...prev,
      [currentDay]: {
        ...prev[currentDay],
        type,
      },
    }));
  };

  const handleSave = async () => {
    console.log('Sending Plan:', {
  userEmail: targetUserEmail,
  // category,
  plan,
});

    try {
      await axios.post(
        `${API_BASE_URL}/api/plan/save`,
        {
          userEmail: targetUserEmail,
          // category,
          plan,
        },
        {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        }
      );
      alert('Workout plan saved!');
      onClose();
    } catch (err) {
      alert('Failed to save plan');
    }
  };

  const nextDay = () => setCurrentDayIndex((prev) => (prev + 1) % days.length);
  const prevDay = () => setCurrentDayIndex((prev) => (prev - 1 + days.length) % days.length);

  if (!planLoaded) return <p>Loading plan...</p>;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>{currentDay}</h2>

        {mode === 'trainer' ? (
          <>
            <input
              type="text"
              value={currentDayData.type}
              onChange={(e) => updateType(e.target.value)}
              placeholder="Workout Type"
              style={{ marginBottom: '0.5rem' }}
            />
            {currentDayData.exercises.map((ex, i) => (
              <div key={i}>
                <input
                  type="text"
                  value={ex.name}
                  onChange={(e) => updateExercise(i, 'name', e.target.value)}
                  placeholder="Exercise Name"
                />
                <input
                  type="number"
                  value={ex.sets}
                  onChange={(e) => updateExercise(i, 'sets', e.target.value)}
                  placeholder="Sets"
                />
                <input
                  type="number"
                  value={ex.reps}
                  onChange={(e) => updateExercise(i, 'reps', e.target.value)}
                  placeholder="Reps"
                />
              </div>
            ))}
            <button onClick={addExercise}>+ Add Exercise</button>
          </>
        ) : (
          <>
            <h4>{currentDayData.type}</h4>
            {currentDayData.exercises.length ? (
              <ul>
                {currentDayData.exercises.map((e, i) => (
                  <li key={i}>
                    {e.name} — {e.sets} sets × {e.reps} reps
                  </li>
                ))}
              </ul>
            ) : (
              <p>Enjoy your rest and recovery day!</p>
            )}
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <button onClick={prevDay}>← Prev</button>
          <button onClick={nextDay}>Next →</button>
        </div>

        {mode === 'trainer' && (
          <button onClick={handleSave} style={{ marginTop: '1rem', background: '#0D9488' }}>
            Save Plan
          </button>
        )}

        <button onClick={onClose} style={{ marginTop: '1rem', marginLeft:'10px' , background: '#e74c3c' }}>
          Close
        </button>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-container {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          max-width: 400px;
          width: 100%;
          text-align: center;
        }
        input {
          display: block;
          margin: 0.3rem auto;
          padding: 0.4rem;
          width: 90%;
        }
        button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          background: #0D9488;
          color: white;
          cursor: pointer;
        }
        button:hover {
          background:rgb(46, 177, 166);
        }
      `}</style>
    </div>
  );
}
