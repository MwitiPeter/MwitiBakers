import { registerProvider } from './payments';

const isDev = process.env.NODE_ENV !== 'production';

async function getAccessToken() {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  if (!key || !secret) throw new Error('MPESA credentials not set');

  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  const url = process.env.MPESA_OAUTH_URL || 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
  if (!res.ok) throw new Error('Failed to get access token from Daraja');
  const body = await res.json();
  return body.access_token;
}

async function stkPush({ amount, phone, reference }: any) {
  const token = await getAccessToken();
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  if (!shortcode || !passkey) throw new Error('Daraja shortcode/passkey missing');

  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
  const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

  const url = process.env.MPESA_STK_PUSH_URL || 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phone,
    PartyB: shortcode,
    PhoneNumber: phone,
    CallBackURL: process.env.MPESA_CALLBACK_URL || 'https://example.com/mpesa/callback',
    AccountReference: reference,
    TransactionDesc: 'Mwiti Bakers order payment'
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error('STK push failed: ' + txt);
  }
  return res.json();
}

registerProvider('daraja', {
  async initiate(req: any) {
    if (isDev) {
      return {
        status: 'pending',
        provider: 'daraja',
        providerId: `daraja-mock-${Date.now()}`
      };
    }
    // In production use Daraja STK push
    const result = await stkPush(req);
    return { status: 'pending', provider: 'daraja', providerId: result.CheckoutRequestID || result.CustomerMessage || String(Date.now()) };
  },
  async status(_providerId: string) {
    if (isDev) return { status: 'paid', provider: 'daraja' };
    // Implement status check if Daraja provides one, otherwise rely on callback webhooks
    return { status: 'pending', provider: 'daraja' };
  }
});
