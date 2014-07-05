'use strict';
// generated on 2014-06-15 using generator-gulp-webapp 0.1.0

var gulp = require('gulp'),
    path = require('path');

// load plugins
var $ = require('gulp-load-plugins')();

var PORT = 5000,
    OUTPUT = '_public',
    TMP = '_tmp';

gulp.task('jade', function () {
    // render jade files excepts templates
    return gulp.src(['app/**/*.jade', '!app/**/_*.jade', '!app/common/**/*.jade', '!app/partials/**/*.jade'])
        .pipe($.jade())
        .pipe(gulp.dest(TMP + '/'));
});

gulp.task('styles', ['fonts'], function () {
    return gulp.src(['app/styles/app.less'])
        .pipe($.less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest(TMP + '/styles'))
        .pipe($.size());
});

gulp.task('scripts', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});

gulp.task('html', ['jade', 'styles', 'scripts'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src(['app/*.html', TMP + '/**/*.html', TMP + '/**/*.{eot,svg,ttf,woff}'])
        .pipe($.useref.assets({searchPath: '{' + TMP + ',app}'}))
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.rev())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(gulp.dest(OUTPUT))
        .pipe($.size());
});

gulp.task('images', function () {
    return gulp.src('app/imgs/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(OUTPUT + '/imgs'))
        .pipe($.size());
});

gulp.task('fonts', function () {
    return gulp.src(['app/bower_components/**'], { dot: true })
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest(TMP + '/fonts'))
        .pipe($.size());
});

gulp.task('extras', function () {
    return gulp.src(['app/*.*', '!app/*.html', '!app/**/*.jade'], { dot: true })
        .pipe(gulp.dest(OUTPUT));
});

gulp.task('clean', function () {
    return gulp.src([TMP, OUTPUT], { read: false }).pipe($.rimraf());
});

gulp.task('build', ['html', 'images', 'extras']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('connect',['jade', 'styles', 'scripts', 'images', 'extras'], function () {
    var connect = require('connect');
    var app = connect()
        .use(connect.static('app'))
        .use(connect.static(TMP))
        .use(connect.directory('app'));

    require('http').createServer(app)
        .listen(PORT)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:' + PORT);
        });
});

gulp.task('watch', ['connect'], function () {
    gulp.watch('app/styles/**/*.less', ['styles']);
    gulp.watch('app/**/*.jade', ['jade']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/imgs/**/*', ['images']);
    gulp.watch('bower.json', ['wiredep']);
});
