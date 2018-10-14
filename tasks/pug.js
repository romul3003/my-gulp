'use strict';

const gulp = require('gulp');
const revReplace = require('gulp-rev-replace');
const combine = require('stream-combiner2').obj;
const $ = require('gulp-load-plugins')();

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function(options) {

    return function() {
        return combine(
            gulp.src(options.src),
            // $.if(isDevelopment, $.pug({pretty: true})),     // depricated
            $.pug(),
            $.if(!isDevelopment, revReplace({
                manifest: gulp.src('manifest/css.json', {allowEmpty: true})
            })),
            $.if(!isDevelopment, revReplace({
                manifest: gulp.src('manifest/webpack.json', {allowEmpty: true})
            })),
            gulp.dest(options.dst)
        ).on('error', $.notify.onError(function(err) {
            return {
                title: 'Pug Error',
                message: err.message,
                sound: false
            }
        }));

    };
};