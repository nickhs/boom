/* jshint scripturl:true */

'use strict';

var gulp = require('gulp');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var fs = require('fs');

var devConfig = require('./webpack.dev.config.js');
var prodConfig = require('./webpack.prod.config.js');

gulp.task('dev-build', function(cb) {
    webpack(devConfig, function(err, stats) {
        if (err) {
            console.log(err);
        }

        console.log(stats);

        cb();
    });
});

gulp.task('dev-server', function(cb) {
    devConfig.entry.demo.unshift(
        "webpack-dev-server/client?http://localhost:8080");

    var compiler = webpack(devConfig);
    new WebpackDevServer(compiler, {
        publicPath: devConfig.output.publicPath,
    }).listen(8080, "localhost", function(err) {
        if (err) {
            console.log(err);
        }

        console.log("Dev server started on http://localhost:8080");
    });
});

gulp.task('prod-build', function(cb) {
    webpack(prodConfig, function(err, stats) {
        if (err) {
            console.log(err);
        }

        console.log(stats);

        cb();
    });
});

gulp.task('make-bookmarklet', function(cb) {
    var bookmarkletLocation = './build/bookmarklet.js';
    var fileData = fs.readFileSync(bookmarkletLocation);
    fileData = encodeURIComponent(fileData);
    fileData = 'javascript: ' + fileData;
    fs.writeFileSync(bookmarkletLocation, fileData);
    cb();
});

function copyHelper(sourceFile, destFile) {
    let promise = new Promise((resolve, reject) => {
        let writeStream = fs.createWriteStream(destFile);
        writeStream.on('end', resolve);
        writeStream.on('close', resolve);
        writeStream.on('error', reject);

        fs.createReadStream(sourceFile).pipe(writeStream);
    });

    return promise;
}

gulp.task('make-demo', ['make-bookmarklet'], function(cb) {
    // copy all demo deps to build
    let p1 = copyHelper('./demo.css', './build/demo.css');
    let p2 = copyHelper('./demo.html', './build/demo.html');

    Promise.all([p1, p2]).then(() => {
        var demoPage = './build/demo.html';
        var demoHTML = fs.readFileSync(demoPage).toString();
        var bookmarkletCode = fs.readFileSync('./build/bookmarklet.js').toString();
        demoHTML = demoHTML.replace('/build/bookmarklet.js', bookmarkletCode);
        fs.writeFileSync(demoPage, demoHTML);
        cb();
    }, 1000);
});
