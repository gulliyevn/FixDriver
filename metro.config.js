const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Исключаем ненужные папки из отслеживания
config.watchFolders = [__dirname];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Исключаем папки, которые не нужно отслеживать
config.resolver.blockList = [
  /node_modules\/.*\/node_modules\/.*/,
  /coverage\/.*/,
  /\.git\/.*/,
  /ios\/Pods\/.*/,
  /android\/\.gradle\/.*/,
];

// Уменьшаем количество воркеров
config.maxWorkers = 2;

module.exports = config; 