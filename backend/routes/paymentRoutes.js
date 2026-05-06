import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, planName, billingPeriod, customerInfo } = req.body;

    // Validate required fields
    if (!amount || !currency || !planName || !customerInfo?.name || !customerInfo?.email) {
      return res.status(400).json({ 
        error: 'Missing required fields: amount, currency, planName, and customer info are required' 
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: currency,
      metadata: {
        planName: planName,
        billingPeriod: billingPeriod,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone || 'Not provided'
      },
      receipt_email: customerInfo.email,
      description: `${planName} Membership - ${billingPeriod} billing`
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      error: 'Unable to create payment intent. Please try again.' 
    });
  }
});

// Webhook to handle Stripe events (optional but recommended)
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        customer: paymentIntent.metadata.customerEmail,
        plan: paymentIntent.metadata.planName
      });
      
      // Here you can add logic to:
      // - Send confirmation email
      // - Update user membership status
      // - Log the successful payment
      
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', {
        id: failedPayment.id,
        error: failedPayment.last_payment_error?.message
      });
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Get payment status (optional)
router.get('/payment-status/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata
    });
    
  } catch (error) {
    console.error('Error retrieving payment status:', error);
    res.status(500).json({ 
      error: 'Unable to retrieve payment status' 
    });
  }
});

export default router;