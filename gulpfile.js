const gulp = require('gulp');
const del = require('del');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const handlebars = require('gulp-compile-handlebars');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const ext = require('gulp-ext-replace');

const server = require('browser-sync').create();

const path = {
  'server': './public',
  'html': {
    'dest': 'public',
    'src': 'src/hbs',
    'files': '**/*.hbs',
  },
  'images': {
    'dest': 'public/assets/img',
    'src': 'src/img',
    'files': '**/*.{gif,png,jpg,svg}'
  },
  'styles': {
    'dest': 'public/assets/css',
    'src' : 'src/scss',
    'files': '**/*.scss',
  },
  'scripts': {
    'dest': 'public/assets/js',
    'src': 'src/js',
    'files': '**/*.js'
  }
}

// Helper: Clean
// Delete generated files
const clean = () => del(['public']);

// Task: HTML
gulp.task('html', () => {
  gulp.src([`${path.html.src}/${path.html.files}`, `!${path.html.src}/partials/${path.html.files}`])
    .pipe(plumber({ errorHandler: function(err) {
      notify.onError({
        title: 'Gulp error in ' + err.plugin,
        message:  err.toString()
      })(err);
    }}))
    .pipe(handlebars({}, {
      batch: `${path.html.src}/partials`
    }))
    .pipe(ext('.html'))
    .pipe(gulp.dest(path.html.dest));
});

// Task: Images
// Uses image min to process project image files
gulp.task('img', () => {
  gulp.src(`${path.images.src}/${path.images.files}`)
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest(path.images.dest));
});

// Task: CSS
// Generate SCSS dependencies, custom code, compress it and prefix it,
// then compile into single file for best performance in HTTP/1.1
gulp.task('css', () => {
  gulp.src([`${path.styles.src}/${path.styles.files}`])
    .pipe(plumber({ errorHandler: function(err) {
      notify.onError({
        title: 'Gulp error in ' + err.plugin,
        message: err.toString()
      })(err);
    }}))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'] // Adjust this to our requirements in a config file
    }))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(path.styles.dest));
});

// Task: JavaScript
// Uses Babel to allow modern JavaScript to be used.
gulp.task('js', () => {
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
});

// Task: Reload BrowserSync server
gulp.task('reload', () => {
  server.reload();
});

// Task: BrowserSync server configuration and watch paths
gulp.task('server', () => {
  server.init({
    browser: 'google chrome',
    notify: false,
    open: false,
    server: {
      baseDir: path.server
    }
  });

  gulp.watch(`${path.html.src}/${path.html.files}`, gulp.series('html', 'reload'));
  gulp.watch(`${path.images.src}/${path.images.files}`, gulp.series('img', 'reload'));
  gulp.watch(`${path.styles.src}/${path.styles.files}`, gulp.series('css', 'reload'));
  gulp.watch(`${path.scripts.src}/${path.scripts.files}`, gulp.series('js', 'reload'));
});

// Task: Default
gulp.task('default',
  gulp.series(clean,
    gulp.parallel('html', 'img', 'css', 'js', 'server')
  )
);
