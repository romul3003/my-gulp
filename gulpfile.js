'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

// const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

function lazyRequireTask(taskName, path, options) {
    options = options || {};
    options.taskName = taskName;
    gulp.task(taskName, function(callback) {
        let task = require(path).call(this, options);

        return task(callback);
    });
}

lazyRequireTask('pug', './tasks/pug', {
    src: 'src/pug/pages/*.pug',
    dst: 'public'
});

lazyRequireTask('styles', './tasks/styles', {
    src: 'src/styles/index.styl',
    dst: 'public/styles/',
    manifest: '../manifest/'
});

lazyRequireTask('scripts:lib', './tasks/scripts-lib', {
    src: ['bower_components/jquery/dist/jquery.min.js', 'bower_components/slick-carousel/slick/slick.min.js'],
    dst: 'public/js/',
    rename: 'libs.min.js'
});

lazyRequireTask('scripts', './tasks/scripts', {
    src: 'src/js/*.js',
    dst: 'public/js/',
    rename: 'index.js'
});

lazyRequireTask('clean', './tasks/clean', {
    dst: ['public', 'tmp', 'manifest']
});

lazyRequireTask('serve', './tasks/serve', {
    src: 'public'
});

lazyRequireTask('assets:img', './tasks/assets-img', {
    src: 'src/styles/**/*.{png, jpg}',
    dst: 'public/styles'
});

lazyRequireTask('assets:svg', './tasks/assets-svg', {
    src: 'src/styles/**/*.svg',
    dst: 'public/styles',
    tmp: 'tmp/styles'
});

gulp.task('watch', function() {
    gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
    gulp.watch(['src/styles/**/*.styl', 'tmp/styles/sprite.styl'], gulp.series('styles'));
    gulp.watch('src/js/**/*.js', gulp.series(['scripts:lib', 'scripts']));
    gulp.watch('src/styles/**/*.{png, jpg}', gulp.series('assets:img'));
    gulp.watch('src/styles/**/*.svg', gulp.series('assets:svg'));
});

gulp.task('build', gulp.series('clean',  'assets:svg', 'assets:img', gulp.parallel('styles', 'scripts:lib', 'scripts'), 'pug'));

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));