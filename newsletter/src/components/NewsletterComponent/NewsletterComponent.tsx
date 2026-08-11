/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, copy, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

import { FunctionComponent } from 'preact';
import { HTMLAttributes } from 'preact/compat';
import { classes } from '@adobe-commerce/elsie/lib';
import { Button, Input } from '@adobe-commerce/elsie/components';
import '@/tfsnewsletterdropin/components/NewsletterComponent/NewsletterComponent.css';

export interface NewsletterComponentProps extends HTMLAttributes<HTMLDivElement> {
  emailPlaceholder?: string;
  submitLabel?: string;
  submittingLabel?: string;
  email?: string;
  loading?: boolean;
  emailError?: string | null;
  successMessage?: string | null;
  onEmailChange?: (email: string) => void;
  onSubmit?: (email: string) => void;
}

export const NewsletterComponent: FunctionComponent<NewsletterComponentProps> = ({
  className,
  emailPlaceholder = 'Enter your email address...',
  submitLabel = 'Subscribe',
  submittingLabel = 'Subscribing…',
  email = '',
  loading = false,
  emailError = null,
  successMessage = null,
  onEmailChange,
  onSubmit,
  ...props
}) => {
  // Elsie Input debounces onValue (200ms). Use onChange for immediate parent updates
  // so validation errors clear as the user types and submit sees the current value.
  const handleInputChange = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    onEmailChange?.(value);
  };

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    if (loading) return;

    const form = event.target as HTMLFormElement;
    // Prefer live form value so validation/error state stays in sync with typed text
    const formEmail = String(new FormData(form).get('email') || '');

    onSubmit?.(formEmail);
  };

  return (
    <div
      {...props}
      className={classes(['tfsnewsletterdropin-newsletter-component', className])}
    >
      <form
        className="tfsnewsletterdropin-newsletter-component__form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="tfsnewsletterdropin-newsletter-component__field">
          <Input
            name="email"
            type="email"
            value={email}
            placeholder={emailPlaceholder}
            aria-label={emailPlaceholder}
            aria-invalid={!!emailError}
            aria-describedby={
              emailError
                ? 'newsletter-email-error'
                : successMessage
                  ? 'newsletter-success-message'
                  : undefined
            }
            disabled={loading}
            error={!!emailError}
            success={!!successMessage && !emailError}
            onChange={handleInputChange}
            autoComplete="email"
            required
            className="tfsnewsletterdropin-newsletter-component__input"
          />

          {emailError && (
            <p
              id="newsletter-email-error"
              className="tfsnewsletterdropin-newsletter-component__error"
              role="alert"
            >
              {emailError}
            </p>
          )}

          {!emailError && successMessage && (
            <p
              id="newsletter-success-message"
              className="tfsnewsletterdropin-newsletter-component__success"
              role="status"
            >
              {successMessage}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="tfsnewsletterdropin-newsletter-component__submit"
        >
          {loading ? submittingLabel : submitLabel}
        </Button>
      </form>
    </div>
  );
};
