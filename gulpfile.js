'use strict';

var path = require('path');

var gulp = require('gulp');
var webpack = require('webpack');

gulp.task('bundle', function(cb) {
  webpack({
    entry: {
      ui: './ui',
      sandbox: './sandbox'
    },
    output: {
      path: path.join(__dirname, './build'),
      filename: '[name].js'
    },
    module: {
      loaders: [
        { test: /\.jsx$/, loader: 'jsx-loader?harmony=true' },
        { test: /\.css$/, loader: 'style-loader!css-loader' },
        { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
        { test: /ui\.js$/, loader: "transform?brfs" }
      ]
    },
    externals: {
      repl: 'repl'
    }
  }, cb);
});

gulp.task('copyBootstrap', function(){
  return gulp.src('./bootstrap/**')
    .pipe(gulp.dest('./build/bootstrap'));
});

gulp.task('copy', function() {
  return gulp.src(['./*.png', './manifest.json', './*.html', './background.js', './*.css'])
    .pipe(gulp.dest('./build/'));
});

gulp.task('default', ['bundle', 'copy', 'copyBootstrap']);
