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

		uglify: {
			js: {
				files: {
					'site/dist/index.min.js': [
						'node_modules/css-modal/modal.js',
						'node_modules/jquery/dist/jquery.js',
						'site/js/prism.js',
						'site/js/page.js'
					]
				}
			}
		},

		// Building CSS
		pleeease: {
			build: {
				options: {
					sourcemaps: true,
					sass: true,
					rem: false
				},

				files: {
					'site/css/main.css': 'site/scss/page.scss'
				}
			}
		},

		// Watch that stuff
		watch: {
			scss: {
				files: ['site/scss/**/*.scss'],
				tasks: 'pleeease'
			},

			hint: {
				files: [
					'modal.js',
					'site/js/*.js'
				],
				tasks: ['jshint', 'uglify']
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
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-pleeease');

	// Default task
	grunt.registerTask('default', ['sass', 'jshint', 'uglify']);

};
