const fs = require('fs'),
      gulp = require('gulp'),
      clean = require('gulp-clean'),
      include = require('gulp-include'),
      watch = require('gulp-watch'),
      sass = require('gulp-sass'),
      batch = require('gulp-batch'),
      zip = require('gulp-zip');

gulp.task('clean', function() {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('build', ['clean'], function() {
    gulp.src('index.js')
        .pipe(include())
        .on('error', console.log)
        .pipe(gulp.dest('dist'));

    gulp.src('index.scss')
        .pipe(sass()).on('error', sass.logError)
        .pipe(gulp.dest('dist'));
});

gulp.task('release', function() {
    // noinspection JSAnnotator
    let info = JSON.parse(fs.readFileSync('package.json')),
        zipFileName = `${info.name}-v${info.version}.zip`;

    // noinspection JSAnnotator
    console.log(`Packaging ${zipFileName}`);

    gulp.src('dist/**/*', { base: 'dist/'})
        .pipe(zip(zipFileName))
        .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
    watch(['index.js', 'index.scss', 'src/javascripts/**/*.js',
        'src/stylesheets/**/*.scss'], batch(function(events, done) {
            gulp.start('build', done);
        }));
});

gulp.task('default', ['build']);