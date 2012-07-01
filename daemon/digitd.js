var VERSION = '0.1'

var dd = {

  repoPath: './',
  interval: 300 * 1000,

  start: function() {
    console.log('digit daemon v%s', VERSION)
    console.log('repository location: %s', dd.repoPath)

    dd.timeout = setTimout(dd.check, dd.interval)
  },

  check: function() {

  }

}



module.exports = dd
