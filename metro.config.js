const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Принудительно отключаем Hermes
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    ...config.transformer.minifierConfig,
    mangle: {
      keep_fnames: true,
    },
  },
};

// Отключаем Hermes
config.transformer.unstable_transformProfile = 'default';

module.exports = config; 