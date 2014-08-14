
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			dist: {
				src: ['includes/intro.js', 'src/*.js', 'includes/outro.js'],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				preserveComments: false,
				banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				compress: {
					global_defs: {
						DEBUG: false
					}
				}
			},
			build: {
				src: 'dist/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		jsonlint: {
			pkg: {
				src: ['package.json']
			},
			bower: {
				src: ['bower.json']
			}
		},
		jshint: {
			options: {
				reporter: require('jshint-stylish')
			},
			all: {
				src: [
					'src/**/*.js',
					'Gruntfile.js'
				],
				options: {
					jshintrc: true
				}
			}
		},
		jscs: {
			src: 'src/**/*.js',
			grunt: 'Gruntfile.js'
		},
		watch: {
			scripts: {
				files: ['src/**/*.js'],
				tasks: ['dev']
			}
		}
	});

	require('load-grunt-tasks')(grunt, { pattern: ['grunt-*', '!grunt-template-jasmine-requirejs'] });

	grunt.registerTask('dev', ['jsonlint', 'jshint', 'jscs']);
	grunt.registerTask('build', ['dev', 'concat', 'uglify']);
	grunt.registerTask('default', ['build']);
};
