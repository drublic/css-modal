module.exports = function (grunt) {

	'use strict';

	// Project configuration.
	grunt.initConfig({
		pkg: require('./package'),
		meta: {
			banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %> */'
		},

		// JSHint
		jshint: {
			all: [
				'Gruntfile.js',
				'modal.js',
				'site/js/main.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		// Building CSS
		sass: {
			dev: {
				options: {
					unixNewlines: true,
					style: 'expanded'
				},
				files: {
					'site/css/main.css': 'site/scss/page.scss'
				}
			}
		},

		// Watch that stuff
		watch: {
			scss: {
				files: ['modal.scss', 'site/scss/**/*.scss'],
				tasks: 'sass:dev'
			},

			hint: {
				files: [
					'modal.js',
					'site/js/main.js'
				],
				tasks: 'jshint'
			},

			test: {
				files: ['modal.js'],
				tasks: 'jasmine'
			}
		},

		// Server config
		connect: {
			server: {
				options: {
					port: 9001,
					keepalive: true
				}
			}
		}
	});

	// Load some stuff
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Default task
	grunt.registerTask('default', ['sass', 'jshint', 'jasmine']);

};
