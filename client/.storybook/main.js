const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  core: {
    // https://storybook.js.org/docs/html/builders/vite
    builder: '@storybook/builder-vite',
  },

  async viteFinal(config, { configType }) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@backend/types': path.resolve(__dirname, '../../server/utils/types/shared-types.ts'),
      '@backend/constants': path.resolve(__dirname, '../../server/utils/constants.ts'),
    };
    return config;
  },
};
