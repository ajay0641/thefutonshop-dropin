/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, copy, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

/** https://preactjs.com/guide/v10/preact-testing-library/ */

import { fireEvent, render } from '@adobe-commerce/elsie/lib/tests';
import { NewsletterComponent } from '@/tfsnewsletterdropin/components/NewsletterComponent';

const getEmailInput = (container: HTMLElement) =>
  container.querySelector('input[name="email"]') as HTMLInputElement;

describe('TfsNewsletterDropin/Components/NewsletterComponent', () => {
  test('renders email field and subscribe button', () => {
    const { container, getByRole } = render(<NewsletterComponent />);

    const input = getEmailInput(container);
    expect(input).toBeTruthy();
    expect(input.placeholder).toEqual('Enter your email address...');
    expect(getByRole('button').textContent).toContain('Subscribe');
  });

  test('calls onSubmit with email from controlled prop', () => {
    const onSubmit = jest.fn();
    const { container } = render(
      <NewsletterComponent email="test1@test1.com" onSubmit={onSubmit} />
    );

    fireEvent.submit(container.querySelector('form') as HTMLFormElement);
    expect(onSubmit).toHaveBeenCalledWith('test1@test1.com');
  });

  test('does not call onSubmit while loading', () => {
    const onSubmit = jest.fn();
    const { container, getByRole } = render(
      <NewsletterComponent
        email="test1@test1.com"
        loading
        submittingLabel="Please wait"
        onSubmit={onSubmit}
      />
    );

    expect(getByRole('button').textContent).toContain('Please wait');
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('shows email error', () => {
    const { getByRole } = render(
      <NewsletterComponent emailError="Invalid email" />
    );

    expect(getByRole('alert').textContent).toBe('Invalid email');
  });

  test('shows success message', () => {
    const { getByRole } = render(
      <NewsletterComponent successMessage="Thanks for joining!" />
    );

    expect(getByRole('status').textContent).toBe('Thanks for joining!');
  });

  test('calls onEmailChange immediately when input changes', () => {
    const onEmailChange = jest.fn();
    const { container } = render(
      <NewsletterComponent onEmailChange={onEmailChange} />
    );

    fireEvent.change(getEmailInput(container), {
      target: { value: 'user@example.com' },
    });

    expect(onEmailChange).toHaveBeenCalledWith('user@example.com');
  });

  test('supports custom className and labels', () => {
    const { container, getByRole } = render(
      <NewsletterComponent
        className="custom-class"
        emailPlaceholder="Your email"
        submitLabel="Join"
      />
    );

    expect(
      container.querySelector('.tfsnewsletterdropin-newsletter-component')
        ?.className
    ).toContain('custom-class');
    expect(getEmailInput(container).placeholder).toBe('Your email');
    expect(getByRole('button').textContent).toContain('Join');
  });
});
