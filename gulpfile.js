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
      preLoaders: [
        { test: /\.json$/, loader: 'json'},
      ],
      loaders: [
        { test: /\.json$/, loader: "json-loader" },
        { test: /\.jsx$/, loader: 'jsx-loader?harmony=true' },
        { test: /\.css$/, loader: 'style-loader!css-loader' },
        { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
        { test: /ui\.js$/, loader: "transform?brfs" }
      ]
    },
    plugins: [
      new webpack.IgnorePlugin(/^serialport$/)
    ],
    externals: {
      repl: 'repl'
    },
    resolveLoader: {
      // this is a workaround for loaders being applied
      // to linked modules
      root: path.join(__dirname, 'node_modules')
    },
    resolve: {
      // this is a workaround for aliasing a top level dependency
      // inside a symlinked subdependency
      root: path.join(__dirname, 'node_modules'),
      alias: {
        // replacing `fs` with a browser-compatible version
        net: 'chrome-net',
        serialport: 'browser-serialport'
      }
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
