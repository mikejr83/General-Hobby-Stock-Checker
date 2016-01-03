module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
        'bower:install',
        'ngtemplates',
		'jst:dev',
		'less:dev',
		'copy:dev',
		'coffee:dev'
	]);
};
