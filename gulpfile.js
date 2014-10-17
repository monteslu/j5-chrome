var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var browserify = require('browserify');



gulp.task('browserifySandbox', function() {
    return browserify('./sandbox.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('sandbox.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./build/'));
});

gulp.task('browserifyUI', function() {
    return browserify('./ui.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('ui.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./build/'));
});

gulp.task('copyBootstrap', function(){
    gulp.src('./bootstrap/**')
    .pipe(gulp.dest('./build/bootstrap'));
});

gulp.task('copyEditor', function(){
    gulp.src('./editor/**')
    .pipe(gulp.dest('./build/editor'));
});

gulp.task('copy', function() {
    gulp.src(['./*.png', './manifest.json', './*.html', './background.js'])
    .pipe(gulp.dest('./build/'));
});

gulp.task('default', ['browserifySandbox','browserifyUI', 'copy', 'copyBootstrap', 'copyEditor'], function() {

});
