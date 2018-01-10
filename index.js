'use strict';

var gulp = require('gulp');
var merge = require('merge');
var sourcemaps = require('gulp-sourcemaps');
var addsrc = require('gulp-add-src');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var minify = require('gulp-minify');
var rollup = require('gulp-better-rollup');
var resolve = require( 'rollup-plugin-node-resolve' );
var commonjs = require( 'rollup-plugin-commonjs' );
var typescript = require( 'rollup-plugin-typescript2' );



function invoke( options ) {
    
    var defaults = {
        bundle:'main',
        dest:'public/out',
		src: './src/main.ts',
        minify: { 
            ext: { src:'.js', min:'.min.js' }
        },
        rollup: {
            format: 'iife',
            plugins: [
				typescript( { check: false } ),
				resolve( { jsnext: true, main: true, browser:true } ),
				commonjs()
			],
            globals: {}
        },
        externals:[]
	}
    
	// merge options with default values
	options = merge.recursive( defaults, options );

    // reuse bundle name for globalName if not set
    if( !options.globalName ) options.globalName = options.bundle;

    // inject the module name
    options.rollup.moduleName = options.globalName;

    // setup externals
    var sources = options.externals.map( function( external ) { return external.source } );
    options.rollup.external = options.externals.map( function( external ) { return external.module } );
    options.externals.forEach( function( external ) {
        options.rollup.globals[ external.module ] = external.global;
    });

    // bundle function for reference
    function bundle() {
        return gulp.src( options.src )
		.pipe( sourcemaps.init() )
		.pipe( rollup( options.rollup, options.rollup.format ) )
		.pipe( concat( options.bundle + '.js' ) )
        .pipe( addsrc.prepend( sources ) )
		.pipe( sourcemaps.write( '' ) )
		.pipe( minify( options.minify ) )
        .pipe( gulp.dest( options.dest ) );
    }
    
    return bundle;
}



module.exports = invoke;