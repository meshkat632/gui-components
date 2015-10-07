module.exports = function (grunt) {
    // Project configuration.
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        requirejs: {
            compileAll: {
                options: {
                    baseUrl: 'es5',
                    paths: {
                        "external": '//external',
                        "jquery": "//external/jquery",
                        "urijs": "//external/urijs",
                        "moment": "//external/moment",
                        "angular": "//external/angular",
                        "noty": "//external/noty"
                    },
                    name: "main",
                    out: "dist/script-compiled.js",
                    optimize: "none"
                }
            }
        },
        clean: {
            dist: {
                src: ['dist/*']
            },
            es5: {
                src: ["es5"]
            },
            temp: {
                src: ["es5","dist"]
            },
            extension: {
                src: ["extension/build"]
            }
        },
        copy: {
            extension: {
                cwd: 'dist/',
                src: '**/*.*',
                dest: 'extension/build',
                expand: true
            },
            pages: {
                expand: true,
                cwd: 'src/',
                src: '**/*.html',
                dest: 'dist/',
                flatten: false,
                filter: 'isFile'
            },
            vendors:{
                expand: true,
                cwd: 'bower_components/',
                src: '**/*.*',
                dest: 'extension/vendors/',
                flatten: false,
                filter: 'isFile'
            }
        },
        watch: {
            compile: {
                files: ['src/**/*.*'],
                tasks: ['clean:es5','clean:dist','babel:dist', 'requirejs:compileAll','copy:pages','copy:vendors', 'copy:extension'],
                options: {
                    interrupt: true
                }
            }
        },
        babel: {
            options: {
                modules: 'amd',
                sourceMap: false
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['**/*.js'],
                        dest: 'es5'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    //grunt.registerTask('build', ['clean:es5','clean:dist','babel:dist', 'requirejs:compileAll','copy:pages','copy:vendors', 'copy:extension', 'clean:temp']);
    grunt.registerTask('build', ['clean:extension','babel:dist', 'requirejs:compileAll','copy:pages','copy:vendors', 'copy:extension', 'clean:temp']);
};
