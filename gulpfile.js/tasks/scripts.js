var gulp = require('gulp'),
    config = require('../gulpconfig').scripts,
    $ = require('gulp-load-plugins')({ camelize: true }),
    browserSync = require("browser-sync").get('My server'),
    writeToManifest = require('./manifest').writeToManifest,
    manifest = require('../gulpconfig').manifest.manifest;
var webpack = require('webpack');
var gulpWebpack = require('webpack-stream');
var webpackConfig = require('../webpack.config.js');

gulp.task('scripts', ['jshint'], function() {
    return gulp.src('foobar')
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(writeToManifest('scripts'));

});

gulp.task('jshint', function() {
    return gulp.src("assets/scripts/*.js")
        .pipe($.jshint({ esversion: 6 }))
        .pipe($.jshint.reporter('jshint-stylish'));
});
gulp.task('reload-scripts', ['scripts'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('watch-scripts', function() {
    gulp.watch([config.src + '/**/*', '../webpack.config.js'], ['reload-scripts']);
});
