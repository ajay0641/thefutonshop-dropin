/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, copy, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

import { FunctionComponent } from 'preact';

/** Inline cart icon (line-art shopping cart). */
export const CartIcon: FunctionComponent<{ className?: string }> = ({
  className,
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3 4h1.5l1.2 2.2" />
    <path d="M5.5 6.2h13.2l-1.3 8.3H7.2L5.5 6.2z" />
    <path d="M7.2 14.5h10.2" />
    <circle cx="9" cy="18.5" r="1.35" />
    <circle cx="16" cy="18.5" r="1.35" />
  </svg>
);
