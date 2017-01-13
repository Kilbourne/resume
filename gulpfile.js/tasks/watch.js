var gulp = require('gulp'),
    browserSync = require("browser-sync").get('My server'),
    runSequence = require('run-sequence'),
    configBrowsersync = require('../gulpconfig').browsersync,
    configWatch = require('../gulpconfig').watch;
var webpack = require('webpack'),
    webpackConfig = require('../webpack.config'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware');

gulp.task('watch', ['build'], function(callback) {

    var bundler = webpack(webpackConfig);
    configBrowsersync.proxymiddleware = [
        webpackDevMiddleware(bundler, {
            // IMPORTANT: dev middleware can't access config, so we should
            // provide publicPath by ourselves
            publicPath: webpackConfig.output.publicPath,

            // pretty colored output
            stats: { colors: true },
            noInfo: true
                // for other settings see
                // http://webpack.github.io/docs/webpack-dev-middleware.html
        }),
        // bundler should be the same as above
        webpackHotMiddleware(bundler)
    ];
    browserSync.init(configBrowsersync);
    runSequence(
        'watch-font-css',
        'watch-styles',
        'watch-scripts',
        'watch-templates', ['watch-fonts', 'watch-images'],
        'watch-config',
        'watch-other-format',
        callback
    );
});

gulp.task('watch-config', function() {
    gulp.watch(configWatch.configFiles, ['clean', 'build']);
});
