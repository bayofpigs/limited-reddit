module.exports = function(grunt) {
  grunt.initConfig({
    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    wiredep: {
      target: {
        src: [
          "views/*.jade"
        ],
        ignorePath: '../public'
      }
    },
    jshint: {
      files: ["app.js", "src/*"]
    },
    uglify: {
      dist: {
        options: {
          mangle: {
            except: ['src/app.js']
          }
        },
        files: {
          'public/javascript/app.js': ['src/app.js']
        }
      }
    }, 
    nodemon: {
      dev: {
        script: 'app.js'
      }
    },
    watch: {
      files: ['src/*.js', 'public/bower_components/**'],
      tasks: ['uglify', 'wiredep']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('default', [ 'jshint', 'wiredep', 'uglify', 'concurrent:target']);
}