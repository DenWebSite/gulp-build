const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const clean = require('gulp-clean')

const avif = require('gulp-avif')
const webp = require('gulp-webp')

const imagemin = require('gulp-imagemin')
const cached = require('gulp-cached')

function images() {
    return src(['app/images/src/*.*', '!app/images/src/*.svg'])
        .pipe(webp({ quality: 50 }))
        .pipe(dest('app/images/dist'))

        .pipe(src(['app/images/src/*.*', '!app/images/src/*.svg']))
        .pipe(imagemin())
        .pipe(dest('app/images/dist'));
}

const browserSync = require('browser-sync').create();

function styles() {
    return src('app/scss/style.scss')
        .pipe(scss().on('error', scss.logError))
        .pipe(concat('style.min.css'))
        .pipe(cleanCSS())
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
}

function script() {
    return src([
        'app/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream());
}

function watching() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });

    watch(['app/scss/style.scss'], styles);
    watch(['app/js/main.js'], script);
    watch(['app/*.html']).on('change', browserSync.reload);
}

function cleanDist() {
    return src('dist')
        .pipe(clean())
}

function building() {
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/**/*.html',
    ], { base: 'app' })
        .pipe(dest('dist'))
}


exports.styles = styles;
exports.script = script;
exports.images = images;
exports.watching = watching;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, script, watching);