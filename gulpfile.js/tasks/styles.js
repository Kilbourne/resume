var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({ camelize: true }),
    config = require('../gulpconfig').styles,
    argv = process.env.ENV === 'production',
    del = require('del'),
    runSequence = require('run-sequence'),
    writeToManifest = require('./manifest').writeToManifest,
    manifest = require('../gulpconfig').manifest.manifest,
    lazypipe = require('lazypipe'),
    merge = require('merge-stream'),
    browserSync = require("browser-sync").get('My server');


var cssTasks = function(filename) {
    return lazypipe()
        .pipe(function() {
            return $.plumber();
        })
        .pipe(function() {
            return $.if(!argv, $.sourcemaps.init());
        })
        .pipe(function() {
            return $.if('*.scss', $.sass(config.sass));
        })
        .pipe($.concatUtil, filename)
        .pipe($.autoprefixer, { browsers: config.browsers })
        .pipe($.cssnano, config.minify)
        .pipe(function() {
            return $.if(!argv, $.sourcemaps.write('.', config.sourceMap));
        })();
};

gulp.task('styles', ['sass-vars'], function() {
    var merged = merge();
    manifest.forEachDependency('css', function(dep) {
        var cssTasksInstance = cssTasks(dep.name);

        cssTasksInstance.on('error', function(err) {
            console.error(err.message);
            this.emit('end');
        });

        merged.add(gulp.src(dep.globs, { base: config.globsBase })
            .pipe(cssTasksInstance));
    });

    return merged
        .pipe(writeToManifest('styles'));
});

gulp.task('sass-vars', function() {
    var baseURL = process.env.DEVURL ? process.env.DEVURL : '';
    del.bind(null, 'assets/styles/global/_env.scss');
    return gulp.src('assets/styles/env.scss')
        .pipe($.preprocess({ context: { PATH: baseURL } }))
        .pipe($.rename({ prefix: '_' }))
        .pipe(gulp.dest('assets/styles/global/'));
});

gulp.task('watch-styles', function() {
    gulp.watch([config.src + '/**/*', '!assets/styles/global/_env.scss', '!assets/styles/critical/*.css'], function(callback) { runSequence('criticalcss', 'reload-templates') });
});

gulp.task('css-module', function() {
    return gulp.src(['assets/styles/**/*.scss', '!assets/styles/main.scss', '!assets/styles/env.scss'])
        .pipe($.sass(config.sass))
        .pipe(gulp.dest('assets/styles/cssmodule'));
});

gulp.task('criticalcss', ['styles'], function() {
    del.bind(null, 'assets/styles/critical/*.css');
    return gulp.src(['./assets/styles/critical/*.scss', '!./assets/styles/critical/_*.scss'])
        .pipe($.plumber())
        .pipe(
            $.sass(config.sass)
        )
        .pipe($.autoprefixer({ browsers: config.browsers }))
        .pipe($.cssnano(config.minify))
        .pipe(gulp.dest('./assets/styles/critical'));
});
