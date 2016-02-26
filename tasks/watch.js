
var gulp = require('gulp');
var cache = require('gulp-cached');
var flo = require('fb-flo');
var fs = require('fs');
var gutil = require('gulp-util');
var remember = require('gulp-remember');
var watch = require('gulp-watch');

var sharedState = require('../gulpState.js');

module.exports = function (gulpConfig) {
	var files = gulpConfig.files;

	gulp.task('watch', function () {

		runOnChange(files.app.watch, 'app:build');
		runOnChange(files.ima.watch, 'ima:build');
		runOnChange(files.less.watch, 'less');
		runOnChange(files.server.watch, 'server:build');
		runOnChange(files.locale.watch, 'locale:build');
		runOnChange('./app/assets/static/**/*', 'copy:appStatic');

		gulp.watch([
			'./ima/**/*.{js}',
			'./app/**/*.{js,jsx}',
			'./build/static/js/locale/*.js'
		]).on('change', function (e) {
			sharedState.watchEvent = e;

			if (e.type === 'deleted') {
				if (cache.caches['Es6ToEs5:app'][e.path]) {
					delete cache.caches['Es6ToEs5:app'][e.path];
					remember.forget('Es6ToEs5:app', e.path);
				}

				if (cache.caches['Es6ToEs5:ima'][e.path]) {
					delete cache.caches['Es6ToEs5:ima'][e.path];
					remember.forget('Es6ToEs5:ima', e.path);
				}
			}
		});

		flo(
			'./build/static/',
			{
				port: 5888,
				host: 'localhost',
				glob: [
					'**/*.css',
					'**/*.js'
				]
			},
			function (filepath, callback) {
				gutil.log('Reloading \'public/' + gutil.colors.cyan(filepath) +
					'\' with flo...');

				var fileContents = fs.readFileSync('./build/static/' + filepath);
				callback({
					resourceURL: 'static/' + filepath,
					contents: fileContents.toString()
				});
			}
		);

		function runOnChange(files, tasks) {
			watch(files, function () {
				gulp.start(tasks);
			});
		}
	});
};
