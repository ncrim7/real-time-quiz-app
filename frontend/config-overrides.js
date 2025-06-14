const { override, addBabelPlugin } = require('customize-cra');
const webpack = require('webpack');

module.exports = override(
  addBabelPlugin([
    'babel-plugin-root-import',
    {
      rootPathSuffix: 'src',
      rootPathPrefix: '~/'
    },
  ]),
  (config) => {
    const babelLoader = config.module.rules.find((rule) => {
      return rule.oneOf && rule.oneOf.some((loader) => loader.loader && loader.loader.includes('babel-loader'));
    }).oneOf.find((loader) => loader.loader && loader.loader.includes('babel-loader'));

    if (babelLoader) {
      babelLoader.include = undefined;
      // Bu kısım MUI hataları için önemliydi, arkadaşınızın projesi MUI kullanıyorsa gerekli
      babelLoader.exclude = /node_modules(?!\/(swiper|dom7|@mui\/system|@mui\/material|@emotion\/react|@emotion\/styled)\/)/;
    }

    // 'process is not defined' hatasını çözmek için polyfill
    config.plugins = (config.plugins || []).concat([
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || ''),
      }),
    ]);
    
    config.resolve.alias = {
        ...(config.resolve.alias || {}),
        'process': require.resolve('process/browser')
    };

    return config;
  }
);