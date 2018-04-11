module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //compile sass to css
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'css/app.css': 'scss/app.scss'
                }
            }
        },

        //add all css
        concat_css: {
            options: {
                // Task-specific options go here.
            },
            all: {
                src: [
                    'css/**/*.css',
                    '!css/app.css',
                    '!css/compiled_scss.css',
                    '!css/bootstrap'
                ],
                dest: "css/app.css"
            }
        },

        //add support for es 5.1
        browserify: {
            dist: {
                options: {
                    transform: [['babelify', {presets: ['env']}]]
                },
                src: ['js/app.js'],
                dest: 'js/compiled/app.js'
            }
        },

        //easy development
        watch: {
            css: {
                files: [
                    'css/**/**.css',
                    '!css/app.css',
                    '!css/compiled_scss.css',
                    '!css/bootstrap'
                ],
                tasks: ['concat_css']

            },
            scss: {
                files: [
                    'scss/**/*.scss',
                ],
                tasks: ['sass']
            },

            js: {
                files: [
                    'js/*.js',
                    'js/**/*.js',
                    '!js/*.min.js',
                    '!js/compiled/*',
                    '!**/node_modules/**'
                ],
                tasks: ['browserify']
            }
        }

    });
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['watch']);
};