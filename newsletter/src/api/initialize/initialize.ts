import { Initializer } from '@adobe-commerce/elsie/lib';
import { Lang } from '@adobe-commerce/elsie/i18n';
import {
  setFetchGraphQlHeaders,
  setEndpoint,
} from '@/tfsnewsletterdropin/api/fetch-graphql';

type ConfigProps = {
  langDefinitions?: Lang;
  /** Magento store view code header (default: "default") */
  storeViewCode?: string;
  /** Magento website code header (default: "base") */
  websiteCode?: string;
  /** Optional GraphQL endpoint override */
  endpoint?: string;
};

export const initialize = new Initializer<ConfigProps>({
  init: async (config) => {
    const defaultConfig: ConfigProps = {
      storeViewCode: 'default',
      websiteCode: 'base',
    };

    const merged = { ...defaultConfig, ...config };

    if (merged.endpoint) {
      setEndpoint(merged.endpoint);
    }

    setFetchGraphQlHeaders({
      'Magento-Store-View-Code': merged.storeViewCode ?? 'default',
      'Magento-Website-Code': merged.websiteCode ?? 'base',
    });

    initialize.config.setConfig(merged);
  },

  listeners: () => [],
});

export const config = initialize.config;
