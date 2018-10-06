'use strict';

const gulp = require('gulp');
const path = require('path');
const gulplog = require('gulplog');
const AssetsPlugin = require('assets-webpack-plugin');
const uglify = require('gulp-uglify-es').default;
const $ = require('gulp-load-plugins')();


// Gulp + Webpack = ♡
const webpackStream = require('webpack-stream');
const webpack = webpackStream.webpack;
const named = require('vinyl-named');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';


module.exports = function(optionsExternal) {



    return function(callback) {

        let firstBuildReady = false;

        function done(err, stats) {
            firstBuildReady = true;

            if (err) { // hard error, see https://webpack.github.io/docs/node.js-api.html#error-handling
                return;  // emit('error', err) in webpack-stream
            }

            gulplog[stats.hasErrors() ? 'error' : 'info'](stats.toString({
                colors: true
            }));
        }

        let options = {
            mode: 'none',
            output: {
                publicPath: '/js/', // web путь, по которой находится сборка
                filename: isDevelopment ? '[name].js' : '[name]-[chunkhash:10].js'
            },
            watch:   isDevelopment,
            devtool: isDevelopment ? 'cheap-module-inline-source-map' : false,

            module: {
                rules: [
                    {
                        test: /\.js$/,
                        include: path.join(__dirname, "src"),
                        use: {
                            loader: '@babel/preset-env'
                        }
                    }
                ]
            },
            plugins: []
        };

        if (!isDevelopment) {
            options.plugins.push(new AssetsPlugin({
                filename: 'webpack.json',
                path: path.join('./', 'manifest'),
                    processOutput(assets) {
                    for (let key in assets) {
                        assets[key + '.js'] = assets[key].js.slice(options.output.publicPath.length);
                        delete assets[key];
                    }
                    return JSON.stringify(assets);
                }
            }));
        }

        return gulp.src(optionsExternal.src)
            .pipe($.plumber({
                errorHandler: $.notify.onError(err => ({
                    title:   'Webpack',
                    message: err.message
                }))
            }))
            .pipe(named())
            .pipe(webpackStream(options, null, done))
            .pipe($.if(!isDevelopment, uglify()))
            .pipe(gulp.dest(optionsExternal.dst))
            .on('data', function() {
                if (firstBuildReady) {
                    callback();
                }
            });

    };
};