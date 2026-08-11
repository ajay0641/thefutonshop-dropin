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
import { ProductSliderComponent } from '@/tfsproductslider/components/ProductSliderComponent';
import type { ProductSliderItem } from '@/tfsproductslider/data/models';

const sampleProduct: ProductSliderItem = {
  sku: 'FRAME-001',
  name: 'Armless Shaker Futon Frame',
  subtitle: 'Cornerstone Wood Amish Futon Frame',
  url: '/armless-shaker.html',
  imageUrl: 'https://example.com/img.jpg',
  finalPrice: 934.12,
  regularPrice: 1098.96,
  currency: 'USD',
  savePercent: 15,
  rating: 5,
  reviewCount: 5,
};

const secondProduct: ProductSliderItem = {
  sku: 'FRAME-002',
  name: 'Flat Arm Shaker Futon Frame',
  url: '/flat-arm.html',
  finalPrice: 100,
  currency: 'USD',
};

describe('TfsProductSlider/Components/ProductSliderComponent', () => {
  test('renders product cards', () => {
    const { container, getByText } = render(
      <ProductSliderComponent products={[sampleProduct]} title="New Arrivals" />
    );

    expect(!!container).toEqual(true);
    expect(getByText('New Arrivals')).toBeTruthy();
    expect(getByText('Armless Shaker Futon Frame')).toBeTruthy();
    expect(getByText('Save up to 15%')).toBeTruthy();
  });

  test('shows empty message', () => {
    const { getByText } = render(
      <ProductSliderComponent products={[]} emptyMessage="No products found." />
    );

    expect(getByText('No products found.')).toBeTruthy();
  });

  test('shows loading skeletons', () => {
    const { container } = render(
      <ProductSliderComponent title="Loading" loading skeletonCount={2} />
    );

    expect(
      container.querySelectorAll(
        '.tfsproductslider-product-slider-component__skeleton'
      )
    ).toHaveLength(2);
  });

  test('shows error message', () => {
    const { getByRole } = render(
      <ProductSliderComponent errorMessage="Unable to load products." />
    );

    expect(getByRole('alert').textContent).toBe('Unable to load products.');
  });

  test('nav buttons scroll the track', () => {
    const { getByLabelText, container } = render(
      <ProductSliderComponent
        products={[sampleProduct, secondProduct]}
        previousLabel="Previous products"
        nextLabel="Next products"
      />
    );

    const track = container.querySelector(
      '.tfsproductslider-product-slider-component__track'
    ) as HTMLDivElement;
    Object.defineProperty(track, 'clientWidth', { value: 400, configurable: true });
    track.scrollBy = jest.fn();

    fireEvent.click(getByLabelText('Previous products'));
    fireEvent.click(getByLabelText('Next products'));

    expect(track.scrollBy).toHaveBeenCalledWith({
      left: -360,
      behavior: 'smooth',
    });
    expect(track.scrollBy).toHaveBeenCalledWith({
      left: 360,
      behavior: 'smooth',
    });
  });
});
