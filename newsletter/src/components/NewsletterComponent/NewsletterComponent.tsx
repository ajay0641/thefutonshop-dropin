/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this
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
  onEmailChange,
  onSubmit,
  ...props
}) => {
  const handleSubmit = (event: Event) => {
    event.preventDefault();
    if (!loading) {
      onSubmit?.(email);
    }
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
            aria-describedby={emailError ? 'newsletter-email-error' : undefined}
            disabled={loading}
            error={!!emailError}
            onValue={(value) => onEmailChange?.(String(value))}
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
