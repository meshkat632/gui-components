module.exports = function (grunt) {
    // Project configuration.
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        requirejs: {
            compile: {
                options: {
                    baseUrl: 'es5/js',

                    _paths: {
                        /*
                         phone: 'https://webrtcgw2.ect-telecoms.de/static/js/common/phone',
                         api: 'https://webrtcgw2.ect-telecoms.de/static/js/common/api',
                         */
                        lib: 'lib',
                        "3rd": 'https://ex',
                        "phone": 'https://ex',
                        "vendor": 'https://ex',
                        "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
                        "moment": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/moment.min"
                    },
                    paths: {
                        "external": '//external',
                        "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
                        "_moment": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/moment.min",
                        "moment": "//external/moment",
                        "angular": "//external/angular"
                    },
                    /*
                     paths: {
                     phone: 'https://webrtcgw2.ect-telecoms.de/static/js/common/phone',
                     api: 'https://webrtcgw2.ect-telecoms.de/static/js/common/api',
                     lib:'lib'
                     },
                     */
                    name: "main",
                    out: "dist/built.js",
                    optimize: "none"
                }
            },
            compileExtension: {
                options: {
                    baseUrl: 'es5/js',
                    paths: {
                        "external": '//external',
                        phone: '//external/phone',
                        api: '//external/api',
                        "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
                        "_moment": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/moment.min",
                        "moment": "//external/moment",
                        "angular": "//external/angular",
                        "ectxml": "//external/ectxml"
                    },
                    name: "extension",
                    out: "dist/built.js",
                    optimize: "none"
                }
            },
            compileUserSettings: {
                options: {
                    baseUrl: 'es5/js',
                    paths: {
                        "external": '//external',
                        phone: '//external/phone',
                        api: '//external/api',
                        "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
                        "_moment": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/moment.min",
                        "moment": "//external/moment",
                        "angular": "//external/angular",
                        "ectxml": "//external/ectxml",
                        "noty": "//external/noty"
                    },
                    name: "userSettings",
                    out: "dist/built.js",
                    optimize: "none"
                }
            },
            compileAll: {
                options: {
                    baseUrl: 'es5',
                    paths: {
                        "external": '//external',
                        phone: '//external/phone',
                        api: '//external/api',
                        ect: '//external/ect',
                        "jquery": "//external/jquery",
                        "_jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
                        "urijs": "//external/urijs",
                        "_moment": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/moment.min",
                        "moment": "//external/moment",
                        "angular": "//external/angular",
                        "ectxml": "//external/ectxml",
                        "noty": "//external/noty",
                        "app":"//external/app"
                    },
                    name: "main",
                    out: "dist/built.js",
                    optimize: "none"
                }
            }
        },
        jslint: {
            client: {
                src: [
                    'src/js/**/*.js'
                ],
                directives: {
                    es6: true,
                    // node environment
                    node: false,
                    // browser environment
                    browser: true,
                    // allow dangling underscores
                    nomen: true,
                    // allow todo statements
                    todo: true,
                    // allow unused parameters
                    unparam: true,
                    // add predefined libraries
                    predef: [
                        '$',
                        '_',
                        'Handlebars',
                        'Backbone',
                    ]
                }
            }
        },
        eslint: {
            options: {
                configFile: 'eslint.json'
            },
            all: ['src/js/*.js']
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/js/main.js',
                dest: 'dist/js/main.js'
            }
        },
        clean: {
            dist: {
                src: ['dist/*', '!dist/lib/**']
            },
            es5: {
                src: ["es5"]
            }
        },
        copy: {
            main: {
                src: 'lib/3rd/*',
                dest: 'dist/'
            },
            test: {
                expand: true,
                cwd: 'src/',
                src: '**',
                dest: 'dest/',
                flatten: false,
                filter: 'isFile'
            },
            html: {
                expand: true,
                cwd: 'src/',
                src: '**/*.html',
                dest: 'dist/',
                flatten: false,
                filter: 'isFile'
            },
            lib: {
                expand: true,
                cwd: 'src/3rd/',
                src: '**',
                dest: 'dist/3rd/',
                flatten: false,
                filter: 'isFile'
            },
            extension: {
                expand: true,
                cwd: 'dist/',
                src: '**',
                dest: 'extension-2/',
                flatten: false,
                filter: 'isFile'
            },
            extension_bower_components: {
                expand: true,
                cwd: 'bower_components/',
                src: '**',
                dest: 'extension-2/bower_components/',
                flatten: false,
                filter: 'isFile'
            },
            ng_templates: {
                expand: true,
                cwd: 'src/js/ng/',
                src: '**.html',
                dest: 'extension-2/ng/',
                flatten: false,
                filter: 'isFile'
            },
            distribute: {
                cwd: 'dist/',
                src: '**/*.*',
                dest: '../webapp/newCallPage/',
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
            lib: {
                expand: true,
                cwd: 'bower_components/',
                src: '**/*.*',
                dest: 'dist/lib/',
                flatten: false,
                filter: 'isFile'
            }


        },
        sync: {
            lib: {
                files: [{
                    cwd: 'bower_components',
                    src: '**/*.*',
                    dest: 'dist/lib/'
                }],
                pretend: true, // Don't do any IO. Before you run the task with `updateAndDelete` PLEASE MAKE SURE it doesn't remove too much.
                verbose: false // Display log messages when copying files
            }
        },
        watch: {
            scripts: {
                //files: 'src/js/**/*.*',
                files: ['src/**/*.*'],
                tasks: ['eslint', 'clean:es5', 'clean:dist', 'babel:dist', 'requirejs:compile', 'copy:html'],
                options: {
                    interrupt: true,
                    livereload: true
                }
            },
            fast: {
                //files: 'src/js/**/*.*',
                files: ['src/**/*.*'],
                tasks: ['eslint', 'clean:es5', 'clean:dist', 'babel:dist', 'requirejs:compileAll', 'copy:extension', 'copy:ng_templates'],
                options: {
                    interrupt: true,
                    livereload: true
                }
            },
            compile: {
                files: ['src/**/*.*'],
                tasks: ['clean:es5', 'clean:dist', 'babel:dist', 'requirejs:compileAll', 'insert_timestamp', 'copy:pages', 'sync:lib'],
                options: {
                    interrupt: true,
                    livereload: true
                }
            },
            fast_compile: {
                files: ['src/**/*.*'],
                tasks: ['clean:es5', 'clean:dist', 'babel:dist', 'requirejs:compileAll', 'copy:pages'],
                options: {
                    interrupt: true,
                    livereload: true
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
        },
        file_append: {
            default_options: {
                files: [
                    {
                        prepend: "//text to prepend\n",
                        input: 'dist/built.js',
                        output: 'dist/built.js'
                    }
                ]
            }
        },
        insert_timestamp: {

            // Default options
            options: {
                prepend: true,
                append: false,
                format: 'yyyy-mm-dd HH:MM:ss o',
                template: '/* {timestamp} */',
                datetime: new Date(),
                insertNewlines: true
            },

            // Sample usage with css files
            js: {
                options: {
                    prepend: true
                },
                files: [{
                    // Use dynamic extend name
                    expand: true,
                    // Source dir
                    cwd: 'dist',
                    // Match files
                    src: ['**/*.js'],
                    // Output files
                    dest: 'dist',
                    ext: '.js'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-insert-timestamp');

    // Load the plugin that provides the "uglify" task.
    /*
     grunt.loadNpmTasks('grunt-contrib-uglify');
     grunt.loadNpmTasks('grunt-babel');
     grunt.loadNpmTasks('grunt-contrib-watch');
     grunt.loadNpmTasks('grunt-contrib-clean');
     grunt.loadNpmTasks('grunt-contrib-copy');
     grunt.loadNpmTasks('grunt-contrib-requirejs');
     grunt.loadNpmTasks('grunt-jslint');
     grunt.loadNpmTasks('grunt-eslint');
     grunt.loadNpmTasks('grunt-file-append');

     grunt.loadNpmTasks('grunt-sync');
     */
    //grunt.loadNpmTasks('eslint-grunt');

    // Default task(s).
    //grunt.registerTask('default', ['eslint','clean:es5','clean:dist','babel', 'requirejs:compile', 'requirejs:compileExtension','copy:extension', 'copy:extension_bower_components']);
    grunt.registerTask('default', ['eslint', 'clean:es5', 'clean:dist', 'babel', 'requirejs:compile', 'requirejs:compileExtension', 'copy:extension', 'copy:ng_templates']);
    grunt.registerTask('fast', ['eslint', 'clean:es5', 'clean:dist', 'babel', 'requirejs:compileAll', 'copy:extension', 'copy:ng_templates']);
    grunt.registerTask('compile', ['clean:es5', 'clean:dist', 'babel', 'requirejs:compileAll']);
    grunt.registerTask('fastdist', ['clean:es5', 'clean:dist', 'babel', 'requirejs:compileAll', 'insert_timestamp', 'copy:pages', 'copy:distribute']);
    grunt.registerTask('makedist', ['clean:es5', 'clean:dist', 'babel:dist', 'requirejs:compileAll', 'insert_timestamp', 'copy:pages', 'copy:distribute', 'copy:lib']);
    grunt.registerTask('copyLib', ['copy:lib']);
    grunt.registerTask('syncLib', ['sync:lib']);

    grunt.registerTask('fastCompile', ['babel:fast']);


};
