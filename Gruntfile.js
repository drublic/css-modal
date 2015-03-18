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
				'test/spec/*.js',
				'plugins/**/*.js'
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
					style: 'expanded',
					loadPath: '.',
					update: true,
					sourcemap: 'none'
				},
				files: {
					'test/modal.css': 'test/modal.scss'
				}
			},

			dist: {
				options: {
					unixNewlines: true,
					loadPath: '.',
					update: true,
					sourcemap: 'none'
				},
				files: {
					'build/modal.css': 'modal.scss',
					'build/modal-gallery.css': 'plugins/modal-gallery.scss',
					'build/modal-maxwidth.css': 'plugins/modal-maxwidth.scss',
					'build/modal-resize.css': 'plugins/modal-resize.scss',
					'build/modal-stretch.css': 'plugins/modal-stretch.scss',
					'build/modal-spinner.css': 'plugins/modal-spinner.scss'
				}
			}
		},

		// Copy
		copy: {
			dist: {
				files: [{
					expand: true,
					src: [
						'modal.scss',
						'modal.js'
					],
					dest: 'download/'
				}]
			}
		},

		jasmine: {
			src: 'modal.js',
			options: {
				outfile: 'test/_SpecRunner.html',
				template: 'test/index.html'
			}
		},

		// Watch that stuff
		watch: {
			scss: {
				files: ['*.scss', 'test/*.scss', 'plugins/*.scss'],
				tasks: 'sass'
			},

			hint: {
				files: [
					'modal.js',
					'test/spec/*.js',
					'plugins/**/*.js',
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
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	// Default task
	grunt.registerTask('default', ['sass:dev', 'jshint', 'jasmine']);

	// Building a new version
	grunt.registerTask('dist', ['jasmine', 'sass:dist', 'copy:dist']);

	// Travis CI task
	grunt.registerTask('travis', ['jshint', 'jasmine']);


};
