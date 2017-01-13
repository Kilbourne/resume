var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({ camelize: true }),
    fs = require('fs'),
    browserSync = require("browser-sync").get('My server'),
    data = require('gulp-data'),
    template = require('gulp-nunjucks-render'),
    nunjucks = require('gulp-nunjucks-render').nunjucks,
    filenamify = require('filenamify'),
    I18nExtension = require("nunjucks-i18n")(nunjucks),
    sizeOf = require('image-size'),
    screenConfig = require('../gulpconfig').screenshot;
var assetPath = function(str) {
    var manifest = JSON.parse(fs.readFileSync('./dist/assets.json', 'utf8'));
    return manifest ? manifest[str] : str;
};

function screenshoot(work) {
    var domain = process.env.DEVURL,
        imagePath = 'images/siteshot/' + filenamify(work.url.replace(/https?:\/\/www./, '')),
        ext = '.' + screenConfig.options.format,
        src = domain + imagePath,
        srcset = '',
        lastSrcset;
    screenConfig.breakpoints.forEach(function(element, index) {
        var suffix = (element.rename ? element.rename.suffix : '');
        if (!element.width && element.height) {
            var dimensions = sizeOf('assets/' + imagePath + suffix + ext);
            element.width = dimensions.width;
        }
        if (!element.rename) { lastSrcset = src + ext + ' ' + element.width + 'w'; } else {
            srcset += src + suffix + ext + ' ' + element.width + 'w,';
        }
    });
    srcset += lastSrcset;
    sizes = '(max-width: 750px) 300px 225px';
    return '<img src="' + src + '.' + screenConfig.options.format + '" srcset="' + srcset + '" alt="' + work.title + ' }}">';
}
var manageEnvironment = function(environment) {
    environment.addFilter('slug', function(str) {
        return str && str.replace(/\s/g, '-', str).toLowerCase();
    });

    environment.addFilter('split', function(str, seperator) {
        return str.split(seperator);
    });
    environment.addFilter('critical', function(pagename) {
        return fs.readFileSync('assets/styles/critical/' + pagename + '.css', 'utf8');
    });
    environment.addFilter('filenamify', filenamify);
    environment.addFilter('assetPath', assetPath);
    environment.addFilter('screenshoot', screenshoot);

    environment.addExtension('I18nExtension', new I18nExtension({
        env: environment,
        translations: JSON.parse(fs.readFileSync('assets/data/translations.json', 'utf8')),
        locale: 'lang'
    }));
};
const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(p + "/" + f).isDirectory());
gulp.task('templates', function(cb) {
    var langs = dirs('assets/data');
    langs.unshift('default');
    langs.forEach(function(lang, i) {
        var subd = lang === 'default' ? '' : lang + '/',
            path1 = 'assets/data/' + subd;

        var context = { data: JSON.parse(fs.readFileSync(path1 + 'resume.json', 'utf8')) };
        context.data.extra = JSON.parse(fs.readFileSync(path1 + 'extra-info.json', 'utf8'));
        context.domain = process.env.DEVURL ? process.env.DEVURL : '';
        context.lang = lang;
        var task = gulp.src('./assets/templates/pages/*')
            .pipe(data(context))
            .pipe(template({
                path: ["./assets/templates/pages/", "./assets/templates/partials/"],
                manageEnv: manageEnvironment,
                envOptions: {
                    autoescape: false
                }
            }))
            .pipe(gulp.dest('./dist/' + subd))
            .on('end', function() {
                if (i === langs.length - 1) cb();
            });

    });
});
gulp.task('reload-templates', ['templates'], function(done) {
    browserSync.reload({ stream: false });
    done();
});
gulp.task('watch-templates', function() {
    gulp.watch(['./assets/templates/**/*', 'assets/data/**/*'], ['reload-templates']);
});
