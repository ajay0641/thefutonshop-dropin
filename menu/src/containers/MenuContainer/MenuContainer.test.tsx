/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this 
 * file in accordance with the terms of the Adobe license agreement 
 * accompanying it. 
 *******************************************************************/

/** https://preactjs.com/guide/v10/preact-testing-library/ */

import { render, waitFor } from '@adobe-commerce/elsie/lib/tests';

import { MenuContainer } from '@/tfsmenu/containers/MenuContainer';
import { sandboxCategories } from '@/tfsmenu/data/fixtures/sandboxCategories';

describe('TfsMenu/Containers/MenuContainer', () => {
  test('renders menu component with fetchCategories', async () => {
    const { container } = render(
      <MenuContainer
        parentId="2"
        fetchCategories={async () => sandboxCategories}
      />
    );

    await waitFor(() => {
      expect(container.textContent).toContain('Futons');
    });
  });
});
