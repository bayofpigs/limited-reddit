module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-wiredep");
  grunt.initConfig({
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
        files: {
          'public/javascript/outputtest.js': ['src/input1.js', 'src/input2.js', 'src/input3.js']
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
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('default', ['jshint', 'wiredep', 'uglify', 'nodemon']);
}