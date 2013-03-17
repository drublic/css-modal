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
				'js/main.js'
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
					'css/main.css': 'scss/page.scss',
					'tests/modal.css': 'tests/modal.scss'
				}
			},

			dist: {
				options: {
					unixNewlines: true,
					style: 'expanded'
				},
				files: {
					'download/modal.css': 'scss/_modal.scss'
				}
			}
		},

		// Copy
		copy: {
			dist: {
				files: [{
					src: [
						'scss/_modal.scss',
						'js/modal.js'
					],
					dest: 'download/'
				}]
			}
		},

		// Watch that stuff
		watch: {
			scss: {
				files: ['scss/**/*.scss', 'tests/*.scss'],
				tasks: 'sass:dev'
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
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	// Default task
	grunt.registerTask('default', ['sass', 'jshint']);

	// Building a new version
	grunt.registerTask('dist', ['sass:dist', 'copy:dist']);

};
