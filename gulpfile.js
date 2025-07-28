const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
// const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean')

const browserSync = require('browser-sync').create();

function styles() {
    return src('app/scss/style.scss')
        // .pipe(autoprefixer({overrideBrowserList: ['last 10 version']}))
        .pipe(scss().on('error', scss.logError))
        .pipe(concat('style.min.css'))
        .pipe(cleanCSS())
        .pipe(dest('app/css'))
        .pipe(browserSync.stream());
}

function script() {
    return src([
        'node_modules/swiper/swiper-bundle.js',
        'app/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream());
}

function watching() {
    watch(['app/scss/style.scss'], styles);
    watch(['app/js/main.js'], script);
    watch(['app/*.html']).on('change', browserSync.reload);
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
}

function cleanDist(){
    return src('dist')
        .pipe(clean())
}

function building(){
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/**/*.html',
    ], {base : 'app'})
    .pipe(dest('dist'))
}


exports.styles = styles;
exports.script = script;
exports.watching = watching;
exports.browsersync = browsersync;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, script, browsersync, watching);