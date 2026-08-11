import { initialize } from './initialize';
import {
  setFetchGraphQlHeaders,
  setEndpoint,
} from '@/tfsproductslider/api/fetch-graphql';

jest.mock('@/tfsproductslider/api/fetch-graphql', () => ({
  setFetchGraphQlHeaders: jest.fn(),
  setEndpoint: jest.fn(),
}));

describe('TfsProductSlider/api/initialize', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sets default Magento headers', async () => {
    await initialize.init({});

    expect(setFetchGraphQlHeaders).toHaveBeenCalledWith({
      'Magento-Store-View-Code': 'default',
      'Magento-Website-Code': 'base',
      'Magento-Store-Code': 'main_website_store',
    });
    expect(setEndpoint).not.toHaveBeenCalled();
  });

  test('applies endpoint override', async () => {
    await initialize.init({ endpoint: 'https://example.com/graphql' });

    expect(setEndpoint).toHaveBeenCalledWith('https://example.com/graphql');
  });
});
