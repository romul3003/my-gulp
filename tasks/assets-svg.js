'use strict';

const gulp = require('gulp');
const svgSprite = require('gulp-svg-sprite');
const $ = require('gulp-load-plugins')();

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function(options) {

    return function() {
        return gulp.src(options.src)
            .pipe(svgSprite({
                mode: {
                    css: {
                        dest:       '.', // where to put style && sprite, default: 'css'
                        bust:       !isDevelopment,
                        sprite:     'sprite.svg', // filename for sprite relative to dest
                        layout:     'vertical',
                        prefix:     '$', // .svg-
                        dimensions: true,
                        render:     {
                            styl: {
                                dest: 'sprite.styl'  // filename for .styl relative to dest^
                            }
                        }
                    }
                }
            }))
            .pipe($.debug({title: 'styles:svg'}))
            .pipe($.if('*.styl', gulp.dest(options.tmp), gulp.dest(options.dst)));
    };

};