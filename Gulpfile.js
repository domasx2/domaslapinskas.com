var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    browserify = require('browserify'),
    livereload = require('gulp-livereload'),
    runSequence = require('run-sequence'),
    source = require('vinyl-source-stream'),
    rimraf = require('gulp-rimraf'),
    babelify = require('babelify'),
    nodemon = require('gulp-nodemon'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    streamify = require('gulp-streamify'),
    argv = require('yargs').argv;

var isProduction = argv.production !== undefined;

var PATHS = {
    STYL: 'src/stylesheets/style.styl',
    STYL_ALL: 'src/stylesheets/**/*.styl',
    JS: 'src/js/**/*.js',
    JSMAIN: 'src/js/index.js',
    JADE: 'views/*'

};


//delete everything from dist before rebuild
gulp.task('clean', function() {
    return gulp.src('dist/*', { read: false }) // much faster 
    .pipe(rimraf());
});


//compile stylus to css
gulp.task('stylus', function () {
    return gulp.src(PATHS.STYL)
        .pipe(stylus())
        .pipe(gulp.dest('dist'))
        .pipe(livereload());
});

//javascript file
gulp.task('javascript', function () {
    return browserify({entries: PATHS.JSMAIN})
    .transform(babelify)
    .bundle().on('error', function (err) {
        console.error(err.toString());
        this.emit("end");
    })
    .pipe(source('app.js'))
    .pipe(gulpif(isProduction, streamify(uglify())))
    .pipe(gulp.dest('./dist/'))
    .pipe(livereload());
});

gulp.task('livereload', function() {
    livereload.reload();
});

//watch sources and rebuild
gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(PATHS.STYL_ALL, ['stylus']);
    gulp.watch(PATHS.JS, ['javascript']);
    gulp.watch(PATHS.JADE, ['livereload']);
});

gulp.task('serve', function () {
    nodemon({
        script: 'index.js',
        ignore: ['dist/*'],
        env: { 'NODE_ENV': 'development' }
    });
});

gulp.task('build', function (cb) {
    runSequence('clean', ['stylus', 'javascript'], cb);
});

gulp.task('develop', function (cb) {
    runSequence('build', ['watch', 'serve'], cb);
});

gulp.task('default', ['build']);