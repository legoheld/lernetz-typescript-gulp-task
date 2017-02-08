# lernetz-typescript-gulp-task
This node module wraps several gulp plugins executions into one reusable gulp task.
The main goal of the task is to compile a set of typescript files into a single js file.
It automatically creates a minified version and injects the sourcemaps.
It internally uses rollup with treeshaking for a smallest as possible filesize.
Rollup is setup to bundle also npm packages. This allows to use npm packages in our source typescript.
You need to install the required types for typescript see: https://blogs.msdn.microsoft.com/typescript/2016/06/15/the-future-of-declaration-files/
And also install the library itself with npm so rollup can find and bundle it.


## Usage
The following example will compile the file `Main.ts` and bundle all its dependencies into to the output folder `public`.
It creates the following js files:
* bundle.js - the uncompressed js source including the sourcemap
* bundle.min.js - the minified js file
The resulting js file exposes the exported functions/variables of `Main.ts` under the globalName: `module`.

```javascript
var gulp = require('gulp');
var bundle = require( 'lernetz-typescript-gulp-task' );

gulp.task( 'bundle', bundle( { bundle:'bundle', dest:'public', src:'Main.ts', globalName:'module' } ) );
```

## Options
The task accepts an parameter object with the following attributes:
```javascript
{
    bundle: 'name', // the name of the files to create
	dest: 'public', // the destination used in gulp.dest( .. )
    globalName: 'app', // the global available variable to access the code
	src: './src/Main.ts', // the source the the main typescript file
    minify: { ext: { min:'.min.js' } }, // default options for minify that you can overwrite: https://www.npmjs.com/package/gulp-minify#options
    rollup: { format: 'iife', plugins: [ typescript(), resolve( { jsnext: true, main: true, browser:true } ), commonjs() ] } // default options for the rollup task that you can overwrite: https://www.npmjs.com/package/gulp-better-rollup#rollupoptions
}
```