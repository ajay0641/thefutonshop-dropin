/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this 
 * file in accordance with the terms of the Adobe license agreement 
 * accompanying it. 
 *******************************************************************/

/** https://preactjs.com/guide/v10/preact-testing-library/ */

import { render, act, waitFor } from '@adobe-commerce/elsie/lib/tests';
import { MenuComponent } from '@/tfsmenu/components/MenuComponent';
import { getMenu } from '@/tfsmenu/api/menu';

jest.mock('@/tfsmenu/api/menu', () => ({
  getMenu: jest.fn(),
}));

describe('TfsMenu/Components/MenuComponent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', async () => {
    let resolvePromise!: (val: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    (getMenu as jest.Mock).mockReturnValue(promise);

    const { container } = render(<MenuComponent />);
    expect(container.textContent).toContain('Loading Menu...');

    await act(async () => {
      resolvePromise([]);
    });
  });

  test('renders menu items recursively on success with all branch variations', async () => {
    const mockItems = [
      {
        id: '10',
        name: 'Top Category With Children',
        level: 2,
        urlPath: 'top-10',
        urlKey: 'top-10',
        parentId: '2',
        children: ['20', '30'],
      },
      {
        id: '20',
        name: 'Sub Category With Children',
        level: 3,
        urlPath: '',
        urlKey: 'sub-20',
        parentId: '10',
        children: ['40', '50'],
      },
      {
        id: '40',
        name: 'Nested Category 1',
        level: 4,
        urlPath: 'nested-40',
        urlKey: 'nested-40',
        parentId: '20',
        children: [],
      },
      {
        id: '50',
        name: 'Nested Category 2',
        level: 4,
        urlPath: '',
        urlKey: 'nested-50',
        parentId: '20',
        children: [],
      },
      {
        id: '30',
        name: 'Sub Category Without Children',
        level: 3,
        urlPath: 'sub-30',
        urlKey: 'sub-30',
        parentId: '10',
        children: [],
      },
      {
        id: '60',
        name: 'Top Category Without Children',
        level: 2,
        urlPath: '',
        urlKey: 'top-60',
        parentId: '2',
        children: [],
      },
      {
        id: '99',
        name: 'Category With Orphan Parent',
        level: 3,
        urlPath: 'orphan',
        urlKey: 'orphan',
        parentId: '999',
        children: [],
      },
    ];

    (getMenu as jest.Mock).mockResolvedValue(mockItems);

    const { container } = render(<MenuComponent parentId="2" />);

    await waitFor(() => {
      expect(container.textContent).toContain('Top Category With Children');
    });

    expect(container.textContent).toContain('Sub Category With Children');
    expect(container.textContent).toContain('Nested Category 1');
    expect(container.textContent).toContain('Nested Category 2');
    expect(container.textContent).toContain('Top Category Without Children');
    expect(container.textContent).not.toContain('Category With Orphan Parent');
  });

  test('renders error state on API failure (instanceof Error)', async () => {
    (getMenu as jest.Mock).mockRejectedValue(new Error('Failed to retrieve categories'));

    const { container } = render(<MenuComponent />);

    await waitFor(() => {
      expect(container.textContent).toContain('Failed to retrieve categories');
    });
  });

  test('renders error state on API failure (string error)', async () => {
    (getMenu as jest.Mock).mockRejectedValue('String error');

    const { container } = render(<MenuComponent />);

    await waitFor(() => {
      expect(container.textContent).toContain('Failed to load menu');
    });
  });

  test('renders nothing if menu items are empty', async () => {
    (getMenu as jest.Mock).mockResolvedValue([]);

    const { container } = render(<MenuComponent />);

    await waitFor(() => {
      expect(container.querySelector('.tfsmenu-menu-component')).toBeNull();
    });
  });

  test('uses fetchCategories when provided', async () => {
    const fetchCategories = jest.fn().mockResolvedValue([
      {
        id: '10',
        name: 'Custom Menu',
        level: 2,
        urlPath: 'custom',
        urlKey: 'custom',
        parentId: '2',
        children: [],
      },
    ]);

    const { container } = render(
      <MenuComponent parentId="2" fetchCategories={fetchCategories} />
    );

    await waitFor(() => {
      expect(container.textContent).toContain('Custom Menu');
    });

    expect(getMenu).not.toHaveBeenCalled();
    expect(fetchCategories).toHaveBeenCalledTimes(1);
  });

  test('ignores state updates when unmounted before promise resolves', async () => {
    let resolvePromise!: (val: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    (getMenu as jest.Mock).mockReturnValue(promise);

    const { container, unmount } = render(<MenuComponent />);

    unmount();

    await act(async () => {
      resolvePromise([]);
    });

    expect(container.firstChild).toBeNull();
  });

  test('ignores state updates when unmounted before promise rejects', async () => {
    let rejectPromise!: (err: any) => void;
    const promise = new Promise((_, reject) => {
      rejectPromise = reject;
    });
    (getMenu as jest.Mock).mockReturnValue(promise);

    const { container, unmount } = render(<MenuComponent />);

    unmount();

    await act(async () => {
      rejectPromise(new Error('error'));
    });

    expect(container.firstChild).toBeNull();
  });
});
