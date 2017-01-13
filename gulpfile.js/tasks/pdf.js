const gulp = require('gulp'),
    fs = require('fs'),
    del = require('del'),
    pdf = require('html-pdf'),
    config = require('../gulpconfig').pdf;
const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(p + "/" + f).isDirectory());


gulp.task('other-format', function() {
    var langs = dirs(config.srcDir);
    langs.unshift('default');
    langs.forEach(function(lang) {
        var subd = '/' + (lang === 'default' ? '' : lang + '/'),
            path1 = config.distDir + subd;
        removeOtherFormat(path1 + config.filename);

        createPdf(path1 + config.srcFilename, path1 + config.filename);
        copyJson(config.srcDir + subd + config.filename, path1);
    });
});

function removeOtherFormat(path) {
    return del.bind(null, path + '.{pdf,json}');
}

function createPdf(src, dist) {
    console.log(src);
    return pdf.create(fs.readFileSync(src + '.html', 'utf8'), config.options).toFile(dist + '.pdf', function() {});
}

function copyJson(src, dist) {
    return gulp.src(src + '.json').pipe(gulp.dest(dist));
}
gulp.task('watch-other-format', function() {
    gulp.watch([config.srcDir + '/**/' + config.filename + '.html'], ['other-format']);
});
