import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL, STRIPE_PUBLISHABLE_KEY } from '../config';


const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);


const CheckoutForm = ({ plan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment intent on backend
      const response = await fetch(`${API_BASE_URL}/api/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(plan.price * 100), // Convert to cents
          currency: 'usd',
          planName: plan.name,
          billingPeriod: plan.billingPeriod,
          customerInfo: customerInfo
        }),
      });

      const { clientSecret, error: backendError } = await response.json();

      if (backendError) {
        setError(backendError);
        setLoading(false);
        return;
      }

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: customerInfo.name,
              email: customerInfo.email,
              phone: customerInfo.phone
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Save membership record
        try {
          await fetch(`${API_BASE_URL}/api/membership-records`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user?.token}`
            },
            body: JSON.stringify({
              planName: plan.name,
              billingPeriod: plan.billingPeriod,
              amount: plan.price,
              stripePaymentIntentId: paymentIntent.id,
              userName: customerInfo.name,
              userEmail: customerInfo.email,
              userPhone: customerInfo.phone
            })
          });
        } catch (recordErr) {
          console.error('Failed to save membership record:', recordErr);
        }
        alert('Payment successful! Welcome to your new membership!');
        navigate('/user/profile-form');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Payment error:', err);
    }

    setLoading(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Order Summary</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>{plan.name} Plan</h3>
            <p>{plan.description}</p>
            <p>Billing: {plan.billingPeriod}</p>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            ${plan.price}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <h3>Customer Information</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Full Name *</label>
            <input
              type="text"
              name="name"
              value={customerInfo.name}
              onChange={handleInputChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email *</label>
            <input
              type="email"
              name="email"
              value={customerInfo.email}
              onChange={handleInputChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={customerInfo.phone}
              onChange={handleInputChange}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Payment Information</h3>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '4px', 
            padding: '10px',
            backgroundColor: 'white'
          }}>
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div style={{ 
            color: '#d32f2f', 
            backgroundColor: '#ffebee', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '20px' 
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Processing...' : `Pay $${plan.price}`}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
        <p>🔒 Your payment information is secured by Stripe</p>
      </div>
    </div>
  );
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan;

  if (!plan) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>No plan selected</h2>
        <p>Please go back and select a membership plan.</p>
        <button 
          onClick={() => navigate('/memberships')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Memberships
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Complete Your Membership</h1>
        <p>Secure checkout powered by Stripe</p>
      </div>
      
      <Elements stripe={stripePromise}>
        <CheckoutForm plan={plan} />
      </Elements>
    </div>
  );
};

export default Checkout;