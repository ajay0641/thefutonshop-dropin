import { initialize } from './initialize';
import {
  setFetchGraphQlHeaders,
  setEndpoint,
} from '@/tfsnewsletterdropin/api/fetch-graphql';

jest.mock('@/tfsnewsletterdropin/api/fetch-graphql', () => ({
  setFetchGraphQlHeaders: jest.fn(),
  setEndpoint: jest.fn(),
}));

describe('TfsNewsletterDropin/api/initialize', () => {
  const listeners = new Set<any>();

  beforeEach(() => {
    jest.clearAllMocks();

    listeners.forEach((listener) => {
      listener.off();
    });

    initialize.listeners().forEach((listener) => {
      listeners.add(listener);
    });
  });

  test('sets default Magento store headers', async () => {
    await expect(initialize.init({})).resolves.toBeUndefined();

    expect(setFetchGraphQlHeaders).toHaveBeenCalledWith({
      'Magento-Store-View-Code': 'default',
      'Magento-Website-Code': 'base',
    });
    expect(initialize.config.getConfig()).toEqual({
      storeViewCode: 'default',
      websiteCode: 'base',
    });
  });

  test('accepts endpoint and custom headers', async () => {
    await initialize.init({
      endpoint: 'https://example.com/graphql',
      storeViewCode: 'en_us',
      websiteCode: 'main',
    });

    expect(setEndpoint).toHaveBeenCalledWith('https://example.com/graphql');
    expect(setFetchGraphQlHeaders).toHaveBeenCalledWith({
      'Magento-Store-View-Code': 'en_us',
      'Magento-Website-Code': 'main',
    });
  });

  test('falls back when store codes are nullish', async () => {
    await initialize.init({
      storeViewCode: undefined,
      websiteCode: null as unknown as string,
    });

    expect(setFetchGraphQlHeaders).toHaveBeenCalledWith({
      'Magento-Store-View-Code': 'default',
      'Magento-Website-Code': 'base',
    });
  });
});
