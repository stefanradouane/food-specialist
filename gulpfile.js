const { src, series, dest, watch, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const prefix = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const leec = require('gulp-line-ending-corrector');
const concat = require('gulp-concat');
const sourceMaps = require('gulp-sourcemaps');

const paths = {
  styles: {
    src: './src/scss/*.scss',
    css: './src/css',
    file: './src/css/*',
    dest: './public/dist/css',
  },
  scripts: {
    src: './src/scripts/**/*.js',
    dest: './public/dist/scripts',
  },
};

// source map compress
function style() {
  return src(paths.styles.src)
    .pipe(
      sourceMaps.init({
        loadMaps: true,
      })
    )
    .pipe(sass({ includePaths: ['node_modules/microscope-sass/lib'] }))
    .pipe(prefix('last 2 versions'))
    .pipe(sourceMaps.write())
    .pipe(leec())
    .pipe(dest(paths.styles.css));
}

function concatCss() {
  return src(paths.styles.file)
    .pipe(
      sourceMaps.init({
        loadMaps: true,
        largeFile: true,
      })
    )
    .pipe(concat('all.css'))
    .pipe(minify())
    .pipe(sourceMaps.write('./maps/'))
    .pipe(leec())
    .pipe(dest(paths.styles.dest));
}

async function watchTask() {
  watch(['src/scss/*.scss'], series(style, concatCss));
  watch(['src/scss/*/*.scss'], series(style, concatCss));
  watch(['src/scss/*/*/*.scss'], series(style, concatCss));
}

exports.watch = watchTask;

exports.default = parallel(
  series(style, concatCss),
);
