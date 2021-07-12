const pkg = require('./package.json');
module.exports = {
  publicPath: `/${pkg.name}/`,
  outputDir: `${pkg.buildName}/${pkg.name}`,
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  configureWebpack: {
    //关闭 webpack 的性能提示
    performance: {
      hints: false,
    },
  },
};
