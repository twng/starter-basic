/* eslint-env node */
import gulp from 'gulp';
import sass from 'gulp-sass';
import browserSync from 'browser-sync';
import eslint from 'gulp-eslint';
import gulpif from 'gulp-if';
import useref from 'gulp-useref';
import runSequence from 'run-sequence';
import uglify from 'gulp-uglify';
import cssnano from 'gulp-cssnano';
import del from 'del';
import imagemin from 'gulp-imagemin';
import cache from 'gulp-cache';
import babel from 'gulp-babel';

const debug = require('gulp-debug');


gulp.task('sass', () => {
    return gulp.src("./src/scss/*.scss") // dont include partials directory
        .pipe(sass())
        .pipe(gulp.dest("./src/assets/css"))
        .pipe(browserSync.stream());
});

gulp.task('eslint', () => {
    return gulp.src("./src/js/**/*.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('images', () => {
    return gulp.src('./src/assets/img/**/*.+(png|jpg|jpeg|gif|svg)')
      // Caching images that ran through imagemin
      .pipe(cache(imagemin()))
      .pipe(gulp.dest('./dist/assets/img'))
})

gulp.task('useref', () => {
    return gulp.src('./src/*.html')
      .pipe(useref())
      .pipe(debug({title: 'useref files'}))
      .pipe(gulpif('*.js', babel({
            presets: ['env'],
            ignore: ['src/assets/js/vendors.min.js']
        })))
      .pipe(gulpif('*.js', uglify()))
      .pipe(gulpif('*.css', cssnano()))
      .pipe(gulp.dest('./dist'));
});

gulp.task('serve', ['sass'], () => {
    browserSync.init({
        server: {
            baseDir : ["./src"],
            routes: {
                "/node_modules" : "./node_modules"
            }
        },
        browser: ["firefox"]
    });
});

// Clean output directories
gulp.task('clean', () => {
    return del(["./dist/**/*"], {dot: false});
});

// Copy all other assets
gulp.task('copy', () => {
    // copies everything in assets folder except for css, js and images
    return gulp.src(['./src/assets/**/*', '!./src/assets/{css,js,img}/**/*'])
        .pipe(gulp.dest('./dist/assets'));

});

gulp.task('default', ['serve'], () => {
    // watch files
    gulp.watch("src/scss/**/*.scss", ['sass']);
    gulp.watch("src/js/**/*.js", browserSync.reload);
    gulp.watch("src/*.html", browserSync.reload);
    gulp.watch("src/assets/img/**/*", browserSync.reload);
    // note: for some reason gulp watch wont work for images if an absolute path is given eg. ./src
});


gulp.task('build', (callback) => {
    runSequence('clean', 'sass', 'eslint', ['useref', 'images', 'copy'], callback);
});

gulp.task('serve:dist', () => {
    browserSync.init({
        server: {
            baseDir : ["./dist"]
        },
        browser: ["firefox"]
    });
});
