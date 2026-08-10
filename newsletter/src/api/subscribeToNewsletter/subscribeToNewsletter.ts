/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

import { fetchGraphQl } from '@/tfsnewsletterdropin/api/fetch-graphql';

export type SubscriptionStatus =
  | 'NOT_ACTIVE'
  | 'SUBSCRIBED'
  | 'UNSUBSCRIBED'
  | 'UNCONFIRMED';

export interface SubscribeToNewsletterResult {
  status: SubscriptionStatus;
}

const SUBSCRIBE_TO_NEWSLETTER_MUTATION = `
  mutation SubscribeToNewsletter($email: String!) {
    subscribeEmailToNewsletter(email: $email) {
      status
    }
  }
`;

/**
 * Subscribe an email address to the Magento/Adobe Commerce newsletter.
 */
export const subscribeToNewsletter = async (
  email: string
): Promise<SubscribeToNewsletterResult> => {
  const trimmedEmail = email?.trim();

  if (!trimmedEmail) {
    throw new Error('Email is required');
  }

  const { data, errors } = await fetchGraphQl<{
    subscribeEmailToNewsletter: SubscribeToNewsletterResult;
  }>(SUBSCRIBE_TO_NEWSLETTER_MUTATION, {
    variables: { email: trimmedEmail },
  });

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(', '));
  }

  const result = data?.subscribeEmailToNewsletter;

  if (!result?.status) {
    throw new Error('Newsletter subscription failed');
  }

  return result;
};
