var argv = process.env.ENV === 'production',
    runSequence = require('run-sequence'),
    devUrl = process.env.DEVURL,
    printBase = process.env.PRINTBASE,
    manifestSrc = './assets/manifest.json',
    supportedBrowser = [
        'last 2 versions',
        'android 2.3',
        'android 4',
        'ie 10-11'
    ];

var manifest = require('asset-builder')(manifestSrc);

var path = manifest.paths;
var source = path.source;
var dist = path.dist;


var config = manifest.config || {};

var globs = manifest.globs;
var project = manifest.getProjectGlobs();




module.exports = {
    browsersync: {
        files: ['*.html'],
        proxy: {
            target: devUrl,

        }

    },
    manifest: {
        dist: dist,
        revManifest: dist + 'assets.json',
        browsersync: { match: '**/*.{js,css}' },
        rev: { base: dist, merge: true },
        manifest: manifest
    },

    watch: {
        configFiles: ['./*', 'assets/manifest.json']
    },

    scripts: {
        src: source + 'scripts',
    },
    styles: {
        src: source + 'styles',
        project: project.css,
        browsers: supportedBrowser,
        sass: {
            outputStyle: 'nested', // libsass doesn't support expanded yet
            precision: 10,
            includePaths: ['.'],
            errLogToConsole: true
        },
        minify: {
            advanced: false,
            rebase: false
        },
        sourceMap: {
            sourceRoot: source + 'styles/'
        },
        globsBase: 'styles',
        manifestDir: 'styles'
    },
    images: {
        dist: dist + 'images',
        globs: globs.images,
        imagemin: {
            progressive: true,
            interlaced: true,
            svgoPlugins: [{ removeUnknownsAndDefaults: false }, { cleanupIDs: false }]
        }
    },
    fonts: {
        src: source + 'fonts',
        dist: dist + 'fonts',
        globs: globs.fonts,
        css: '/**/stylesheet.css',
        scssName: '_fonts.scss',
        header: '/* !!! WARNING !!! \nThis file is auto-generated. \nDo not edit it or else you will lose changes next time you compile! */\n\n',
        scssDest: source + ['styles/global/'],
        urlReplace: "../fonts/"
    },
    util: {
        clean: [dist]
    },
    pdf: {
        options: {
            "format": "A4", // allowed units: A3, A4, A5, Legal, Letter, Tabloid
            "orientation": "portrait", // portrait or landscape
            "header": {
                "height": "0mm",
            },
            "footer": {
                "height": "0mm",
            },
            "base": printBase, // Base path that's used to load files (images, css, js) when they aren't referenced using a host
            "type": "pdf"
        },
        srcDir: 'assets/data',
        distDir: 'dist',
        filename: 'resume',
        srcFilename: 'print'
    },
    screenshot: {
        data: 'assets/data/resume.json',
        options: { delay: 10, filename: '<%= url %>', crop: true, timeout: 90000000000, format: 'jpg' },
        path: 'assets/images/siteshot/',
        src: 'assets/siteshot/',
        breakpoints: [{
            width: 450,
            rename: { suffix: '-small' }
        }, {
            height: 450
        }],
        sites: {
            "Maison Tatiana Faberge": { screensizes: ["1200x1570"] },
            "Biogena": { screensizes: ["747x948"] },
            "Opensource in Medicine": { screensizes: ["1200x1640"] },
            "I pregi d'Italia": {}
        },
        filter: ["I pregi d'Italia"],
        defaultScrSize: ['1200x890'],
        defaultSizesattr: '(max-width: 750px) 300px 225px',
        nodelete: 'ipregiditalia.it.jpg'
    }
}
