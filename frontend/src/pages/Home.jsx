import { Link } from 'react-router-dom';
import { FaDumbbell, FaHeartbeat, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import TrainerSelection from '../pages/user/TrainerSelection'
import OxygymCarousel from './user/GymImages'
import TrainerCards from './user/Gymtripic';

TrainerCards
const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Transform Your Body, Transform Your Life</h1>
          <p>Join OxyGym today and start your journey to a healthier, stronger you.</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">
              Join Now
            </Link>
            <Link to="/about" className="btn btn-outline btn-lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose OxyGym?</h2>
            <p>We offer a complete fitness experience tailored to your needs</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaDumbbell />
              </div>
              <h3>Modern Equipment</h3>
              <p>State-of-the-art facilities with the latest fitness technology and equipment.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3>Expert Trainers</h3>
              <p>Professional trainers dedicated to helping you achieve your fitness goals.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaCalendarAlt />
              </div>
              <h3>Flexible Plans</h3>
              <p>Choose from various membership plans that fit your schedule and budget.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaHeartbeat />
              </div>
              <h3>Health Monitoring</h3>
              <p>Track your progress with detailed health and fitness metrics.</p>
            </div>
          </div>
        </div>
      </section>
      <TrainerCards />
      <OxygymCarousel />
      
      {/* Call to Action */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Fitness Journey?</h2>
            <p>Join OxyGym today and get access to our expert trainers, world-class facilities, and personalized fitness programs.</p>
            <Link to="/register" className="btn btn-accent btn-lg">
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .hero {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                      url('https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
          background-size: cover;
          background-position: center;
          color: white;
          padding: 2rem 1rem;
          text-align: center;
        }
        
        .hero-content {
          max-width: 800px;
        }
        
        .hero h1 {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          font-weight: 700;
          line-height: 1.2;
          animation: fadeInDown 1s ease;
        }
        
        .hero p {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          animation: fadeInUp 1s ease 0.2s;
          animation-fill-mode: both;
        }
        
        .hero-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          animation: fadeInUp 1s ease 0.4s;
          animation-fill-mode: both;
        }
        
        .btn-lg {
          padding: 0.8rem 2rem;
          font-size: 1.1rem;
        }
        
        .features {
          padding: 5rem 0;
          background-color: var(--light-color);
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .section-header h2 {
          font-size: 2.5rem;
          color: var(--dark-color);
          margin-bottom: 0.5rem;
        }
        
        .section-header p {
          font-size: 1.1rem;
          color: var(--gray-600);
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }
        
        .feature-card {
          background-color: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: var(--box-shadow);
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
          font-size: 2.5rem;
          color: var(--primary-color);
          margin-bottom: 1.5rem;
          height: 70px;
          width: 70px;
          background-color: var(--gray-100);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin-inline: auto;
          transition: all 0.3s ease;
        }
        
        .feature-card:hover .feature-icon {
          background-color: var(--primary-color);
          color: white;
          transform: rotateY(180deg);
        }
        
        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--dark-color);
        }
        
        .feature-card p {
          color: var(--gray-600);
        }
        
        .cta {
          padding: 5rem 0;
          background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
                      url('https://images.pexels.com/photos/136405/pexels-photo-136405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          color: white;
          text-align: center;
        }
        
        .cta-content {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .cta h2 {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
        }
        
        .cta p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          color: var(--gray-300);
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2.2rem;
          }
          
          .hero p {
            font-size: 1.1rem;
          }
          
          .hero-buttons {
            flex-direction: column;
          }
          
          .features, .cta {
            padding: 3rem 0;
          }
        }
      `}</style>
    </>
  );
};

export default Home;