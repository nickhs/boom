var coreConfig = require('./webpack.core.config.js');
var deepAssign = require('deep-assign');
var webpack = require('webpack');

var configPlugin = new webpack.NormalModuleReplacementPlugin(/config\/config\.js/, `config/config.dev.js`);
var definePlugin = new webpack.DefinePlugin({
  __DEV__: true,
});


var devConfig = {
    devtool: "cheap-module-eval-source-map",
    plugins: [definePlugin, configPlugin],
};


module.exports = deepAssign(devConfig, coreConfig);
