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
const autoprefixer = require('autoprefixer');
const mqpacker = require("css-mqpacker");
const sortCSSmq = require('sort-css-media-queries');


var args = minimist(process.argv.slice(2));



/* ---------------------------------------
    H T M L
--------------------------------------- */

gulp.task('html:build', () =>
    gulp.src('src/pages/*.{html, php}')
        .pipe(plumber())
        .pipe(nunjucks.compile())
        .pipe(gulp.dest('build/'))
        .pipe(reload({stream: true}))        
);

gulp.task('html:watch', function() {
    gulp.watch('src/pages/**/*.{html, php}', ['html:build']);    
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
        devtool: 'source-map',
        output: {
            path: __dirname,
            filename: "main.js"
        },
        plugins: [
            new WebpackMessages({
                name: 'client',
                logger: str => console.log(`>> ${str}`)
            })       
        ],
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ["@babel/plugin-proposal-class-properties"],
                        }
                    }
                }
            ]
        }
    }

    return gulp.src("src/js/main.js")        
        .pipe(webpack(config))
        .pipe(gulp.dest("build/js/"))
        .pipe(browserSync.stream());
});



/* ---------------------------------------
    S T Y L E S
--------------------------------------- */
gulp.task('sass:build', function () {
    let plugins = [
        cssImport(),
        autoprefixer(),
        mqpacker({
            sort: sortCSSmq.desktopFirst
        })
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
gulp.task('images:watch', function() {
    gulp.watch('src/img/**/*.*', ['images:build']);    
});


/* ---------------------------------------
    A S S E T S   &   L I B S
--------------------------------------- */
gulp.task('libs', function(){
    let libs = [
        './node_modules/sourcebuster/dist/sourcebuster.min.js'
    ]
    return gulp.src(libs)
        .pipe(gulp.dest('build/js/libs/'))
});


gulp.task('assets:move', function(){
    return gulp.src('src/assets/**/*.*')
        .pipe(gulp.dest('build/'))
});

gulp.task('php:move', function(){
    return gulp.src('src/php/**/*.*')
        .pipe(gulp.dest('build/php/'))
});




/* ---------------------------------------
    S E R V E R
--------------------------------------- */
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./build",
        },
        port: 1234,
        tunnel: false        
    });    
});




gulp.task('watch', ['sass:watch', 'html:watch', 'images:watch']);
gulp.task('build', ['js', 'libs', 'assets:move', 'images:build', 'sass:build', 'html:build', 'php:move']);

gulp.task('default', ['build', 'serve', 'watch']);
