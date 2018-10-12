'use strict';

const gulp = require('gulp');
const combine = require('stream-combiner2').obj;
const resolver = require('stylus').resolver;
const $ = require('gulp-load-plugins')();

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function(options) {

    return function() {

        let resolve = resolver();
        let manifest;
        if (!isDevelopment) {
            manifest = require(options.manifest + 'img.json');
        }

        function url(urlLiteral) {
            urlLiteral = resolve.call(this, urlLiteral);
            for (let asset in manifest) {
                if (urlLiteral.val == `url("${asset}")`) {
                    urlLiteral.string = urlLiteral.val = `url("${manifest[asset]}")`;
                }
            }
            return urlLiteral;
        }

        url.options = resolve.options;
        url.raw = true;

        return combine(
            gulp.src(options.src),
            $.if(isDevelopment, $.sourcemaps.init()),
            $.stylus({
                import: process.cwd() + '/tmp/styles/sprite',
                define: {
                    url: url
                },
                'include css': true
            }),
            $.autoprefixer({
                browsers: ['last 3 versions'],
                cascade: false,
                grid: true
            }),
            $.if(isDevelopment, $.sourcemaps.write()),
            $.if(!isDevelopment, combine($.cssnano(), $.rev())), // index-abcdef.css long term caching
            gulp.dest(options.dst),
            $.if(!isDevelopment, combine($.rev.manifest('css.json'), gulp.dest('manifest')))
        ).on('error', $.notify.onError(function(err) {
            return {
                title: 'Stylus Error',
                message: err.message,
                sound: false
            }
        }));
    };
};