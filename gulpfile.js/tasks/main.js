var gulp = require('gulp'),
    runSequence = require('run-sequence');

gulp.task('build', ['clean'], function(callback) {
    runSequence(
        'font-css',
        'criticalcss',
        'scripts', ['fonts', 'images'],
        'templates', 'other-format',

        callback);
});

gulp.task('start', function() {
    gulp.start('watch');
});
gulp.task('default', ['start']);
