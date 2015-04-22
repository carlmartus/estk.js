var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('js', function() {
	gulp.src('js/*.js')
		.pipe(uglify())
		.pipe(concat('estk.min.js'))
		.pipe(gulp.dest('.'));
});

gulp.task('watch', ['js'], function() {
	gulp.watch('js/*.js', ['js']);
});

gulp.task('default', ['js']);

