/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

import { useState } from 'preact/hooks';
import { HTMLAttributes } from 'preact/compat';
import { Container } from '@adobe-commerce/elsie/lib';
import { useText } from '@adobe-commerce/elsie/i18n';
import { events } from '@adobe-commerce/event-bus';
import { NewsletterComponent } from '@/tfsnewsletterdropin/components';
import { subscribeToNewsletter } from '@/tfsnewsletterdropin/api/subscribeToNewsletter';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface NewsletterContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Called after a successful subscription */
  onSuccess?: (payload: { email: string; status: string }) => void;
  /** Called when subscription fails */
  onError?: (payload: { email: string; message: string }) => void;
}

export const NewsletterContainer: Container<NewsletterContainerProps> = ({
  onSuccess,
  onError,
  ...props
}) => {
  const labels = useText({
    emailPlaceholder: 'Newsletter.NewsletterContainer.emailPlaceholder',
    submitLabel: 'Newsletter.NewsletterContainer.submitLabel',
    submittingLabel: 'Newsletter.NewsletterContainer.submittingLabel',
    invalidEmail: 'Newsletter.NewsletterContainer.invalidEmail',
    requiredEmail: 'Newsletter.NewsletterContainer.requiredEmail',
  });

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return labels.requiredEmail || 'Email is required.';
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      return labels.invalidEmail || 'Please enter a valid email address.';
    }
    return null;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      setEmailError(null);
    }
  };

  const handleSubmit = async (value: string) => {
    const validationError = validateEmail(value);
    if (validationError) {
      setEmailError(validationError);
      return;
    }

    const trimmedEmail = value.trim();
    setLoading(true);
    setEmailError(null);

    try {
      const result = await subscribeToNewsletter(trimmedEmail);

      setEmail('');

      const payload = { email: trimmedEmail, status: result.status };
      events.emit('newsletter/subscribed', payload);
      onSuccess?.(payload);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Subscription failed';

      setEmailError(message);

      const payload = { email: trimmedEmail, message };
      events.emit('newsletter/error', payload);
      onError?.(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div {...props}>
      <NewsletterComponent
        emailPlaceholder={labels.emailPlaceholder || 'Enter your email address...'}
        submitLabel={labels.submitLabel || 'Subscribe'}
        submittingLabel={labels.submittingLabel || 'Subscribing…'}
        email={email}
        loading={loading}
        emailError={emailError}
        onEmailChange={handleEmailChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
