// src/pages/dashboard/DietPlanModal.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DietPlanModal({ onClose }) {
  const { user } = useAuth();
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [plan, setPlan] = useState({});
  const [loaded, setLoaded] = useState(false);

  const currentDay = days[currentDayIndex];
  const currentDayData = plan[currentDay];

  useEffect(() => {
    const fetchDietPlan = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/diet-plans/user/${user._id}`);
        const mapped = {};

        res.data.dietPlan.forEach((entry) => {
          mapped[entry.day] = {
            breakfast: entry.breakfast || '',
            lunch: entry.lunch || '',
            dinner: entry.dinner || '',
            snacks: entry.snacks || ''
          };
        });

        setPlan(mapped);
        setLoaded(true);
      } catch (err) {
        console.error('❌ Failed to load diet plan:', err);
        setLoaded(true);
      }
    };

    fetchDietPlan();
  }, [user._id]);

  const nextDay = () => setCurrentDayIndex((prev) => (prev + 1) % days.length);
  const prevDay = () => setCurrentDayIndex((prev) => (prev - 1 + days.length) % days.length);

  if (!loaded) return <p>Loading diet plan...</p>;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>{currentDay}</h2>

        {currentDayData ? (
          <div>
            <p><strong>🍳 Breakfast:</strong> {currentDayData.breakfast}</p>
            <p><strong>🍛 Lunch:</strong> {currentDayData.lunch}</p>
            <p><strong>🍗 Dinner:</strong> {currentDayData.dinner}</p>
            <p><strong>🥜 Snacks:</strong> {currentDayData.snacks}</p>
          </div>
        ) : (
          <p>No entry for this day</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <button onClick={prevDay}>← Prev</button>
          <button onClick={nextDay}>Next →</button>
        </div>

        <button onClick={onClose} style={{ marginTop: '1rem', background: '#e74c3c' }}>
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
        button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          background: #0D9488;
          color: white;
          cursor: pointer;
        }
        button:hover {
          background: rgb(46, 177, 166);
        }
      `}</style>
    </div>
  );
}
