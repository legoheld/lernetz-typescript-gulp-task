# lernetz-typescript-gulp-task
This node module wraps several gulp plugins executions into one reusable gulp task.
The main goal of the task is to compile a set of typescript files into a single js file.
It automatically creates a minified version and injects the sourcemaps.
It uses browserify/tsify for compilation that allows to bundle any modules into one file.


## Usage
The following example will compile all the files under the folder `typescript` into to output folder `public`.
It creates the files:
* demo.js - the uncompressed js source including the sourcemap
* demo.min.js - the minified js file

```javascript
var gulp = require('gulp');
var tsTask = require( 'lernetz-typescript-gulp-task' );

gulp.task( 'typescript', tsTask( { bundle:'demo', dest:'public', require:'./main.ts:moduleName', add:'./other.ts' } ) );
```

## Options
The task accepts an parameter object with the following attributes:
```javascript
{
    bundle: 'name', // the name of the files to create
    require: './index.ts:moduleName', // optional a path to a module that can be required with the given : "moduleName". Use an array of path:module strings to require multiple modules
    add: './file.ts', // optional a file that is added to the build process. Use an array of paths to add multiple files.
	dest: 'public', // the destination used in gulp.dest( .. )
    browserify: { .. }, // the settings for browserify: https://github.com/substack/node-browserify#browserifyfiles--opts
}
```