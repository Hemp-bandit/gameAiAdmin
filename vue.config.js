const pkg = require('./package.json');
module.exports = {
  publicPath: `/${pkg.name}/`,
  outputDir: `${pkg.buildName}/${pkg.name}`,
  css: {
    loaderOptions: {
      // 向 CSS 相关的 loader 传递选项
      less: {
        javascriptEnabled: true,
      },
    },
  },
};
