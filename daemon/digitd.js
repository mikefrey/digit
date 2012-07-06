var _ = require('underscore')
var git = require('../lib/git')
var db = require('../lib/db')
var conf = require('../lib/configurator')


var defaults = {
  repoPath: './',
  interval: 300*1000
}
var options = {}

var stepTimeout = 0
var repository


/*
 * start the daemon
 */

function start() {
  // get configuration settings
  options = conf.getConfiguration(defaults)

  // validate and open the repo
  git.openRepository(options.repoPath, function(err, repo) {
    if (err) throw err
    repository = repo

    // initialize the database
    db.initialize('digit.db', function(err) {
      if (err) throw err
      stepTimeout = setTimout(step, options.interval)
    })

  })
}


/*
 * initiates the check/analysis loop iteration
 */

function step() {

  if (!repository) return
  repository.commits(function(err, commits) {
    db.getLatestCommit()
  })
}




function getLatestCommitHashes() {}





var dd = {
  start: start,
  //check: check,
  configure: conf.configure
}



module.exports = dd
