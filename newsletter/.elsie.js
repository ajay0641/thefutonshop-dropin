/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this 
 * file in accordance with the terms of the Adobe license agreement 
 * accompanying it. 
 *******************************************************************/

module.exports = {
  name: 'TfsNewsletterDropin',
  api: {
    root: './src/api',
    importAliasRoot: '@/tfsnewsletterdropin/api',
  },
  components: [
    {
      id: 'Components',
      root: './src/components',
      importAliasRoot: '@/tfsnewsletterdropin/components',
      cssPrefix: 'tfsnewsletterdropin',
      default: true,
    },
  ],
  containers: {
    root: './src/containers',
    importAliasRoot: '@/tfsnewsletterdropin/containers',
  },
  schema: {
    endpoint: process.env.ENDPOINT,
    headers: {
      'Magento-Store-View-Code': 'default',
      'Magento-Website-Code': 'base',
    },
  },
};
