const gulp  = require('gulp');
const ts    = require('gulp-typescript');
const clean = require('gulp-clean');

gulp.task('tsc', function(){
    return gulp.src('src/**/*.ts')
        .pipe(ts({
            module: 'commonjs',
            moduleResolution: 'node'
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('clean', function(){
    return gulp.src('build', {read: false})
        .pipe(clean());
})