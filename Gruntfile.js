module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-wiredep");
  grunt.initConfig({
    watch: {
      files: ['src/*.js'],
      tasks: ['uglify']
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('default', ['watch', 'jshint', 'wiredep', 'uglify', 'nodemon']);
}