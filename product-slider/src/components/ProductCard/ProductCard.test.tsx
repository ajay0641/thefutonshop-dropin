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
import { ProductCard } from '@/tfsproductslider/components/ProductCard';

const fullProduct = {
  sku: 'A',
  name: 'Armless Shaker Futon Frame',
  subtitle: 'Cornerstone Wood Amish Futon Frame',
  url: '/p/a',
  imageUrl: 'https://example.com/a.jpg',
  finalPrice: 934.12,
  regularPrice: 1098.96,
  currency: 'USD',
  savePercent: 15,
  reviewCount: 5,
  rating: 5,
};

describe('TfsProductSlider/Components/ProductCard', () => {
  test('renders product card content', () => {
    const { getByText, getAllByRole } = render(
      <ProductCard product={fullProduct} />
    );

    expect(getByText('Armless Shaker Futon Frame')).toBeTruthy();
    expect(getByText('Cornerstone Wood Amish Futon Frame')).toBeTruthy();
    expect(getByText('From:')).toBeTruthy();
    expect(getByText('Save up to 15%')).toBeTruthy();
    expect(getByText('5 Reviews')).toBeTruthy();

    const links = getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links.every((link) => link.getAttribute('href') === '/p/a')).toBe(
      true
    );
  });

  test('shows singular review label and placeholder image', () => {
    const { getByText, container } = render(
      <ProductCard
        product={{
          sku: 'B',
          name: 'Simple Product',
          url: '/p/b',
          finalPrice: 50,
          reviewCount: 1,
        }}
      />
    );

    expect(getByText('1 Review')).toBeTruthy();
    expect(
      container.querySelector(
        '.tfsproductslider-product-card__image--placeholder'
      )
    ).toBeTruthy();
  });

  test('falls back when currency formatting fails', () => {
    const { getByText } = render(
      <ProductCard
        product={{
          sku: 'C',
          name: 'Bad Currency',
          url: '/p/c',
          finalPrice: 12.5,
          currency: 'INVALID',
        }}
      />
    );

    expect(getByText('$12.50')).toBeTruthy();
  });

  test('invokes separate image and name click handlers', () => {
    const onProductClick = jest.fn();
    const onProductImageClick = jest.fn();
    const onProductNameClick = jest.fn();
    const product = {
      sku: 'D',
      name: 'Clickable',
      url: '/p/d',
      imageUrl: 'https://example.com/d.jpg',
    };

    const { getByText, getByLabelText } = render(
      <ProductCard
        product={product}
        onProductClick={onProductClick}
        onProductImageClick={onProductImageClick}
        onProductNameClick={onProductNameClick}
      />
    );

    fireEvent.click(getByLabelText('Clickable'));
    expect(onProductImageClick).toHaveBeenCalledWith(product);
    expect(onProductClick).toHaveBeenCalledWith(product, 'image');

    fireEvent.click(getByText('Clickable'));
    expect(onProductNameClick).toHaveBeenCalledWith(product);
    expect(onProductClick).toHaveBeenCalledWith(product, 'name');
  });

  test('price is not a link', () => {
    const onProductClick = jest.fn();
    const { getByText, getAllByRole } = render(
      <ProductCard product={fullProduct} onProductClick={onProductClick} />
    );

    fireEvent.click(getByText('From:'));
    expect(onProductClick).not.toHaveBeenCalled();
    expect(getAllByRole('link')).toHaveLength(2);
  });

  test('does not render ATC when onAddToCart is missing', () => {
    const { queryByLabelText } = render(<ProductCard product={fullProduct} />);
    expect(queryByLabelText('Add to cart')).toBeNull();
  });

  test('does not render wishlist when onAddToWishlist is missing', () => {
    const { queryByLabelText } = render(<ProductCard product={fullProduct} />);
    expect(queryByLabelText('Add to wish list')).toBeNull();
  });

  test('invokes onAddToCart from ATC button', () => {
    const onAddToCart = jest.fn();
    const { getByLabelText } = render(
      <ProductCard product={fullProduct} onAddToCart={onAddToCart} />
    );

    fireEvent.click(getByLabelText('Add to cart'));
    expect(onAddToCart).toHaveBeenCalledWith(fullProduct);
  });

  test('does not call onAddToCart when addToCartAllowed is false', () => {
    const onAddToCart = jest.fn();
    const { getByLabelText } = render(
      <ProductCard
        product={{ ...fullProduct, addToCartAllowed: false }}
        onAddToCart={onAddToCart}
      />
    );

    const button = getByLabelText('Add to cart') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(onAddToCart).not.toHaveBeenCalled();
  });

  test('invokes onAddToWishlist from wishlist button', () => {
    const onAddToWishlist = jest.fn();
    const { getByLabelText } = render(
      <ProductCard product={fullProduct} onAddToWishlist={onAddToWishlist} />
    );

    fireEvent.click(getByLabelText('Add to wish list'));
    expect(onAddToWishlist).toHaveBeenCalledWith(fullProduct);
  });
});
