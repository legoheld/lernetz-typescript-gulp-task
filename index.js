var gulp = require('gulp');
var merge = require('merge');
var sourcemaps = require('gulp-sourcemaps');
var ts = require( 'gulp-typescript');
var uglify = require('gulp-uglify');
var mergeStream = require('merge2');
var rename = require("gulp-rename");


module.exports = function( options ) {
	
	var bundle = ( options.bundle ) ? options.bundle : 'main';
	
	var defaults = {
		ts: {
			out: bundle + '.js',
			declarationFiles: true
		},
		src:'**/*.ts',
		dest:'js'
	}
	
	// merge options with default values
	options = merge( defaults, options );
	
	// create typescript project for incemental compile
	var tsProject = ts.createProject( options.ts );
	
	// return task function
	return function() {
		
		// do gulp stuff
		var result = gulp.src( options.src )
		.pipe( sourcemaps.init() )
		.pipe( ts( tsProject ) );

		return mergeStream( [
		                     
		    // write out declaration file
			result.dts.pipe( gulp.dest( options.dest ) ),
			
			// write sourcemaps
			result.js.pipe( sourcemaps.write() )
			
			// write original file
			.pipe( gulp.dest( options.dest ) )
			
			// create minified version
			.pipe( uglify() )
			.pipe( rename( bundle + '.min.js' ) )
			.pipe( gulp.dest( options.dest ) )
			
		]);
	}
}