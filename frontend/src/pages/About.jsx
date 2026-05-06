import { FaDumbbell, FaHistory, FaUsers, FaTrophy, FaBullseye } from 'react-icons/fa';

const About = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <h1>About OxyGym</h1>
            <p>Where fitness meets community and results meet expectations</p>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <div className="section-header">
                <h2>Our Story</h2>
              </div>
              <p>
                Founded in 2025, OxyGym was born from a passion for fitness and a desire to create a gym environment where everyone feels welcome, motivated, and empowered to achieve their health and fitness goals.
              </p>
              <p>
                What started as a small local gym has grown into a thriving fitness community, dedicated to providing top-quality equipment, expert guidance, and a supportive atmosphere for members of all fitness levels.
              </p>
              <p>
                Our mission is simple: to transform lives through fitness. We believe that physical wellness leads to improved mental health, increased confidence, and overall life satisfaction. That's why we're committed to helping each member on their unique fitness journey.
              </p>
            </div>
            <div className="about-image">
              <img src="https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="FitZone Gym Interior" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Our Core Values</h2>
            <p>The principles that guide everything we do</p>
          </div>
          
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <FaUsers />
              </div>
              <h3>Community</h3>
              <p>We foster a supportive environment where members motivate each other and build lasting connections.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <FaTrophy />
              </div>
              <h3>Excellence</h3>
              <p>We strive for excellence in our facilities, training programs, and customer service.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <FaBullseye />
              </div>
              <h3>Results</h3>
              <p>We're dedicated to helping our members achieve real, sustainable results in their fitness journey.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      {/* <section className="team-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Our Leadership Team</h2>
            <p>Meet the people driving FitZone's mission forward</p>
          </div>
          
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Muzamil" />
              </div>
              <h3>Muzamil Sohail</h3>
              <p className="member-role">Founder & CEO</p>
              <p>Professional fitness trainer with 15+ years of experience and a passion for transforming lives.</p>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Jane Smith" />
              </div>
              <h3>Jane Smith</h3>
              <p className="member-role">Head of Training</p>
              <p>Certified nutritionist and fitness expert with a specialized focus on holistic wellness.</p>
            </div>
            
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Mike Johnson" />
              </div>
              <h3>Mike Johnson</h3>
              <p className="member-role">Operations Director</p>
              <p>Former professional athlete bringing operational excellence and high standards to our facilities.</p>
            </div>
          </div>
        </div>
      </section> */}
      
      <style jsx>{`
        .about-hero {
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                      url('https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
          background-size: cover;
          background-position: center;
          color: white;
          text-align: center;
          padding: 3rem 1rem;
        }
        
        .about-hero-content h1 {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          animation: fadeInDown 1s ease;
        }
        
        .about-hero-content p {
          font-size: 1.5rem;
          max-width: 700px;
          margin: 0 auto;
          animation: fadeInUp 1s ease 0.2s;
          animation-fill-mode: both;
        }
        
        .about-section {
          padding: 5rem 0;
        }
        
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }
        
        .about-content h2 {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          position: relative;
          display: inline-block;
        }
        
        .about-content h2:after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -10px;
          width: 80px;
          height: 4px;
          background-color: var(--primary-color);
        }
        
        .about-content p {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--gray-700);
        }
        
        .about-image {
          overflow: hidden;
          border-radius: 8px;
          box-shadow: var(--box-shadow);
        }
        
        .about-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .about-image:hover img {
          transform: scale(1.05);
        }
        
        .values-section {
          padding: 5rem 0;
          background-color: var(--gray-100);
        }
        
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }
        
        .value-card {
          background-color: white;
          padding: 2.5rem 2rem;
          border-radius: 8px;
          box-shadow: var(--box-shadow);
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .value-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .value-icon {
          font-size: 2.5rem;
          color: var(--primary-color);
          margin-bottom: 1.5rem;
          height: 80px;
          width: 80px;
          background-color: var(--gray-100);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin-inline: auto;
          transition: all 0.3s ease;
        }
        
        .value-card:hover .value-icon {
          background-color: var(--primary-color);
          color: white;
          transform: rotate(360deg);
        }
        
        .value-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--dark-color);
        }
        
        .value-card p {
          color: var(--gray-600);
        }
        
        .team-section {
          padding: 5rem 0;
        }
        
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
          margin-top: 3rem;
        }
        
        .team-member {
          background-color: white;
          border-radius: 8px;
          box-shadow: var(--box-shadow);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .team-member:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .member-image {
          height: 280px;
          overflow: hidden;
        }
        
        .member-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .team-member:hover .member-image img {
          transform: scale(1.1);
        }
        
        .team-member h3 {
          padding: 1.5rem 1.5rem 0.5rem;
          font-size: 1.5rem;
        }
        
        .member-role {
          padding: 0 1.5rem 0.5rem;
          color: var(--primary-color);
          font-weight: 600;
        }
        
        .team-member p:not(.member-role) {
          padding: 0 1.5rem 1.5rem;
          color: var(--gray-600);
        }
        
        @media (max-width: 768px) {
          .about-hero-content h1 {
            font-size: 2.5rem;
          }
          
          .about-hero-content p {
            font-size: 1.2rem;
          }
          
          .about-grid {
            grid-template-columns: 1fr;
          }
          
          .about-image {
            order: -1;
          }
        }
      `}</style>
    </>
  );
};

export default About;