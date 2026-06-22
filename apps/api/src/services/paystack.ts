import { registerProvider } from './payments';

const isDev = process.env.NODE_ENV !== 'production';

async function verifyPayment(reference: string, accessToken: string) {
  const url = `https://api.paystack.co/transaction/verify/${reference}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) throw new Error('Failed to verify payment');
  return res.json();
}

registerProvider('paystack', {
  async initiate(req: any) {
    if (isDev) {
      // Dev mock
      return {
        status: 'pending',
        provider: 'paystack',
        providerId: `paystack-mock-${Date.now()}`,
        authorizationUrl: 'https://checkout.paystack.com/mock?reference=' + Date.now()
      };
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) throw new Error('PAYSTACK_SECRET_KEY not set');

    const callbackUrl = process.env.PAYSTACK_CALLBACK_URL || 'https://example.com/webhooks/paystack';
    const reference = `${req.reference}-${Date.now()}`;

    const payload = {
      email: req.phone || 'customer@example.com',
      amount: req.amount * 100, // Paystack expects amount in cents
      currency: req.currency || 'KES',
      reference,
      callback_url: callbackUrl,
      metadata: {
        orderId: req.reference,
        phone: req.phone
      }
    };

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error('Paystack init failed: ' + txt);
    }

    const body = await res.json();
    if (!body.status) throw new Error('Paystack returned error: ' + body.message);

    return {
      status: 'pending',
      provider: 'paystack',
      providerId: body.data.reference,
      authorizationUrl: body.data.authorization_url,
      accessCode: body.data.access_code
    };
  },

  async status(providerId: string) {
    if (isDev) return { status: 'paid', provider: 'paystack' };

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) throw new Error('PAYSTACK_SECRET_KEY not set');

    const body = await verifyPayment(providerId, secretKey);
    if (!body.data) return { status: 'pending', provider: 'paystack' };

    const paymentStatus = body.data.status === 'success' ? 'paid' : 'pending';
    return { status: paymentStatus, provider: 'paystack', data: body.data };
  }
});
