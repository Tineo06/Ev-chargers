import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

app.post('/create-checkout-session', async (req, res) => {
  const { charger, customerEmail, customerName } = req.body;
  try {
    const productName = (charger && (charger.nom || charger.name)) || 'Reserva de carga';
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: `Reserva - ${productName}` },
            unit_amount: 500,
          },
          quantity: 1,
        },
      ],
      customer_email: customerEmail || undefined,
      metadata: {
        customerName: customerName || '',
        charger: JSON.stringify(charger || {}),
      },
      success_url: process.env.SUCCESS_URL || 'http://localhost:5173/cargadores?success=true',
      cancel_url: process.env.CANCEL_URL || 'http://localhost:5173/cargadores?canceled=true',
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

const port = process.env.PORT || 4242;
app.listen(port, () => console.log(`Stripe server listening on http://localhost:${port}`));
