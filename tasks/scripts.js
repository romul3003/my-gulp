'use strict';

const gulp = require('gulp')
const combine = require('stream-combiner2').obj;
const uglify = require('gulp-uglify-es').default;
const $ = require('gulp-load-plugins')();

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function(options) {

    return function() {
        return combine(
            gulp.src(options.src, {since: gulp.lastRun(options.taskName)}),
                $.if(isDevelopment, $.sourcemaps.init() ),
                $.concat(options.rename),
                // uglify({mangle: {toplevel: true}}),
                $.if(!isDevelopment, uglify({mangle: {toplevel: true}}) ),
                $.if(isDevelopment, $.sourcemaps.write() ),
                gulp.dest(options.dst)
        ).on('error', $.notify.onError(function(err) {
            return {
                title: 'Scripts Error',
                message: err.message,
                sound: false
            }
        }));
    };
};