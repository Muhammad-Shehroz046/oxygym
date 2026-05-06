import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaTimes, FaDumbbell, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <FaDumbbell className="logo-icon" />
          <span>OxyGym</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
            <Link to="/page" className="nav-link" onClick={closeMenu}>page</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link" onClick={closeMenu}>About Us</Link>
          </li>
          <li className="nav-item">
            <Link to="/memberships" className="nav-link" onClick={closeMenu}>Memberships</Link>
          </li>

          {isAuthenticated ? (
            <>
              <li className="nav-item dashboard-link">
                <Link
                  to={
                    user.role === 'admin'
                      ? '/admin/dashboard'
                      : user.role === 'trainer'
                      ? '/trainer/dashboard'
                      : '/user/dashboard'
                  }
                  className="nav-link"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <div className="user-info">
                  <FaUser className="user-icon" />
                  <span>{user.name}</span>
                </div>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="btn btn-outline" onClick={closeMenu}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <style jsx>{`
        .navbar {
          background-color: var(--dark-color);
          color: white;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
        }
        
        .nav-logo {
          display: flex;
          align-items: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          text-decoration: none;
        }
        
        .logo-icon {
          margin-right: 0.5rem;
          font-size: 1.8rem;
          color: var(--primary-light);
        }
        
        .nav-menu {
          display: flex;
          align-items: center;
          list-style: none;
          gap: 1.5rem;
        }
        
        .nav-link {
          color: white;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        
        .nav-link:hover {
          color: var(--primary-light);
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        .user-icon {
          font-size: 1rem;
          color: var(--primary-light);
        }
        
        .logout-btn {
          background: transparent;
          border: 1px solid var(--primary-light);
          color: white;
        }
        
        .logout-btn:hover {
          background-color: var(--primary-light);
        }
        
        .menu-icon {
          display: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: white;
        }
        
        @media (max-width: 768px) {
          .menu-icon {
            display: block;
            z-index: 10;
          }
          
          .nav-menu {
            position: fixed;
            top: 0;
            right: -100%;
            flex-direction: column;
            justify-content: flex-start;
            background-color: var(--dark-color);
            width: 80%;
            height: 100vh;
            padding-top: 5rem;
            transition: 0.4s;
            box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
          }
          
          .nav-menu.active {
            right: 0;
          }
          
          .nav-item {
            margin: 1rem 0;
            width: 100%;
            text-align: center;
          }
          
          .logout-btn, .btn {
            width: 80%;
            margin: 0 auto;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;