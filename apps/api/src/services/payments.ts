export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface PaymentRequest {
  amount: number;
  currency: string;
  reference: string;
  phone?: string;
}

export interface PaymentResult {
  status: PaymentStatus;
  provider: string;
  providerId?: string;
}

// Simple provider registry
const providers: Record<string, any> = {};

export function registerProvider(name: string, impl: any) {
  providers[name] = impl;
}

export async function initiatePayment(providerName: string, req: PaymentRequest): Promise<PaymentResult> {
  const provider = providers[providerName];
  if (!provider) throw new Error('Provider not registered');
  return provider.initiate(req);
}

export async function getPaymentStatus(providerName: string, providerId: string): Promise<PaymentResult> {
  const provider = providers[providerName];
  if (!provider) throw new Error('Provider not registered');
  return provider.status(providerId);
}

// Register a mock provider for development
registerProvider('mock', {
  async initiate(req: PaymentRequest) {
    return {
      status: 'pending' as PaymentStatus,
      provider: 'mock',
      providerId: `mock-${Date.now()}`
    };
  },
  async status(_providerId: string) {
    return { status: 'paid' as PaymentStatus, provider: 'mock' };
  }
});
