import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { chargerName, potencia, horaInicio, horaFin, precioTotal, customerEmail, customerName } = req.body;

  const precioCentimos = Math.round(precioTotal * 100);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Carga EV - ${chargerName}`,
              description: `${horaInicio} - ${horaFin} | ${potencia} kW`
            },
            unit_amount: precioCentimos
          },
          quantity: 1
        }
      ],
      customer_email: customerEmail,
      metadata: {
        customerName: customerName,
        chargerName: chargerName,
        horaInicio: horaInicio,
        horaFin: horaFin,
        potencia: String(potencia)
      },
      success_url: `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:5173'}/cargadores?success=true`,
      cancel_url: `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:5173'}/cargadores?canceled=true`
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear pago' });
  }
}
