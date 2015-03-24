/**
 * Created by PRadostev on 04.02.2015.
 */
module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        srcPath: 'src',
        distPath: 'dist',
        examplesPath: 'examples',
        libsPath: '<%= examplesPath %>/lib',
        specs: 'spec/**/*.js',
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n' +
                '(function(window, document, undefined) {\n\n"use strict";\n\n',
                footer: '\n\n})(window, document);'
            },
            main: {
                src: [
                    '<%= srcPath %>/XmlUtil.js',
                    '<%= srcPath %>/Request.js',
                    '<%= srcPath %>/Filter.js',
                    '<%= srcPath %>/Filter.GmlObjectID.js',
                    '<%= srcPath %>/Format.js',
                    '<%= srcPath %>/Format.GeoJSON.js',
                    '<%= srcPath %>/Format.GML.js',
                    '<%= srcPath %>/Util.js',
                    '<%= srcPath %>/GmlUtil.js',
                    '<%= srcPath %>/GML/Marker.js',
                    '<%= srcPath %>/GML/Polygon.js',
                    '<%= srcPath %>/GML/Polyline.js',
                    '<%= srcPath %>/WFS.js',
                    '<%= srcPath %>/WFS.Transaction.js',
                    '<%= srcPath %>/WFS.Transaction.Helpers.js',
                    '<%= srcPath %>/WFS.Transaction.Requests.js'
                ],
                dest: '<%= distPath %>/<%= pkg.name %>.src.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            main: {
                src: '<%= concat.main.dest %>',
                dest: '<%= distPath %>/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            options: {
                jshintrc: true
            },
            scripts: {
                files: {
                    src: '<%= concat.main.src %>'
                }
            },
            specs: {
                files: {
                    src: ['<%= specs %>']
                }
            }
        },
        copy: {
            libs: {
                files: [{
                    cwd: 'bower_components/',
                    expand: true,
                    flatten: true,
                    src: [
                        'spin.js/spin.js',

                        'Leaflet.toolbar/dist/leaflet.toolbar.css',
                        'Leaflet.toolbar/dist/leaflet.toolbar.js',

                        'Leaflet.label/dist/leaflet.label.css',
                        'Leaflet.label/dist/leaflet.label.js',

                        'leaflet.markercluster/dist/MarkerCluster.css',
                        'leaflet.markercluster/dist/MarkerCluster.Default.css',
                        'leaflet.markercluster/dist/leaflet.markercluster.js',

                        'leaflet-sidebar/src/L.Control.Sidebar.css',
                        'leaflet-sidebar/src/L.Control.Sidebar.js',

                        'leaflet.editable/src/Leaflet.Editable.js',

                        'proj4leaflet/lib/proj4-compressed.js',
                        'proj4leaflet/src/proj4leaflet.js'
                    ],
                    dest: '<%= libsPath %>'
                }]
            }
        },
        clean: {
            libs: {
                src: ['<%= libsPath %>/**/*']
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            single: {
                singleRun: true
            },
            continuous: {
                background: true,
                browsers: ['PhantomJS']
            }
        },
        watch: {
            scripts: {
                files: '<%= concat.main.src %>',
                tasks: ['jshint:scripts', 'concat', 'uglify', 'karma:continuous:run']
            },
            specs: {
                files: ['<%= specs %>'],
                tasks: ['jshint:specs', 'karma:continuous:run']
            },
            libs: {
                files: ['bower_components/**/*'],
                tasks: ['clean:libs', 'copy:libs']
            }
        },
        'gh-pages': {
            options: {
                add: true,
                push: true,
                message: 'Auto update gh-pages'
            },
            examples: {
                src: [
                    '<%= examplesPath %>/**/*',
                    '<%= concat.main.dest %>'
                ]
            }
        }
    });

    // Load tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-gh-pages');

    // Default grunt task.
    grunt.registerTask('default', [
        'jshint:scripts',
        'jshint:specs',
        'concat',
        'uglify',
        'clean:libs',
        'copy:libs',
        'karma:single'
    ]);

    // Watch tack with continuous tests running.
    grunt.registerTask('watchAll', ['karma:continuous:start', 'watch']);

    // Publish task for gh-pages.
    grunt.registerTask('publish', ['clean:libs', 'copy:libs', 'gh-pages:examples']);
};