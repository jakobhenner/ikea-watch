// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg");

    svgRule.uses.clear();

    svgRule
      .use("babel-loader")
      .loader("babel-loader")
      .end()
      .use("raw-loader")
      .loader("raw-loader");
  },
  devServer: {
    disableHostCheck: true,
  },
};
