const fs = require('fs'),
      gulp = require('gulp'),
      clean = require('gulp-clean'),
      include = require('gulp-include'),
      rename = require('gulp-rename'),
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
});

gulp.task('release', function() {
    let info = JSON.parse(fs.readFileSync('package.json')),
        zipFileName = `${info.name}-v${info.version}.zip`;

    console.log(`Packaging ${zipFileName}`);

    gulp.src('dist/**/*', { base: 'dist/'})
        .pipe(zip(zipFileName))
        .pipe(gulp.dest('.'));
});

gulp.task('default', ['build']);