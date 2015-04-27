# lernetz-typescript-gulp-task
This node module wraps several gulp plugins executions into one reusable glup task.
The main goal of the task is to compile a set of typescript files into a single js file.
It automatically creates a minified version and injects the sourcemaps.


## Usage
The following example will compile all the files under the folder `typescript` into to output folder `public`.
It creates the files:
* demo.js - the uncompressed js source including the sourcemap
* demo.min.js - the minified js file
* demo.d.ts - the declaration file to be used in other projects

```javascript
var gulp = require('gulp');
var tsTask = require( 'lernetz-typescript-gulp-task' );

gulp.task( 'typescript', tsTask( { bundle:'demo', out:'public', src:'typescript/**/*.ts' } );
```

## Options
The task accepts an parameter object with the following attributes:
```javascript
{
    bundle: 'name', // the name of the files to create
    src: 'src/**.ts', // the source parameter for the gulp.src( .. )
    dest: 'public', // the destination used in gulp.dest( .. )
    ts: { .. }, // the settings for the gulp-typescript plugin: https://www.npmjs.com/package/gulp-typescript#options
}
```