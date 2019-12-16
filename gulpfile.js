////////////////////////////////////////////////////
// ToDo
////////////////////////////////////////////////////
// - compileJs
// - - buffer
// - - uglify
// - - sourcemaps
// - - linting
// - - es6?
////////////////////////////////////////////////////

const gulp = require( 'gulp' );
const babelify = require( 'babelify' );
const browserify = require( 'browserify' );
const browserSync = require( 'browser-sync' ).create();
const log = require( 'fancy-log' );
const nunjucksRender = require('gulp-nunjucks-render');
const concat = require( 'gulp-concat' );
const scss = require( 'gulp-dart-sass' );
const sourcemaps = require( 'gulp-sourcemaps' );
const cssnano = require( 'cssnano' );
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const uglify = require( 'gulp-uglify' );
const buffer = require( 'vinyl-buffer' );
const source = require( 'vinyl-source-stream' );
const del = require( 'del' );
const mocha = require('gulp-mocha');

// directories
const dirs = require( './gulp/dirs' ).dirs;



// TASKS

// clean dist folders
function clean(){
	return (
		del( [ dirs.distDir ] )
	);
};

// expose task to cli	
exports.clean = clean;


// browseryify js

function compileJs(){
	return (
		browserify({
    		entries: dirs.src.jsBundleEntry,
    		debug: true
  		})
		.bundle()
		.on( 'error', err => {
			log.error( "Browserify js compile error:" + err.message );
			process.exit(1);
		})
		.pipe( source( 'main.js' ) )
		// .pipe( buffer() )
		// .pipe( uglify() )
		// .pipe( sourcemaps.init( { loadMaps: true } ) )
		// .pipe( sourcemaps.write( './maps') )
		.pipe( gulp.dest( dirs.dist.js ) )
	);
};

// expose task to cli	
exports.compileJs = compileJs;



// compile templates (nunjucks)
function compileHtml(){
	return (
		gulp
			.src( dirs.src.templates )
			.pipe( nunjucksRender( {
	      		path: 'src/templates/'
		    } ) )
		    .pipe( gulp.dest( dirs.dist.html ) )
	);
};

// expose task to cli	
exports.compileHtml = compileHtml;



// move html
function moveHtml(){
	return (
		gulp
			.src( `${ dirs.srcDir }/*.html` )
			.pipe( gulp.dest( dirs.dist.html ) )
			.on( "end", function() { log.info( 'html moved' ) } )
	);
};

// expose task to cli	
exports.moveHtml = moveHtml;


// move favicons
function moveFavicon(){
	return (
		gulp
			.src( dirs.src.favicon )
			.pipe( gulp.dest( dirs.dist.root ) )
			.on( "end", function() { log.info( 'favicon moved' ) } )
	);
};

// expose task to cli	
exports.moveFavicon = moveFavicon;


// move favicons
function moveImages(){
	return (
		gulp
			.src( dirs.src.images )
			.pipe( gulp.dest( dirs.dist.images ) )
			.on( "end", function() { log.info( 'images moved' ) } )
	);
};

// expose task to cli	
exports.moveFavicon = moveImages;


// concatenate vendor libraries
function vendorJs(){
	return (
		gulp
			.src( dirs.vendorLibs )
			.pipe( concat( 'vendor.js' ) )
    		.pipe( gulp.dest( dirs.dist.js ) )
	);
}

// expose task to cli	
exports.vendorJs = vendorJs;


// compile scss
function sass(){
	return (
        gulp
	        .src( dirs.src.scss )
	        .pipe( scss() )
	        .on( "error", scss.logError )
	        // Use postcss with autoprefixer and compress the compiled file using cssnano
            .pipe( postcss( [ autoprefixer(), cssnano() ] ) )
            // Now add/write the sourcemaps
            .pipe( sourcemaps.write() )
	        .pipe( gulp.dest( dirs.dist.css ) )
	        .pipe( browserSync.stream() )
    );
}

// expose task to cli	
exports.scss = scss;



// move data
function moveData(){
	return (
		gulp
			.src( dirs.src.data )
    		.pipe( gulp.dest( dirs.dist.data ) )
	);
}

// expose task to cli	
exports.moveData = moveData;



// browsersync reload function
function reload( done ) {
    browserSync.reload();
    done();
}

// browsersync file watcher
function watch(){
	browserSync.init({
        // You can tell browserSync to use this directory and serve it as a mini-server
        open: false,
        server: {
            baseDir: "./dist/"
        }
        // If you are already serving your website locally using something like apache
        // You can use the proxy setting to proxy that instead
        // proxy: "yourlocal.dev"
    });
    browserSync.reload();

    gulp.watch( dirs.src.scss , sass );
    gulp.watch( dirs.src.js, gulp.series( compileJs, reload ) );
    gulp.watch( dirs.src.templates, gulp.series( compileHtml, reload ) );
    gulp.watch( dirs.src.images, gulp.series( moveImages, reload ) );
}



// testing
function tests() {
	return (
		gulp
			.src( './test/tests.js', { read: false } )
			.pipe( mocha( {reporter: 'nyan' } ) )
	);
}

// expose task to cli
exports.tests = tests;



// build task
exports.build = gulp.series(
	gulp.series( clean ), 
	gulp.parallel( vendorJs, compileJs, compileHtml, moveHtml, moveFavicon, moveImages, moveData, sass )
);

// watch task
exports.watch = watch;