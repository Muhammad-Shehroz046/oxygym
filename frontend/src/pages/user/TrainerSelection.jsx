import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaStar, FaUserTie } from 'react-icons/fa';

const TrainerSelection = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get('http://localhost:5000/api/users/trainers', config);
        setTrainers(data);
      } catch (error) {
        toast.error('Failed to fetch trainers');
        console.error('Error fetching trainers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, [user.token]);

  const handleTrainerSelect = (trainerId) => {
    setSelectedTrainer(trainerId);
  };

  const handleContinue = async () => {
    if (!selectedTrainer) {
      return toast.error('Please select a trainer to continue');
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        'http://localhost:5000/api/users/select-trainer',
        { trainerId: selectedTrainer },
        config
      );

      updateProfile(data);
      toast.success('Trainer selected successfully!');
      navigate('/memberships');
    } catch (error) {
      toast.error('Failed to select trainer');
      console.error('Error selecting trainer:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading trainers...</p>
      </div>
    );
  }

  return (
    <div className="trainer-selection-container">
      <div className="container">
        <div className="selection-header">
          <h1>Choose Your Fitness Trainer</h1>
          <p>Select a trainer who will guide you through your fitness journey</p>
        </div>

        {trainers.length === 0 ? (
          <div className="no-trainers-message">
            <FaUserTie className="icon" />
            <h3>No trainers available</h3>
            <p>Please check back later or contact administration</p>
          </div>
        ) : (
          <>
            <div className="trainers-grid">
              {trainers.map((trainer) => (
                <div
                  key={trainer._id}
                  className={`trainer-card ${selectedTrainer === trainer._id ? 'selected' : ''}`}
                  onClick={() => handleTrainerSelect(trainer._id)}
                >
                  <div className="trainer-image">
                    <img src={`https://images.pexels.com/photos/${1000000 + parseInt(trainer._id.substring(0, 6), 16) % 1000}/pexels-photo-${1000000 + parseInt(trainer._id.substring(0, 6), 16) % 1000}.jpeg?auto=compress&cs=tinysrgb&w=600`} alt={trainer.name} />
                    {selectedTrainer === trainer._id && (
                      <div className="selected-badge">Selected</div>
                    )}
                  </div>
                  <div className="trainer-info">
                    <h3>{trainer.name}</h3>
                    <div className="trainer-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="star-icon" />
                      ))}
                      <span>5.0</span>
                    </div>
                    <p className="trainer-specialties">
                      Specialties: Weight Loss, Strength Training, Nutrition
                    </p>
                    <p className="trainer-exp">5+ years of experience</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="action-buttons">
              <button className="btn btn-primary btn-lg" onClick={handleContinue}>
                Continue with Selected Trainer
              </button>
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        .trainer-selection-container {
          padding: 4rem 0;
          min-height: calc(100vh - 70px - 400px);
        }
        
        .selection-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .selection-header h1 {
          font-size: 2.5rem;
          color: var(--dark-color);
          margin-bottom: 0.5rem;
        }
        
        .selection-header p {
          font-size: 1.2rem;
          color: var(--gray-600);
          max-width: 700px;
          margin: 0 auto;
        }
        
        .trainers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }
        
        .trainer-card {
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: var(--box-shadow);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .trainer-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .trainer-card.selected {
          border: 3px solid var(--primary-color);
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }
        
        .trainer-image {
          height: 250px;
          overflow: hidden;
          position: relative;
        }
        
        .trainer-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .trainer-card:hover .trainer-image img {
          transform: scale(1.05);
        }
        
        .selected-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background-color: var(--primary-color);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 999px;
          font-weight: 600;
          font-size: 0.8rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .trainer-info {
          padding: 1.5rem;
        }
        
        .trainer-info h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--dark-color);
        }
        
        .trainer-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }
        
        .star-icon {
          color: #fbbf24;
        }
        
        .trainer-specialties {
          font-size: 0.9rem;
          color: var(--gray-700);
          margin-bottom: 0.5rem;
        }
        
        .trainer-exp {
          font-size: 0.9rem;
          color: var(--gray-600);
        }
        
        .action-buttons {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
        }
        
        .no-trainers-message {
          text-align: center;
          padding: 3rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: var(--box-shadow);
        }
        
        .no-trainers-message .icon {
          font-size: 3rem;
          color: var(--gray-400);
          margin-bottom: 1rem;
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

export default TrainerSelection;