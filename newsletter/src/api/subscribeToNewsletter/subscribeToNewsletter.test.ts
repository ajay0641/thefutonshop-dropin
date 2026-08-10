/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

import { fetchGraphQl } from '@/tfsnewsletterdropin/api/fetch-graphql';
import { subscribeToNewsletter } from '@/tfsnewsletterdropin/api/subscribeToNewsletter';

jest.mock('@/tfsnewsletterdropin/api/fetch-graphql', () => ({
  fetchGraphQl: jest.fn(),
}));

const mockFetchGraphQl = fetchGraphQl as jest.MockedFunction<typeof fetchGraphQl>;

describe('TfsNewsletterDropin/api/subscribeToNewsletter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('subscribes email successfully', async () => {
    mockFetchGraphQl.mockResolvedValue({
      data: {
        subscribeEmailToNewsletter: {
          status: 'SUBSCRIBED',
        },
      },
    });

    const result = await subscribeToNewsletter('test1@test1.com');

    expect(mockFetchGraphQl).toHaveBeenCalledWith(
      expect.stringContaining('subscribeEmailToNewsletter'),
      { variables: { email: 'test1@test1.com' } }
    );
    expect(result).toEqual({ status: 'SUBSCRIBED' });
  });

  test('throws when email is empty', async () => {
    await expect(subscribeToNewsletter('   ')).rejects.toThrow('Email is required');
    expect(mockFetchGraphQl).not.toHaveBeenCalled();
  });

  test('throws GraphQL errors', async () => {
    mockFetchGraphQl.mockResolvedValue({
      data: null as any,
      errors: [{ message: 'Already subscribed', extensions: { category: 'graphql' } }],
    });

    await expect(subscribeToNewsletter('test@example.com')).rejects.toThrow(
      'Already subscribed'
    );
  });

  test('throws when response has no subscription status', async () => {
    mockFetchGraphQl.mockResolvedValue({
      data: {
        subscribeEmailToNewsletter: {} as any,
      },
    });

    await expect(subscribeToNewsletter('test@example.com')).rejects.toThrow(
      'Newsletter subscription failed'
    );
  });
});
