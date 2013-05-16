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
				'site/js/main.js',
				'tests/spec/modal.js'
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
					'site/css/main.css': 'site/scss/page.scss',
					'tests/modal.css': 'tests/modal.scss'
				}
			},

			dist: {
				options: {
					unixNewlines: true,
					style: 'expanded'
				},
				files: {
					'download/modal.css': 'modal.scss'
				}
			}
		},

		less: {
			dev: {
				options: {
				},
				files: {
					'tests/modal.css': 'tests/modal.less'
				}
			},

			dist: {
				options: {
					yuicompress: true
				},
				files: {
					'download/modal.css': 'modal.less'
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
				outfile: 'tests/_SpecRunner.html',
				template: 'tests/index.html'
			}
		},

		// Watch that stuff
		watch: {
			scss: {
				files: ['modal.scss', 'site/scss/**/*.scss', 'tests/*.scss'],
				tasks: 'sass:dev'
			},

			less: {
				files: ['modal.less', 'tests/*.less'],
				tasks: 'less:dev'
			},

			hint: {
				files: [
					'modal.js',
					'site/js/main.js',
					'tests/spec/modal.js'
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
	grunt.loadNpmTasks('grunt-contrib-less');

	// Default task
	//grunt.registerTask('default', ['sass', 'jshint', 'jasmine']);
	grunt.registerTask('default', ['less', 'jshint', 'jasmine']);

	// Building a new version
	//grunt.registerTask('dist', ['jasmine', 'sass:dist', 'copy:dist']);
	grunt.registerTask('dist', ['jasmine', 'less:dist', 'copy:dist']);

	// Travis CI task
	grunt.registerTask('travis', ['jshint', 'jasmine']);


};
