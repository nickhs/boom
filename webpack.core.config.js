var path = require('path');

module.exports = {
    entry: {
        boom: ['./src/boom/bomb.js'],
        demo: ['./src/demo/main.js'],
        bookmarklet: ['./src/bookmarklet/bookmarklet.js'],
        bookmark_entry: ['./src/bookmarklet/main.js'],
    },

    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/build/',
        filename: '[name].js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },

            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },

            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            }
        ]
    },

    resolve: {
        root: path.resolve(__dirname, 'src'),
    },
};
