// components/DietPlanModal.jsx
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DietPlanModal = ({ memberId, category, onClose }) => {
  const { token } = useAuth();
  const [dietPlan, setDietPlan] = useState(
    daysOfWeek.map(day => ({
      day,
      breakfast: "",
      lunch: "",
      dinner: "",
      snacks: ""
    }))
  );

  const handleChange = (index, field, value) => {
    const updatedPlan = [...dietPlan];
    updatedPlan[index][field] = value;
    setDietPlan(updatedPlan);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/diet-plans`,
        {
          memberId,
          category,
          dietPlan
        },
      
      );
      toast.success("Diet plan saved!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save diet plan");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Create Weekly Diet Plan</h2>
      {dietPlan.map((dayPlan, index) => (
        <div key={dayPlan.day} className="mb-4 border p-2 rounded">
          <h3 className="text-lg font-medium mb-2">{dayPlan.day}</h3>
          {["breakfast", "lunch", "dinner", "snacks"].map(meal => (
            <input
              key={meal}
              type="text"
              placeholder={`${meal.charAt(0).toUpperCase() + meal.slice(1)}`}
              className="block w-full p-2 mb-2 border rounded"
              value={dayPlan[meal]}
              onChange={e => handleChange(index, meal, e.target.value)}
            />
          ))}
        </div>
      ))}
      
      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Save Diet Plan
      </button>
      <button onClick={onClose} style={{ marginTop: '1rem', marginLeft:'10px', background: '#e74c3c' }}>
          Close
        </button>
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
};

export default DietPlanModal;
