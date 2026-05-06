
import { FaUserAlt, FaUserTie, FaDumbbell } from 'react-icons/fa';
import {useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';

const RegisterOptions = () => {
    const navigate = useNavigate();
    useEffect(()=>{
      let token = JSON.parse(localStorage.getItem('user'))
      if(token){
        if(token.role == 'trainer'){
          navigate('/trainer/dashboard')
        }
        else if(token.role == 'user') {
          navigate('/user/dashboard')
        }
      };
  
    },[])
  return (
    <div className="register-options-container">
      <div className="register-options-header">
        <FaDumbbell className="register-logo" />
        <h2>Join OxyGym</h2>
        <p>Choose how you want to register</p>
      </div>
      
      <div className="options-container">
        <Link to="/register/user" className="option-card">
          <div className="option-icon">
            <FaUserAlt />
          </div>
          <h3>Register as Member</h3>
          <p>Join as a gym member to access workouts, select trainers, and track your fitness journey</p>
          <button className="btn btn-primary">Join as Member</button>
        </Link>
        
        <Link to="/register/trainer" className="option-card">
          <div className="option-icon">
            <FaUserTie />
          </div>
          <h3>Register as Trainer</h3>
          <p>Join as a fitness professional to offer your training services to gym members</p>
          <button className="btn btn-secondary">Join as Trainer</button>
        </Link>
      </div>
      
      <div className="register-options-footer">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Login here
          </Link>
        </p>
      </div>
      <style jsx>{`
        .register-options-container {
          min-height: calc(100vh - 70px);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3rem 1rem;
          background: linear-gradient(135deg, var(--dark-color) 0%, var(--gray-800) 100%);
        }
        
        .register-options-header {
          text-align: center;
          color: white;
          margin-bottom: 3rem;
        }
        
        .register-logo {
          font-size: 3.5rem;
          color: var(--primary-light);
          margin-bottom: 1rem;
          animation: pulse 2s infinite;
        }
        
        .options-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          width: 100%;
          max-width: 900px;
        }
        
        .option-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 2.5rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-decoration: none;
          color: var(--gray-800);
        }
        
        .option-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }
        
        .option-icon {
          font-size: 2.5rem;
          height: 80px;
          width: 80px;
          background-color: var(--gray-100);
          color: var(--primary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
        }
        
        .option-card:hover .option-icon {
          background-color: var(--primary-color);
          color: white;
        }
        
        .option-card h3 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        
        .option-card p {
          margin-bottom: 2rem;
          color: var(--gray-600);
          flex-grow: 1;
        }
        
        .option-card .btn {
          width: 100%;
        }
        
        .register-options-footer {
          margin-top: 3rem;
          text-align: center;
          color: white;
        }
        
        .auth-link {
          color: var(--primary-light);
          font-weight: 600;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @media (max-width: 768px) {
          .options-container {
            grid-template-columns: 1fr;
            max-width: 400px;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterOptions;