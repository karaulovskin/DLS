'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var prefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var stylus = require('gulp-stylus');
var rigger = require('gulp-rigger');
var pug = require('gulp-pug');
var svgSprite = require("gulp-svg-sprites");
var rupture = require('rupture');
var babel = require("gulp-babel");

var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var rimraf = require('rimraf');

var browserSync = require("browser-sync");
var reload = browserSync.reload;

var path = {
    build: {
        pug: 'assets/',
        htmlFrom: 'assets/**',
        htmlTo: '../../../../html/',
        jsVendors: 'assets/js/',
        js: 'assets/js/',
        styleVendors: 'assets/css/',
        style: 'assets/css/',
        img: 'assets/img/',
        fonts: 'assets/fonts/',
        icons: 'assets/icons/'
    },
    src: {
        pug: 'src/pages/*.pug',
        jsVendors: 'src/js/vendors.js',
        js: 'src/js/main.js',
        styleVendors: 'src/style/vendors.styl',
        style: 'src/style/main.styl',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        icons: 'src/img/icons/*.svg'
    },
    watch: {
        pug: 'src/**/*.pug',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.styl',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        icons: 'src/img/icons/*.svg'
    },
    clean: './assets'
};

gulp.task('pug:build', function () {
    return gulp.src(path.src.pug)
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(path.build.pug))
        .pipe(reload({stream: true}));
});

gulp.task('jsVendors:build', function () {
    return gulp.src(path.src.jsVendors)
        .pipe(rigger())
        .pipe(uglify())
        .pipe(gulp.dest(path.build.jsVendors))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    return gulp.src(path.src.js)
        .pipe(babel())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('styleVendors:build', function () {
    return gulp.src(path.src.styleVendors)
        .pipe(stylus({'include css': true}))
        .pipe(gulp.dest(path.build.styleVendors))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    return gulp.src(path.src.style)
        .pipe(stylus({ use: rupture() }))
        .pipe(prefixer({
            browsers: 'last 5 versions'
        }))
        .pipe(gulp.dest(path.build.style))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    return gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('sprite:build', function () {
    return gulp.src(path.src.icons)
        .pipe(svgSprite({
            mode: "symbols",
            selector: "icon-%f"
        }))
        .pipe(gulp.dest(path.build.icons))
});

gulp.task('moveHtmlFolder:build', function () {
    return gulp.src(path.build.htmlFrom)
        .pipe(gulp.dest(path.build.htmlTo))
});

gulp.task('webserver', function(){
    browserSync.init({
        server: './assets',
    });
    browserSync.watch('./assets').on('change', browserSync.reload);
});

gulp.task('clean', function (cb) {
    return rimraf(path.clean, cb);
});

gulp.task(
  'build',
  gulp.series(gulp.parallel('pug:build', 'jsVendors:build', 'js:build', 'styleVendors:build', 'style:build', 'fonts:build', 'image:build', 'sprite:build', 'moveHtmlFolder:build'))
);

gulp.task('watch', function() {
    gulp.watch([path.watch.pug], gulp.series('pug:build'));
    gulp.watch([path.watch.style], gulp.series('styleVendors:build'));
    gulp.watch([path.watch.style], gulp.series('style:build'));
    gulp.watch([path.watch.js], gulp.series('jsVendors:build'));
    gulp.watch([path.watch.js], gulp.series('js:build'));
    gulp.watch([path.watch.img], gulp.series('image:build'));
    gulp.watch([path.watch.fonts], gulp.series('fonts:build'));
    gulp.watch([path.watch.icons], gulp.series('sprite:build'));
});

gulp.task(
  'default',
  gulp.series(gulp.parallel('build', 'webserver', 'watch'))
);