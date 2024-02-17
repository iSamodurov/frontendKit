import gulp from 'gulp';
import { nunjucksCompile } from 'gulp-nunjucks';
import imagemin from 'gulp-imagemin';
import esbuild from 'gulp-esbuild';
import autoprefixer from 'gulp-autoprefixer';
import { sassPlugin } from 'esbuild-sass-plugin'
import postcss from 'esbuild-postcss';
import pxtorem from 'postcss-pxtorem';
import sortMQ from 'postcss-sort-media-queries';
import combineMQ from 'postcss-combine-media-query';
import browserSync from 'browser-sync';
browserSync.create();

import rimraf from 'gulp-rimraf';
import newer from 'gulp-newer';
import { dirs } from './gulp/vars.js';



/* ---------- HTML ---------- */

function buildHtml(cb) {
    return gulp.src(dirs.src.pages)
        .pipe(nunjucksCompile())
        .pipe(gulp.dest(dirs.dist.root))
        .pipe(browserSync.stream());
}
async function watchHtml(cb) {
    return gulp.watch(dirs.watch.pages, buildHtml);
}



/* ---------- STYLES ---------- */

function buildStyles() {
    const options = {
        plugins: [
            sassPlugin(),
            postcss({
                plugins: [
                    combineMQ(),
                    sortMQ({ sort: 'desktop-first' }),
                    pxtorem({
                        replace: false,
                        rootValue: 16,
                        propList: ['*'],
                    }),
                ]
            }),
        ],
    };
    return gulp.src(dirs.src.styles)
        .pipe(esbuild(options))
        .pipe(autoprefixer())
        .pipe(gulp.dest(dirs.dist.styles))
        .pipe(browserSync.stream());
}

async function watchStyles(cb) {
    return gulp.watch(dirs.watch.styles, buildStyles);
}


/* ---------- SCRIPTS ---------- */

function buildScripts() {
    const options = {
        bundle: true,
        minify: true,
    };
    return gulp.src(dirs.src.scripts)
        .pipe(esbuild(options))
        .pipe(gulp.dest(dirs.dist.scripts))
        .pipe(browserSync.stream());
}

async function watchScripts(cb) {
    return gulp.watch(dirs.watch.scripts, buildScripts);
}


/* ---------- IMAGES ---------- */

function buildImages() {
    return gulp.src(dirs.src.img)
        .pipe(newer(dirs.dist.img))
        .pipe(imagemin())
        .pipe(gulp.dest(dirs.dist.img));
}
async function watchImages(cb) {
    return gulp.watch(dirs.watch.img, buildImages);
}


/* ---------- ASSETS ---------- */

function copyFonts() {
    return gulp.src(dirs.src.fonts)
        .pipe(gulp.dest(dirs.dist.fonts));
}

function copyPublicAssets() {
    return gulp.src(dirs.public)
        .pipe(gulp.dest(dirs.dist.root));
}

// function copyAssets() {
//     return gulp.src([dirs.public, dirs.src.fonts])
//         .pipe(gulp.dest(dirs.dist.root));
// }

let copyAssets = gulp.parallel(copyFonts, copyPublicAssets);

async function watchAssets(cb) {
    return gulp.watch(dirs.public, copyAssets);
}


/* ---------- HELPERS ---------- */
function clean(cb) {
    return gulp.src(dirs.dist.root)
        .pipe(rimraf());
}

async function serve(cb) {
    return browserSync.init({
        server: {
            baseDir: dirs.dist,
        }
    });
}


/* ---------- TASKS ---------- */

const dev = gulp.series(
    gulp.parallel(copyAssets, buildImages, buildStyles, buildScripts),
    buildHtml,
    gulp.parallel(watchAssets, watchImages, watchHtml, watchStyles, watchScripts, serve),
);

const build = gulp.series(
    clean,
    copyAssets,
    gulp.parallel(buildStyles, buildScripts, buildHtml),
);


export { dev, clean }
export default build;