var path = require('path');
var fs = require('fs');


/** Parses package.json */
var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

/** Name of the sources directory */
var sourcesRoot = 'src/';

/** Name of the static (source) directory */
var staticRoot = 'public/';


/**
 * Application path configuration for use in frontend scripts
 */
module.exports = {
    // Parsed package.json
    package: pkg,

    jsEntry: sourcesRoot + 'js/index.js',

    // Path to js (sources)
    jsSrc: staticRoot + 'scripts/**/*.js',

    // Path to the js (sources) directory
    jsSrcDir: staticRoot + 'scripts/',

    // Path to the (transpiled) js directory
    jsDir: path.resolve('public/dist/scripts'),
};
