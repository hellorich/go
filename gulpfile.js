const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps')

const path = {
  'scripts': {
    'dest': 'public/assets/js',
    'src': 'src/js',
    'files': '**/*.js'
  }
}

// Helper: Clean
// Delete generated files
const clean = () => del(['public']);

// Task: JavaScript
// Uses Babel to allow modern JavaScript to be used.
gulp.task('js', (done) => {
  browserify({
    extensions: ['.js'],
    entries: `${path.scripts.src}/app.js`,
    debug: true
  })
  .transform('babelify', { presets: ['@babel/env'] })
  .bundle()
  .pipe(source('app.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest(path.scripts.dest));
  done();
});

// Task: Default
gulp.task('default',
  gulp.series(clean,
    gulp.parallel('js')
  )
);
