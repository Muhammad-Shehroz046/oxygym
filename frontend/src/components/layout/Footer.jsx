import { FaDumbbell, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-branding">
            <div className="footer-logo">
              <FaDumbbell className="logo-icon" />
              <span>OxyGym</span>
            </div>
            <p>Transforming lives through fitness excellence since 2025. Join us on your journey to better health and peak performance.</p>
            <div className="social-icons">
              <a href="#" className="social-icon">
                <FaFacebook />
              </a>
              <a href="#" className="social-icon">
                <FaTwitter />
              </a>
              <a href="#" className="social-icon">
                <FaInstagram />
              </a>
              <a href="#" className="social-icon">
                <FaYoutube />
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/memberships">Memberships</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4>Services</h4>
              <ul>
                <li><a href="#">Personal Training</a></li>
                <li><a href="#">Group Classes</a></li>
                <li><a href="#">Nutritional Guidance</a></li>
                <li><a href="#">Fitness Assessment</a></li>
                <li><a href="#">Health Coaching</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4>Contact Info</h4>
              <ul className="contact-info">
                <li>123 Fitness Street, Gym City</li>
                <li>Phone: (123) 456-7890</li>
                <li>Email: info@oxygym.com</li>
                <li>Hours: Mon-Fri: 6am-10pm</li>
                <li>Sat-Sun: 8am-8pm</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} OxyGym.All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
      <style jsx>{`
        .footer {
          background-color: var(--dark-color);
          color: var(--gray-300);
          padding: 4rem 0 1.5rem;
          margin-top: 3rem;
        }
        
        .footer-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        
        .footer-branding {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .footer-logo {
          display: flex;
          align-items: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
        }
        
        .logo-icon {
          margin-right: 0.5rem;
          font-size: 1.8rem;
          color: var(--primary-light);
        }
        
        .social-icons {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          color: var(--light-color);
          transition: all 0.3s ease;
        }
        
        .social-icon:hover {
          background-color: var(--primary-color);
          transform: translateY(-3px);
        }
        
        .footer-links {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        
        .footer-links-column h4 {
          color: white;
          margin-bottom: 1.25rem;
          font-size: 1.1rem;
          position: relative;
        }
        
        .footer-links-column h4:after {
          content: '';
          position: absolute;
          bottom: -0.5rem;
          left: 0;
          width: 40px;
          height: 2px;
          background-color: var(--primary-color);
        }
        
        .footer-links-column ul {
          list-style: none;
        }
        
        .footer-links-column ul li {
          margin-bottom: 0.75rem;
        }
        
        .footer-links-column ul li a {
          color: var(--gray-300);
          transition: color 0.3s ease;
        }
        
        .footer-links-column ul li a:hover {
          color: var(--primary-light);
        }
        
        .contact-info li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .footer-bottom {
          border-top: 1px solid var(--gray-700);
          margin-top: 3rem;
          padding-top: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
        }
        
        .footer-bottom-links {
          display: flex;
          gap: 1.5rem;
        }
        
        .footer-bottom-links a {
          color: var(--gray-400);
          font-size: 0.9rem;
        }
        
        @media (min-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr 2fr;
          }
          
          .footer-links {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;