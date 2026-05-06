import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaUserAlt, FaWeight, FaRuler, FaBullseye, FaNotesMedical } from 'react-icons/fa';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    fitnessGoal: '',
    medicalConditions: ['']
  });
  const [loading, setLoading] = useState(false);
  
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const { age, height, weight, fitnessGoal, medicalConditions } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleMedicalConditionChange = (index, value) => {
    const updatedConditions = [...medicalConditions];
    updatedConditions[index] = value;
    setFormData({ ...formData, medicalConditions: updatedConditions });
  };
  
  const addMedicalCondition = () => {
    setFormData({
      ...formData,
      medicalConditions: [...medicalConditions, '']
    });
  };
  
  const removeMedicalCondition = (index) => {
    const updatedConditions = [...medicalConditions];
    updatedConditions.splice(index, 1);
    setFormData({ ...formData, medicalConditions: updatedConditions });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!age || !height || !weight || !fitnessGoal) {
      return toast.error('Please fill all required fields');
    }
    
    // Filter out empty medical conditions
    const filteredConditions = medicalConditions.filter((condition) => condition.trim() !== '');
    
    try {
      setLoading(true);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const { data } = await axios.put(
        'http://localhost:5000/api/users/profile',
        {
          ...formData,
          medicalConditions: filteredConditions
        },
        config
      );
      
      updateProfile(data);
      toast.success('Profile updated successfully!');
      navigate('/user/dashboard');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="profile-form-container">
      <div className="container">
        <div className="profile-form-card">
          <div className="profile-form-header">
            <h1>Complete Your Profile</h1>
            <p>Please provide your physical details to help us customize your fitness experience</p>
          </div>
          
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="age" className="form-label">
                  <FaUserAlt className="form-icon" /> Age (years)
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  className="form-control"
                  value={age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  min="16"
                  max="100"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="height" className="form-label">
                  <FaRuler className="form-icon" /> Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  className="form-control"
                  value={height}
                  onChange={handleChange}
                  placeholder="Enter your height"
                  min="100"
                  max="250"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="weight" className="form-label">
                  <FaWeight className="form-icon" /> Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  className="form-control"
                  value={weight}
                  onChange={handleChange}
                  placeholder="Enter your weight"
                  min="30"
                  max="300"
                  required
                />
              </div>
              
              <div className="form-group span-2">
                <label htmlFor="fitnessGoal" className="form-label">
                  <FaBullseye className="form-icon" /> Fitness Goal
                </label>
                <select
                  id="fitnessGoal"
                  name="fitnessGoal"
                  className="form-control"
                  value={fitnessGoal}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your primary goal</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Improved Fitness">Improved Fitness</option>
                  <option value="Strength Building">Strength Building</option>
                  <option value="Endurance Training">Endurance Training</option>
                  <option value="Flexibility & Mobility">Flexibility & Mobility</option>
                </select>
              </div>
            </div>
            
            <div className="form-group medical-conditions">
              <label className="form-label">
                <FaNotesMedical className="form-icon" /> Medical Conditions (if any)
              </label>
              
              {medicalConditions.map((condition, index) => (
                <div key={index} className="condition-input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={condition}
                    onChange={(e) => handleMedicalConditionChange(index, e.target.value)}
                    placeholder="Enter medical condition (e.g., asthma, diabetes)"
                  />
                  
                  <button
                    type="button"
                    className="btn-icon-remove"
                    onClick={() => removeMedicalCondition(index)}
                    disabled={medicalConditions.length === 1}
                  >
                    -
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                className="btn btn-outline btn-sm add-condition-btn"
                onClick={addMedicalCondition}
              >
                + Add Another Condition
              </button>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Saving...' : 'Complete Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <style jsx>{`
        .profile-form-container {
          padding: 4rem 0;
          min-height: calc(100vh - 70px - 400px);
          background-color: var(--gray-100);
        }
        
        .profile-form-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: var(--box-shadow);
          overflow: hidden;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .profile-form-header {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
          color: white;
          padding: 2rem;
          text-align: center;
        }
        
        .profile-form-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        
        .profile-form {
          padding: 2rem;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .span-2 {
          grid-column: span 2;
        }
        
        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .form-icon {
          color: var(--primary-color);
        }
        
        .medical-conditions {
          margin-bottom: 2rem;
        }
        
        .condition-input-group {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        
        .btn-icon-remove {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--gray-300);
          background-color: white;
          color: var(--danger-color);
          cursor: pointer;
          font-size: 1.5rem;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        
        .btn-icon-remove:hover:not(:disabled) {
          background-color: var(--danger-color);
          color: white;
        }
        
        .btn-icon-remove:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .add-condition-btn {
          margin-top: 0.5rem;
        }
        
        .btn-sm {
          padding: 0.4rem 1rem;
          font-size: 0.9rem;
        }
        
        .form-actions {
          display: flex;
          justify-content: center;
        }
        
        .btn-lg {
          padding: 0.8rem 2.5rem;
          font-size: 1.1rem;
        }
        
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .span-2 {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileForm;