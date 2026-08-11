import '@adobe-commerce/event-bus';
import type { SubscriptionStatus } from '@/tfsnewsletterdropin/api/subscribeToNewsletter';

declare module '@adobe-commerce/event-bus' {
  interface Events {
    'newsletter/subscribed': {
      email: string;
      status: SubscriptionStatus;
    };
    'newsletter/error': {
      email: string;
      message: string;
    };
  }
}
