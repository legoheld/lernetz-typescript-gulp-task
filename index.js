'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var tsify = require('tsify');
var merge = require('merge');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var streamify = require('gulp-streamify');


function invoke( options ) {
    
    var defaults = {
        bundle:'main',
        dest:'public/out',
		src: './src/main.ts',
        watch: true,
        browserify: {
            debug: true,
			basedir: '.',
            cache: {},
            packageCache: {}
        }
	}
    
	// merge options with default values
	options = merge.recursive( defaults, options );
	
	
	console.log( required );
	
    // instantiate browserify
    var bundler = browserify( options.browserify );
	
	// setup add
	if( options.add ) bundler.add( options.add );
	
	// setup require
	if( options.require ) {
		
		// prepare source definition
		var req = options.require;
		var required = ( Array.isArray( req ) ) ? req.map( mapRequire ) : [ mapRequire( req ) ];

		bundler.require( required );
	}

	bundler.plugin( tsify );
    
    // bundle function for reference
    function bundle() {
        return bundler.bundle()
        .on( 'error', gutil.log.bind( gutil, 'Browserify Error' ) )
		.pipe( source( options.bundle + '.js' ) )
		.pipe( gulp.dest( options.dest ) )
        .pipe( streamify( uglify() ) )
        .pipe( rename( options.bundle + '.min.js' ) )
        .pipe( gulp.dest( options.dest ) );
    }
    
    if( options.watch ) {
        bundler.plugin( watchify );
        bundler.on( 'log', gutil.log); // output build logs to terminal
        bundler.on( 'update', bundle );
    }
    
    return bundle;
}


/**
 * Turns the string, string array with the expose name into a { file:.., expose:.. } object array
 */
function mapRequire( src ) {
	var parts = src.split( ':' );
	var obj = { file:parts[0] };
	if( parts.length > 1 ) obj.expose = parts[1];
	return obj;
}

module.exports = invoke;