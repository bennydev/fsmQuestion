"use strict";
module.exports = function (grunt) {

    // Reads package.json and loads grunt tasks automatically
    var loadGruntTasks = require('load-grunt-tasks');
    loadGruntTasks(grunt);

    // Time how long tasks take. Can help when optimizing build times
    var timeGrunt = require('time-grunt');
    timeGrunt(grunt);

    // Load in our build configuration file.
    var userConfig = require('./build.config.js');

//    First version, the simple approach


    /**
     * This is the configuration object Grunt uses to give each plugin its
     * instructions.
     */
    var taskConfig = {
        /**
         * We read in our `package.json` file so we can access the package name and
         * version. It's already there, so we don't repeat ourselves here.
         */
        pkg: grunt.file.readJSON("package.json"),

        /**
         * The directories to delete when `grunt clean` is executed.
         */
        clean: {
            options: {
                force: true
            },
            files: {
                src: [
                    'build',
                    'dist'
                ]
            }
        },

        /**
         * The `copy` task just copies files from A to B. We use it here to copy
         * our project assets (images, fonts, etc.) and javascripts into
         * `build_dir`, and then to copy the assets to `compile_dir`.
         */
        copy: {
            build: {
                src: [
                    'vendor/angular/angular.js',
                    'vendor/angular-sanitize/angular-sanitize.js',
                    'vendor/angular-translate/angular-translate.js',
                    'vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
                    'vendor/angular-ui-router/release/angular-ui-router.js',
                    'vendor/fsmQuestion/dist/fsmQuestion.js',
                    'vendor/angular-local-storage/dist/angular-local-storage.js',
                    'vendor/angular-mocks/angular-mocks.js',
                    'src/**/*',
                    'karma/helpers/**/*.js',
                    'karma/mocks/**/*.js'
                ],
                dest: 'build',
                expand: true
            }

        },

        concat: {
            compile_js: {
                options: {},
                src: [
                    'build/src/**/*.js',
                    'build/fsm*.js',
                    '!build/src/**/*.spec.js'
                ],
                dest: 'dist/fsmQuestion.js'
            }
        },
        html2js: {
            /**
             * These are the templates from `src/app`.
             */
            app: {
                options: {
                    base: 'build/src',
                    module: 'fsmQuestionTemplates'
                },
                src: ['build/**/*.html'],
                dest: 'build/fsmQuestionTemplates.js'
            }
        },

        /**
         * The Karma configurations.
         */
        karma: {
            options: {
                configFile: 'build/karma-unit.js'
            },
            unit: {
                runnerPort: 9876,
                background: true
            },
            continuous: {
                singleRun: true
            }
        },
        /**
         * This task compiles the karma template so that changes to its file array
         * don't have to be managed manually.
         *
         * NOTE: The ordering of the modules is important!
         */
        karmaconfig: {
            unit: {
                dir: 'build',
                src: [
                    'vendor/angular/angular.js',
                    'vendor/angular-sanitize/angular-sanitize.js',
                    'vendor/angular-translate/angular-translate.js',
                    'vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
                    'vendor/angular-ui-router/release/angular-ui-router.js',
                    'vendor/angular-local-storage/dist/angular-local-storage.js',
                    'vendor/angular-mocks/angular-mocks.js',
                    'src/**/*.js',
                    '!src/**/*.spec.js',
                    'karma/helpers/**/*.js',
                    'karma/mocks/**/*.js'
                ]
            }


        },
        /**
         * `jshint` defines the rules of our linter as well as which files we
         * should check. This file, all javascript sources, and all our unit tests
         * are linted based on the policies listed in `options`. But we can also
         * specify exclusionary patterns by prefixing them with an exclamation
         * point (!); this is useful when code comes from a third party but is
         * nonetheless inside `src/`.
         */
        jshint: {
            src: [
                'src'
            ],
            test: [
                'src'
            ],
            gruntfile: [
                'Gruntfile.js'
            ],
            options: {
                curly: true,
                immed: true,
                newcap: true,
                noarg: true,
                sub: true,
                boss: false,
                eqnull: false,
                globalstrict: true,
                jquery: true,
                browser: true,
                devel: true,
                debug: true,
                laxcomma: true,
                globals: {
                    module: true,
                    require: true,
                    Modernizr: true,
                    angular: true,
                    _: true,
                    jQuery: true,
                    jasmine: true,
                    describe: true,
                    ddescribe: true,
                    xdescribe: true,
                    it: true,
                    xit: true,
                    expect: true,
                    beforeEach: true,
                    afterEach: true,
                    inject: true,
                    spyOn: true
                }
            }
        }

    };

    grunt.initConfig(taskConfig);

    /**
     * The default task is to build and compile. When build and compile is finished
     * the project opened in your browser served by the connect-server.
     */
    grunt.registerTask( 'default', [ 'clean', 'jshint', 'copy', 'html2js', 'concat', 'karmaconfig',  'karma:continuous', 'karma:unit' ] );

    /**
     * In order to avoid having to specify manually the files needed for karma to
     * run, we use grunt to manage the list for us. The `karma/*` files are
     * compiled as grunt templates for use by Karma. Yay!
     */
    grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function () {
        var jsFiles = filterForJS(this.filesSrc);

        grunt.file.copy('karma/karma-unit.tpl.js', 'build/karma-unit.js', {
            process: function (contents, path) {
                return grunt.template.process(contents, {
                    data: {
                        scripts: jsFiles
                    }
                });
            }
        });
    });

    /**
     * A utility function to get all app JavaScript sources.
     */
    function filterForJS(files) {
        return files.filter(function (file) {
            //console.log('File: ' + file);
            return file.match(/\.js$/);
        });
    }

//    TODO: 2. Bump up version property in bower.json.
//    TODO: 3. Publish to git repo
};