'use strict';

var gulp = require('gulp');
var merge = require('merge');
var sourcemaps = require('gulp-sourcemaps');
var rename = require("gulp-rename");
var minify = require('gulp-minify');
var rollup = require('gulp-better-rollup');
var resolve = require( 'rollup-plugin-node-resolve' );
var commonjs = require( 'rollup-plugin-commonjs' );
var typescript = require( '@alexlur/rollup-plugin-typescript' );



function invoke( options ) {
    
    var defaults = {
        bundle:'main',
        dest:'public/out',
        globalName: 'app',
		src: './src/main.ts',
        minify: { 
            ext: { min:'.min.js' }
        },
        rollup: {
            format: 'iife',
            plugins: [
				typescript(),
				resolve( { jsnext: true, main: true, browser:true } ),
				commonjs()
			]
        }
	}
    
	// merge options with default values
	options = merge.recursive( defaults, options );

    // inject the module name
    options.rollup.moduleName = options.globalName;
    
    // bundle function for reference
    function bundle() {
        return gulp.src( options.src )
		.pipe( sourcemaps.init() )
		.pipe( rollup( options.rollup, options.rollup.format ) )
		.pipe( rename( options.bundle + '.js' ) )
		.pipe( sourcemaps.write( '' ) )
		.pipe( minify( options.minify ) )
        .pipe( gulp.dest( options.dest ) );
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