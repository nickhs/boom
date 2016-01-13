var gulp = require('gulp');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var webpackConfig = require('./webpack.config');

gulp.task('build', function(cb) {
    webpack(webpackConfig, function(err, stats) {
        if (err) {
            console.log(err);
        }

        console.log(stats);

        cb();
    });
});

gulp.task('dev', function(cb) {
    webpackConfig.entry.boom.unshift(
        "webpack-dev-server/client?http://localhost:8080");

    var compiler = webpack(webpackConfig);
    new WebpackDevServer(compiler, {
        publicPath: webpackConfig.output.publicPath,
        https: true,
    }).listen(8080, "localhost", function(err) {
        if (err) {
            console.log(err);
        }

        console.log("Dev server started on http://localhost:8080");
    });
});

gulp.task('demo-dev', function(cb) {
    webpackConfig.entry.demo.unshift(
        "webpack-dev-server/client?http://localhost:8080");

    var compiler = webpack(webpackConfig);
    new WebpackDevServer(compiler, {
        publicPath: webpackConfig.output.publicPath,
    }).listen(8080, "localhost", function(err) {
        if (err) {
            console.log(err);
        }

        console.log("Dev server started on http://localhost:8080");
    });
});
