const path = require('path');
const argv = require('yargs').argv;
const paths = require('./build/paths');


/**
 * Webpack configuration
 * Run using "webpack" or "npm run build"
 */
module.exports = {
    // Entry points locations.
    entry:'./src/scripts/index.js',

    // (Output) bundle locations.
    output: {
        path: paths.jsDir,
        filename: '[name].js', // file
        chunkFilename: '[name].bundle.js',
        publicPath: '/public/scripts/',
    },

    // Modules
    module: {
        rules: [
            // .js
            {
                test: /.js?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    }
                }
            },
        ]
    },

    // Use --production to optimize output.
    // mode: isProduction ? 'production' : 'development',
    mode: '--production',

};
