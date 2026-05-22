  import { useState, useEffect } from 'react';
  import { Link, useNavigate, useParams } from 'react-router-dom';
  import { toast } from 'react-toastify';
  import { useAuth } from '../../context/AuthContext';
  import { FaUser, FaEnvelope, FaLock, FaDumbbell, FaPhone } from 'react-icons/fa';

  const Register = () => {
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
    const { role } = useParams();
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '' // ✅ Added phone number state
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const { name, email, password, confirmPassword, phone } = formData; // ✅ Destructuring phone

    useEffect(() => {
      if (role !== 'user' && role !== 'trainer' && role !== 'admin') {
        navigate('/register');
      }
    }, [role, navigate]);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (password !== confirmPassword) {
        return toast.error('Passwords do not match');
      }

      if (password.length < 6) {
        return toast.error('Password must be at least 6 characters');
      }

      try {
        setLoading(true);

        const userData = await register({
          name,
          email,
          password,
          phone,
          role
        });

        if (userData.pending) {
          toast.success('Registration submitted! Your account is pending admin approval. You can login once approved.');
          navigate('/login');
          return;
        }

        toast.success(`Registration successful as ${role}!`);

        if (userData.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (userData.role === 'trainer') {
          navigate('/trainer/dashboard');
        } else {
          navigate('/user/select-trainer');
        }
      } catch (error) {
        toast.error(error.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const getRoleName = () => {
      if (role === 'user') return 'Member';
      if (role === 'trainer') return 'Trainer';
      return 'Admin';
    };

    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <FaDumbbell className="auth-logo" />
            <h2>Register as {getRoleName()}</h2>
            <p>Create your OxyGym account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <FaUser className="input-icon" /> Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <FaEnvelope className="input-icon" /> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <FaLock className="input-icon" /> Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <FaLock className="input-icon" /> Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                <FaPhone className="input-icon" /> Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="form-control"
                value={phone}
                onChange={handleChange}
                placeholder="+92300XXXXXXX"
                required
                minLength="12"
              />
            </div>

            <button
              type="submit"
              className={`btn btn-block ${
                role === 'user'
                  ? 'btn-primary'
                  : role === 'trainer'
                  ? 'btn-secondary'
                  : 'btn-accent'
              }`}
              disabled={loading}
            >
              {loading ? 'Registering...' : `Register as ${getRoleName()}`}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Login
              </Link>
            </p>
            {role !== 'user' && (
              <p>
                Register as a member instead?{' '}
                <Link to="/register/user" className="auth-link">
                  Member Registration
                </Link>
              </p>
            )}
          </div>
        </div>
        <style jsx>{`
          .auth-container {
            min-height: calc(100vh - 70px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
            background: linear-gradient(135deg, var(--dark-color) 0%, var(--gray-800) 100%);
          }

          .auth-card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
            width: 100%;
            max-width: 500px;
            overflow: hidden;
            transition: transform 0.3s ease;
          }

          .auth-header {
            background: ${
              role === 'user'
                ? 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)'
                : role === 'trainer'
                ? 'linear-gradient(135deg, var(--secondary-color) 0%, var(--secondary-dark) 100%)'
                : 'linear-gradient(135deg, var(--accent-color) 0%, #ea580c 100%)'
            };
            color: white;
            padding: 2rem;
            text-align: center;
          }

          .auth-logo {
            font-size: 3rem;
            margin-bottom: 1rem;
            animation: pulse 2s infinite;
          }

          .auth-form {
            padding: 2rem;
          }

          .auth-footer {
            padding: 1.5rem 2rem;
            text-align: center;
            background-color: var(--gray-100);
            border-top: 1px solid var(--gray-200);
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
        `}</style>
      </div>
    );
  };

  export default Register;
