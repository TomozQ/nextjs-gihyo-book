const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const path = require('path')

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    // "@storybook/addon-interactions"
    "@storybook/addon-postcss",
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5"
  },
  // 静的ファイルを配置するディレクトリを指定
  staticDirs: ['public'],
  babel: async options => ({
    ...options,
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-private-methods',
      '@babel/plugin-proposal-private-property-in-object',
    ],
  }),
  webpackFinal: async (config) => {
    config.resolve.plugins = [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../tsconfig.json')
      })
    ];

    return config
  }
}