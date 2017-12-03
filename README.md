# starter-basic
Gulp-based starter kit for basic web project

Super simple starting point for a basic website. Done the old fashioned way with style and script includes on the html page, but with added SASS, and concatenation and minification for the final build.
Included is a web server with live reload: changes to the source are automatically injected into the browser or triggers a reload.

From the console cd to the project directory and run the start script: npm run start.
Files are served from the src folder (once the SASS task has completed and compiled styles.css) on http://localhost:3000. References to third party vendor styles and scripts in the node_modules folder are allowed and will also be loaded.
Gulp watches for changes to html, scss and js files, and also the images folder - and are either injected into the browser directly or else triggers a page refresh.
Ctrl + C to stop the server.

To build the production version, run the build script: npm run build
All styles and scripts are concatenated and minified to styles.min.css and bundle.min.js respectively. Destination path and filename are set in the build comments in the HTML.

To clean the build folder, run: npm run clean


Getting started
===============
First install all the dependencies:

npm install


Development dependencies
------------------------

Gulp & plugins:
+ gulp-sass
+ gulp-cssnano
+ gulp-eslint
+ gulp-uglify
+ gulp-imagemin
+ gulp-cache
+ gulp-useref
+ gulp-if

Browsersync
Del
Run Sequence

NOTE! Eslint may require the package 'ajv' to be installed manually:
npm install ajv --save-dev

Project Dependencies
--------------------
Included in this starter kit is jquery and normalize.css. You can uninstall these if not required:

npm uninstall jquery normalize.css


Javascript
==========

NOTE!
Now using babel to compile the Javascript so that we can use ES6 code.
The challenge here is that while in theory ES6 is backwards compatible, in practice sometimes older javascript libraries don't seem to work properly when Babel compiles them.

You can tell babel to ignore/not parse certain files by passing an ignore option to babel in the gulpfile.

Unfortunately Useref concatenates files within build blocks before piping to babel.
If a non ES6 script is broken by babel, you will need to create another build block in the html containing the offending file, and then use the ignore option in the gulp task.
In this setup we are separating vendor scripts and telling babel to ignore them. If the vendor scripts are Babel-friendly, feel free to move them into a single build block. If more control is needed, please look at using starter-site or gulp-webpack instead.
