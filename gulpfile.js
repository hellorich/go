const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');

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
  gulp.src(`${path.scripts.src}/${path.scripts.files}`)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest(path.scripts.dest));
  done();
});

// Task: Default
gulp.task('default',
  gulp.series(clean,
    gulp.parallel('js')
  )
);
