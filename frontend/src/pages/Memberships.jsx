import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../assets/css/Membership.css';

const Memberships = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const navigate = useNavigate();
  const { user } = useAuth();

  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for beginners starting their fitness journey',
      monthlyPrice: 29.99,
      annualPrice: 299.99,
      features: [
        'Access to gym equipment',
        'Basic fitness assessment',
        'Access to group classes',
        'Locker room access',
        'Online workout resources',
      ],
      notIncluded: [
        'Personal trainer sessions',
        'Nutrition consultation',
        'Advanced health monitoring',
        'Premium group classes'
      ],
      color: '#0d9488'
    },
    {
      name: 'Premium',
      description: 'Ideal for dedicated fitness enthusiasts',
      monthlyPrice: 49.99,
      annualPrice: 499.99,
      isPopular: true,
      features: [
        'All Basic features',
        'Personal trainer (2 sessions/month)',
        'Nutrition consultation',
        'Access to all group classes',
        'Fitness tracking app',
        'Discounted massage services'
      ],
      notIncluded: [
        'Unlimited personal training',
        'Advanced health monitoring'
      ],
      color: '#1e40af'
    },
    {
      name: 'Elite',
      description: 'The ultimate fitness experience with all perks',
      monthlyPrice: 79.99,
      annualPrice: 799.99,
      features: [
        'All Premium features',
        'Unlimited personal training',
        'Advanced health monitoring',
        'Custom nutrition plan',
        'Recovery services access',
        'Exclusive member events',
        'Guest passes (4 per month)'
      ],
      notIncluded: [],
      color: '#7c3aed'
    }
  ];

  const validateEmailBeforeTransaction = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.post(
        'http://localhost:5000/api/membership/validate-email',
        { email: user.email },
        config
      );

      console.log(response.data.message);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Only registered users can purchase a membership');
      return false;
    }
  };

  const handleGetStarted = async (plan) => {
    const isValid = await validateEmailBeforeTransaction();
    if (!isValid) return;

    const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
    const planData = {
      name: plan.name,
      price: price,
      billingPeriod: billingPeriod,
      description: plan.description
    };

    navigate('/checkout', { state: { plan: planData } });
    
  };

  return (
    <>
      <section className="memberships-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Membership Plans</h1>
            <p>Choose the right plan for your fitness journey</p>
          </div>
        </div>
      </section>

      <section className="pricing-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Simple, Transparent Pricing</h2>
            <p>No hidden fees, cancel anytime</p>

            <div className="billing-toggle">
              <span className={billingPeriod === 'monthly' ? 'active' : ''}>Monthly</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={billingPeriod === 'annual'}
                  onChange={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
                />
                <span className="slider"></span>
              </label>
              <span className={billingPeriod === 'annual' ? 'active' : ''}>
                Annual
                <span className="discount-badge">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="pricing-cards">
            {plans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.isPopular ? 'popular' : ''}`}>
                {plan.isPopular && <span className="popular-badge">Most Popular</span>}

                <div className="plan-header" style={{ backgroundColor: plan.color }}>
                  <h3>{plan.name}</h3>
                  <p>{plan.description}</p>
                  <div className="plan-price">
                    <span className="currency">$</span>
                    <span className="amount">
                      {billingPeriod === 'monthly'
                        ? Math.floor(plan.monthlyPrice)
                        : Math.floor(plan.annualPrice / 12)}
                    </span>
                    <span className="decimals">
                      {billingPeriod === 'monthly'
                        ? (plan.monthlyPrice % 1).toFixed(2).substring(1)
                        : ((plan.annualPrice / 12) % 1).toFixed(2).substring(1)}
                    </span>
                    <span className="period">/ month</span>
                  </div>
                  {billingPeriod === 'annual' && (
                    <div className="annual-price">
                      ${plan.annualPrice} billed annually
                    </div>
                  )}
                </div>

                <div className="plan-features">
                  <ul>
                    {plan.features.map((feature, i) => (
                      <li key={i} className="included">
                        <FaCheck className="check-icon" /> {feature}
                      </li>
                    ))}
                    {plan.notIncluded.map((feature, i) => (
                      <li key={i} className="not-included">
                        <FaTimes className="times-icon" /> {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="plan-footer">
                  <button
                    onClick={() => handleGetStarted(plan)}
                    className="btn btn-primary btn-block"
                  >
                    Get Started <FaArrowRight className="btn-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Memberships;
