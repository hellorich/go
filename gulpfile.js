const gulp = require('gulp');
const babel = require('gulp-babel');

const path = {
  'scripts': {
    'dest': 'public/assets/js',
    'src': 'src/js',
    'files': '**/*.js'
  }
}

gulp.task('js', (done) => {
  gulp.src(`${path.scripts.src}/${path.scripts.files}`)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest(path.scripts.dest));
  done();
});
