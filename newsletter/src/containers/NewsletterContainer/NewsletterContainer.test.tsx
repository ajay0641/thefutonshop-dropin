/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, copy, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

/** https://preactjs.com/guide/v10/preact-testing-library/ */

import { act, fireEvent, render, waitFor } from '@adobe-commerce/elsie/lib/tests';
import { events } from '@adobe-commerce/event-bus';
import { useText } from '@adobe-commerce/elsie/i18n';
import { NewsletterContainer } from '@/tfsnewsletterdropin/containers/NewsletterContainer';
import { subscribeToNewsletter } from '@/tfsnewsletterdropin/api/subscribeToNewsletter';

jest.mock('@/tfsnewsletterdropin/api/subscribeToNewsletter', () => ({
  subscribeToNewsletter: jest.fn(),
}));

jest.mock('@adobe-commerce/elsie/i18n', () => {
  const actual = jest.requireActual('@adobe-commerce/elsie/i18n');
  return {
    ...actual,
    useText: jest.fn(actual.useText),
  };
});

const mockSubscribe = subscribeToNewsletter as jest.MockedFunction<
  typeof subscribeToNewsletter
>;
const mockUseText = useText as jest.MockedFunction<typeof useText>;

const getEmailInput = (container: HTMLElement) =>
  container.querySelector('input[name="email"]') as HTMLInputElement;

const typeEmail = async (input: HTMLInputElement, value: string) => {
  fireEvent.change(input, { target: { value } });
  await act(async () => {
    await Promise.resolve();
  });
};

const submitForm = (container: HTMLElement) => {
  const form = container.querySelector('form') as HTMLFormElement;
  fireEvent.submit(form);
};

describe('TfsNewsletterDropin/Containers/NewsletterContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseText.mockImplementation(
      jest.requireActual('@adobe-commerce/elsie/i18n').useText
    );
  });

  test('renders email field and submit button', () => {
    const { container, getByRole } = render(<NewsletterContainer />);
    expect(getEmailInput(container)).toBeTruthy();
    expect(getByRole('button')).toBeTruthy();
  });

  test('shows required error for empty email', async () => {
    const { container, findByRole } = render(<NewsletterContainer />);

    submitForm(container);

    const alert = await findByRole('alert');
    expect(alert.textContent).toBe('Email is required.');
  });

  test('shows invalid email error', async () => {
    const { container, findByRole } = render(<NewsletterContainer />);
    const input = getEmailInput(container);

    await typeEmail(input, 'not-an-email');
    submitForm(container);

    const alert = await findByRole('alert');
    expect(alert.textContent).toBe('Please enter a valid email address.');
  });

  test('uses fallback labels when translations are empty', async () => {
    mockUseText.mockReturnValue({
      emailPlaceholder: '',
      submitLabel: '',
      submittingLabel: '',
      invalidEmail: '',
      requiredEmail: '',
      successMessage: '',
    });

    const { container, findByRole, getByRole } = render(<NewsletterContainer />);

    expect(getEmailInput(container).placeholder).toBe(
      'Enter your email address...'
    );
    expect(getByRole('button').textContent).toContain('Subscribe');

    submitForm(container);
    expect((await findByRole('alert')).textContent).toBe('Email is required.');

    await typeEmail(getEmailInput(container), 'bad');
    submitForm(container);
    expect((await findByRole('alert')).textContent).toBe(
      'Please enter a valid email address.'
    );
  });

  test('clears error when email changes', async () => {
    const { container, findByRole, queryByRole } = render(<NewsletterContainer />);

    submitForm(container);
    expect(await findByRole('alert')).toBeTruthy();

    await typeEmail(getEmailInput(container), 'a@b.com');
    expect(queryByRole('alert')).toBeNull();
  });

  test('subscribes successfully, shows success message, and emits event', async () => {
    mockSubscribe.mockResolvedValue({ status: 'SUBSCRIBED' });
    const onSuccess = jest.fn();
    const emitSpy = jest.spyOn(events, 'emit');

    const { container, findByRole, getByRole } = render(
      <NewsletterContainer onSuccess={onSuccess} />
    );
    const input = getEmailInput(container);

    await typeEmail(input, ' test1@test1.com ');
    submitForm(container);

    await waitFor(() => {
      expect(mockSubscribe).toHaveBeenCalledWith('test1@test1.com');
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith({
        email: 'test1@test1.com',
        status: 'SUBSCRIBED',
      });
    });

    expect(emitSpy).toHaveBeenCalledWith('newsletter/subscribed', {
      email: 'test1@test1.com',
      status: 'SUBSCRIBED',
    });
    expect(getEmailInput(container).value).toBe('');
    expect(getByRole('button').textContent).toContain('Subscribe');

    const status = await findByRole('status');
    expect(status.textContent).toContain('Thank you for your subscription.');
  });

  test('uses fallback success message when translation is empty', async () => {
    mockUseText.mockReturnValue({
      emailPlaceholder: 'Email',
      submitLabel: 'Subscribe',
      submittingLabel: '…',
      invalidEmail: 'Invalid',
      requiredEmail: 'Required',
      successMessage: '',
    });
    mockSubscribe.mockResolvedValue({ status: 'SUBSCRIBED' });

    const { container, findByRole } = render(<NewsletterContainer />);
    await typeEmail(getEmailInput(container), 'test1@test1.com');
    submitForm(container);

    const status = await findByRole('status');
    expect(status.textContent).toContain('Thank you for your subscription.');
  });

  test('clears success message when email changes', async () => {
    mockSubscribe.mockResolvedValue({ status: 'SUBSCRIBED' });
    const { container, findByRole, queryByRole } = render(<NewsletterContainer />);

    await typeEmail(getEmailInput(container), 'test1@test1.com');
    submitForm(container);
    expect(await findByRole('status')).toBeTruthy();

    await typeEmail(getEmailInput(container), 'other@test1.com');
    expect(queryByRole('status')).toBeNull();
  });

  test('handles Error rejection and calls onError', async () => {
    mockSubscribe.mockRejectedValue(new Error('Already subscribed'));
    const onError = jest.fn();
    const emitSpy = jest.spyOn(events, 'emit');

    const { container, findByRole } = render(
      <NewsletterContainer onError={onError} />
    );

    await typeEmail(getEmailInput(container), 'test1@test1.com');
    submitForm(container);

    expect((await findByRole('alert')).textContent).toBe('Already subscribed');
    expect(onError).toHaveBeenCalledWith({
      email: 'test1@test1.com',
      message: 'Already subscribed',
    });
    expect(emitSpy).toHaveBeenCalledWith('newsletter/error', {
      email: 'test1@test1.com',
      message: 'Already subscribed',
    });
  });

  test('handles non-Error rejection with fallback message', async () => {
    mockSubscribe.mockRejectedValue('boom');
    const { container, findByRole } = render(<NewsletterContainer />);

    await typeEmail(getEmailInput(container), 'test1@test1.com');
    submitForm(container);

    expect((await findByRole('alert')).textContent).toBe('Subscription failed');
  });
});
