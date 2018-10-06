'use strict';

const gulp = require('gulp');
const combine = require('stream-combiner2').obj;
const $ = require('gulp-load-plugins')();

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function(options) {

    return function() {
        return gulp.src(options.src, {since: gulp.lastRun(options.taskName)})
            .pipe($.if(!isDevelopment, $.rev()))
            .pipe(gulp.dest(options.dst))
            .pipe($.if(!isDevelopment, combine($.rev.manifest('img.json'), gulp.dest('manifest'))));
    };

};