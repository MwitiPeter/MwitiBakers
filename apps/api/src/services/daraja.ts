import { registerProvider } from './payments';

const isDev = process.env.NODE_ENV !== 'production';

registerProvider('daraja', {
  async initiate(req: any) {
    if (isDev) {
      return {
        status: 'pending',
        provider: 'daraja',
        providerId: `daraja-mock-${Date.now()}`
      };
    }
    // Real Daraja integration would go here using MPESA_CONSUMER_KEY etc.
    throw new Error('Daraja not implemented yet');
  },
  async status(_providerId: string) {
    if (isDev) return { status: 'paid', provider: 'daraja' };
    throw new Error('Daraja status not implemented');
  }
});
