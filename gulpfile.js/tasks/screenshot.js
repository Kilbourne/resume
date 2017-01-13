const Pageres = require('pageres');
const gulp = require('gulp');
var responsive = require('gulp-responsive');
var fs = require('fs'),
    del = require('del'),
    config = require('../gulpconfig').screenshot,
    data = { data: JSON.parse(fs.readFileSync(config.data, 'utf8')) };

const urls = data.data.work[0].highlights;

gulp.task('cleanshot', function() {
    del([config.path + '*',
        '!' + config.path + config.nodelete
    ])
});
gulp.task('screenshot', function(cb) {
    const pageres = new Pageres(config.options);
    urls.filter(function(el, i) {
            return config.filter.indexOf(el.title) === -1;
        })
        .forEach(function(el, i) {
            var screenSizes =
                (config.sites[el.title] && config.sites[el.title].screensizes) ? config.sites[el.title].screensizes :
                config.defaultScrSize;
            pageres.src(el.url, screenSizes)
                .dest(config.src);
        });
    return pageres.run(function(err, i) {
        if (err) {
            console.log(err);
        }
        console.log('done', i);
    }).then(function() {});

});
var responsiveTask = function(cb) {
    var format = '*.' + config.options.format;
    var breakpoints = {};
    breakpoints[format] = config.breakpoints;
    return gulp.src(config.src + format)
        .pipe(responsive(breakpoints))
        .pipe(gulp.dest(config.path));
}
gulp.task('responsive-screenshot', responsiveTask);

gulp.task('screenshot1', ['cleanshot',
    'screenshot',
]);

gulp.task('screenshot2', [
    'screenshot'
], responsiveTask);
