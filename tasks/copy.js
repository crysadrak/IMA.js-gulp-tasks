
var gulp = require('gulp');

module.exports = function (gulpConfig) {
	var files = gulpConfig.files;

	gulp.task('copy:appStatic', function () {
		var filesToMove = [
			'./app/assets/static/**/*.*',
			'./app/assets/static/*.*'
		];
		return (
			gulp
				.src(filesToMove)
				.pipe(gulp.dest(files.server.dest + 'static/'))
		);
	});

	gulp.task('copy:imajsServer', function () {
		var filesToMove = [
			'./imajs/server/**/*.*',
			'./imajs/server/*.*'
		];

		return (
			gulp
				.src(filesToMove)
				.pipe(gulp.dest(files.server.base + 'ima/'))
		);
	});

	gulp.task('copy:environment', function () {
		var filesToMove = [
			'./app/environment.js'
		];

		return (
			gulp
				.src(filesToMove)
				.pipe(gulp.dest(files.server.base + 'ima/config/'))
		);
	});
};
