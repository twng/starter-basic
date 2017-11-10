/* eslint-env node */
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var gulpif = require('gulp-if');
var useref = require('gulp-useref');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var del = require('del');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');


gulp.task('sass', function() {
    return gulp.src("./src/scss/*.scss") // dont include partials directory
        .pipe(sass())
        .pipe(gulp.dest("./src/assets/css"))
        .pipe(browserSync.stream());
});

gulp.task('eslint', function() {
    return gulp.src("./src/js/**/*.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('images', function() {
    return gulp.src('./src/assets/img/**/*.+(png|jpg|jpeg|gif|svg)')
      // Caching images that ran through imagemin
      .pipe(cache(imagemin()))
      .pipe(gulp.dest('./dist/assets/img'))
})

gulp.task('useref', function() {
    return gulp.src('./src/*.html')
      .pipe(useref())
      .pipe(gulpif('*.js', uglify()))
      .pipe(gulpif('*.css', cssnano()))
      .pipe(gulp.dest('./dist'));
});

gulp.task('serve', ['sass'], function() {
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
gulp.task('clean', function() {
    return del(["./dist/**/*"], {dot: false});
});

// Copy all other assets
gulp.task('copy', function() {
    // copies everything in assets folder except for css, js and images
    return gulp.src(['./src/assets/**/*', '!./src/assets/{css,js,img}/**/*'])
        .pipe(gulp.dest('./dist/assets'));

});

gulp.task('default', ['serve'], function() {
    // watch files
    gulp.watch("src/scss/**/*.scss", ['sass']);
    gulp.watch("src/js/**/*.js", browserSync.reload);
    gulp.watch("src/*.html", browserSync.reload);
    gulp.watch("src/assets/img/**/*", browserSync.reload);
    // note: for some reason gulp watch wont work for images if an absolute path is given eg. ./src
});


gulp.task('build', function(callback) {
    runSequence('clean', 'sass', 'eslint', ['useref', 'images', 'copy'], callback);
});

gulp.task('serve:dist', function() {
    browserSync.init({
        server: {
            baseDir : ["./dist"]            
        },
        browser: ["firefox"]
    });
});
