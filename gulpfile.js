const gulp = require('gulp');
const webpack = require('webpack-stream');
const WebpackMessages = require('webpack-messages');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const nunjucks = require('gulp-nunjucks');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const minimist = require('minimist');
const image = require('gulp-image');
const newer = require('gulp-newer');
const gulpif = require('gulp-if');
const plumber = require('gulp-plumber');

const postcss = require('gulp-postcss');
const cssImport = require("postcss-import");


var args = minimist(process.argv.slice(2));



/* ---------------------------------------
    H T M L
--------------------------------------- */

gulp.task('html:build', () =>
    gulp.src('src/pages/*.html')
        .pipe(plumber())
        .pipe(nunjucks.compile())
        .pipe(gulp.dest('build/'))
        .pipe(reload({stream: true}))        
);

gulp.task('html:watch', function () {
    gulp.watch('src/pages/**/*.html', ['html:build']);
});



/* ---------------------------------------
    S C R I P T S
--------------------------------------- */
gulp.task('js', function (done) {

    let mode = (args.env == 'production') ? 'production' : 'development';    
    let watch = (args.env == 'production') ? false : true;

    let config = {
        watch: watch,
        mode: mode,
        output: {
            path: __dirname,
            filename: "main.js"
        },
        plugins: [
            new WebpackMessages({
                name: 'client',
                logger: str => console.log(`>> ${str}`)
            })
        ]
    }

    return gulp.src("src/js/main.js")        
        .pipe(webpack(config, null, done))
        .pipe(gulp.dest("build/js/"))
        .pipe(browserSync.stream());
});



/* ---------------------------------------
    S T Y L E S
--------------------------------------- */
gulp.task('sass:build', function () {
    let plugins = [
        cssImport()
    ]

    return gulp.src('src/styles/main.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(gulpif(args.env === 'development', sourcemaps.write()))
        .pipe(gulp.dest('build/css/'))
        .pipe(browserSync.stream());
});
gulp.task('sass:watch', function () {
    gulp.watch('src/styles/**/*.scss', ['sass:build']);
});



/* ---------------------------------------
    I M A G E S
--------------------------------------- */
gulp.task('images:build', function () {
    return gulp.src('src/img/**/*.*')
        .pipe(plumber())
        .pipe(newer('build/img/'))
        .pipe(image())
        .pipe(gulp.dest('build/img/'))
        .pipe(reload({stream: true}))     
});
gulp.task('images:watch', function () {
    gulp.watch('src/images/**/*.*', ['images:build']);
});



/* ---------------------------------------
    S E R V E R
--------------------------------------- */
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "./build"
        },
        tunnel: false        
    });
});






gulp.task('watch', gulp.parallel('sass:watch', 'html:watch', 'images:watch'));
gulp.task('build', gulp.parallel('js', 'images:build', 'sass:build', 'html:build') );

//gulp.task('default', gulp.parallel('build', 'serve', 'watch'));
gulp.task('default', gulp.series( 'build', 'serve', 'watch' ));