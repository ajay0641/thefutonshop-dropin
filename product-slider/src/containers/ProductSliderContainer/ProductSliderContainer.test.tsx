/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, copy, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

/** https://preactjs.com/guide/v10/preact-testing-library/ */

import { fireEvent, render, waitFor } from '@adobe-commerce/elsie/lib/tests';
import { ProductSliderContainer } from '@/tfsproductslider/containers/ProductSliderContainer';
import { getProductSlider } from '@/tfsproductslider/api/productSlider';

jest.mock('@/tfsproductslider/api/productSlider', () => ({
  getProductSlider: jest.fn(),
}));

const mockGetProductSlider = getProductSlider as jest.MockedFunction<
  typeof getProductSlider
>;
const mockFetchProducts = jest.fn();

describe('TfsProductSlider/Containers/ProductSliderContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders products from fetchProducts', async () => {
    mockFetchProducts.mockResolvedValue({
      totalCount: 1,
      items: [
        {
          sku: 'FRAME-001',
          name: 'Armless Shaker Futon Frame',
          url: '/p/frame-001',
          finalPrice: 100,
          currency: 'USD',
        },
      ],
    });

    const onLoad = jest.fn();
    const { getByText } = render(
      <ProductSliderContainer
        title="New Arrivals"
        fetchProducts={mockFetchProducts}
        onLoad={onLoad}
      />
    );

    await waitFor(() => {
      expect(getByText('Armless Shaker Futon Frame')).toBeTruthy();
    });

    expect(getByText('New Arrivals')).toBeTruthy();
    expect(mockFetchProducts).toHaveBeenCalled();
    expect(onLoad).toHaveBeenCalled();
  });

  test('uses getProductSlider when fetchProducts is not provided', async () => {
    mockGetProductSlider.mockResolvedValue({
      totalCount: 1,
      items: [
        {
          sku: 'API-1',
          name: 'From Default API',
          url: '/p/api-1',
        },
      ],
    });

    const { getByText } = render(
      <ProductSliderContainer
        title="Default API"
        phrase=""
        pageSize={4}
        filter={[{ attribute: 'isNew', eq: '1' }]}
      />
    );

    await waitFor(() => {
      expect(getByText('From Default API')).toBeTruthy();
    });

    expect(mockGetProductSlider).toHaveBeenCalledWith({
      phrase: '',
      pageSize: 4,
      currentPage: 1,
      filter: [{ attribute: 'isNew', eq: '1' }],
    });
  });

  test('shows error message when fetch fails', async () => {
    mockFetchProducts.mockRejectedValue(new Error('Network down'));
    const onError = jest.fn();

    const { getByText } = render(
      <ProductSliderContainer
        fetchProducts={mockFetchProducts}
        onError={onError}
      />
    );

    await waitFor(() => {
      expect(getByText('Network down')).toBeTruthy();
    });
    expect(onError).toHaveBeenCalledWith({ message: 'Network down' });
  });

  test('handles non-Error rejections', async () => {
    mockFetchProducts.mockRejectedValue('boom');

    const { getByText } = render(
      <ProductSliderContainer fetchProducts={mockFetchProducts} />
    );

    await waitFor(() => {
      expect(getByText(/Unable to load products|boom/i)).toBeTruthy();
    });
  });

  test('emits separate name and image click callbacks', async () => {
    const product = {
      sku: 'CLICK-1',
      name: 'Click Me',
      url: '/p/click-1',
      imageUrl: 'https://example.com/click.jpg',
    };
    mockFetchProducts.mockResolvedValue({
      totalCount: 1,
      items: [product],
    });
    const onProductClick = jest.fn();
    const onProductNameClick = jest.fn();
    const onProductImageClick = jest.fn();

    const { getByText, getByLabelText } = render(
      <ProductSliderContainer
        fetchProducts={mockFetchProducts}
        onProductClick={onProductClick}
        onProductNameClick={onProductNameClick}
        onProductImageClick={onProductImageClick}
      />
    );

    await waitFor(() => {
      expect(getByText('Click Me')).toBeTruthy();
    });

    fireEvent.click(getByText('Click Me'));
    expect(onProductNameClick).toHaveBeenCalledWith(product);
    expect(onProductClick).toHaveBeenCalledWith(product, 'name');

    fireEvent.click(getByLabelText('Click Me'));
    expect(onProductImageClick).toHaveBeenCalledWith(product);
    expect(onProductClick).toHaveBeenCalledWith(product, 'image');
  });
});
