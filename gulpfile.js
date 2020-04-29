const { series, parallel, src, dest, watch } = require('gulp');

const typograf = require('gulp-typograf');
const nunjucks = require('gulp-nunjucks');
const webpack = require('webpack-stream');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const postcss = require('gulp-postcss');
const postcssImport = require("postcss-import");
const pxtorem = require('postcss-pxtorem');
const combineMQ = require('postcss-combine-media-query');
const sortMQ = require('postcss-sort-media-queries');
const browserSync = require('browser-sync').create();

const newer = require('gulp-newer');
const image = require('gulp-image');

const mode = (process.env.NODE_ENV == 'production') ? 'production' : 'development';

/**
 * ==================================
 *      B U I L D   H T M L
 * ==================================
 */

const njkOptions = { autoescape: false }
const njkData = {};

function html() {
	return src('./src/pages/*.html')
	.pipe(nunjucks.compile(njkData, njkOptions))
	.pipe(typograf({ 
		locale: ['ru', 'en-US'],
		disableRule: ['ru/other/phone-number'],
		enableRule: ['common/number/digitGrouping'],
		safeTags: [
			['<\\?php', '\\?>'],
			['<no-typography>', '</no-typography>']
		],
	}))
	.pipe(dest('./dest/'))
	.pipe(browserSync.reload({ stream: true }));
}
function watchHtml() {
	watch('./src/pages/**/*.html', html);
}

/**
 * ==================================
 *      B U I L D   S T Y L E S
 * ==================================
 */
function buildStyles() {
	const plugins = [
		postcssImport(),
		combineMQ(),
		sortMQ({ sort: 'desktop-first' }),
		pxtorem({
			replace: false,
			rootValue: 16,
			propList: ['*'],
		}),
	];
	
	return src('./src/styles/main.scss')
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(postcss(plugins))
		.pipe(dest('dest/css/'))
		.pipe(browserSync.stream());
}

function watchStyles() {
	watch('./src/styles/**/*.scss', buildStyles);
}



/**
 * ==================================
 *      B U I L D   S C R I P T S
 * ==================================
 */
function scripts() {
	let watch = (mode == 'production') ? false : true;

	const config = {
		watch: watch,
		mode: mode,
		entry: {
			'main': './src/js/main.js',
			'app': './src/js/app.js',
		},
		output: {
			path: __dirname,
			filename: '[name].js'
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader'
				}
			]
		},
		plugins: [
			new VueLoaderPlugin()
		]
	};

	return src('./src/js/*.js')
		.pipe(webpack(config))
		.pipe(dest('dest/js/'))
		.pipe(browserSync.stream());
}


/**
 * ==================================
 *          I M A G E S
 * ==================================
 */

function images() {
	return src('src/img/**/*.*')
	.pipe(newer('dest/img/'))
	.pipe(image({
		pngquant: true,
		mozjpeg: true,
		svgo: false,
      	concurrent: 10,
	}))
	.pipe(dest('dest/img/'))
	.pipe(browserSync.reload({ stream: true }));
}
function watchImages() {
	watch('src/img/**/*.*', images);
}

/**
 * ==================================
 *          V E N D O R S
 * ==================================
 */

function vendors() {
	let scripts = [
		'node_modules/custom-event-polyfill/polyfill.js',
		'node_modules/realprogress/dist/realprogress.min.js',
	];
	return src(scripts)
		.pipe(dest('dest/js/vendors/'));
}


/**
 * ==================================
 *     B R O W S E R   S Y N C 
 * ==================================
 */

function serve() {
	browserSync.init({
		// proxy: "october.loc",
		port: 1234,
		server: {
			baseDir: "./dest/",
		},
	});
}



exports.dev = series(
	vendors,
	images,
	parallel(html, buildStyles),
	parallel(watchImages, watchStyles, scripts, watchHtml, serve),
);

exports.build = series(
	parallel(images, buildStyles, vendors, scripts, html),
);