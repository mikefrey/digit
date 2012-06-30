module.exports = function(grunt) {

  grunt.initConfig({

    test: {
      all: ['test/**/*.js']
    },

    lint: {
      all: ['grunt.js', 'digitd.js', 'www.js', 'lib/**/*.js', 'tasks/*.js', 'tasks/*/*.js', 'test/**/*.js']
    },

    jshint: {
      options: {
        curly: false,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        asi: true
      },
      globals: {
        exports: true
      }
    }

  })

  grunt.registerTask('default', 'lint test')

}
