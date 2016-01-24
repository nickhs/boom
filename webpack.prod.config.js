var coreConfig = require('./webpack.core.config.js');
var webpack = require('webpack');
var deepAssign = require('deep-assign');

var configPlugin = new webpack.NormalModuleReplacementPlugin(/config\/config\.js/, `config/config.prod.js`);
var definePlugin = new webpack.DefinePlugin({
  __DEV__: false,
});

var prodConfig = {
    plugins: [
        definePlugin,
        configPlugin,
        new webpack.optimize.UglifyJsPlugin({})
    ]
};

module.exports = deepAssign(prodConfig, coreConfig);
