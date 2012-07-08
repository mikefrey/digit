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

var latestCommit = ''


/**
 * Start the daemon
 *
 * @api public
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


/**
 * Initiate the check/analysis loop iteration
 *
 * @api private
 */

function step() {
  if (!repository) return

  if (!latestCommit)
    db.getLatestCommit(function(err, commits) {
      if (!err && commits && commits.length > 0)
        latestCommit = commits[0].hash
      getLatestCommitHashes(latestCommit)
    })
  else
    getLatestCommitHashes(latestCommit)
}



/**
 *
 *
 */

function getLatestCommitHashes(latest) {
  repository.commits(latest, function(err, commits) {
    _.each(commits, processCommmit)
  })
}

/**
 *
 *
 */

function processCommit(commit) {

}

/**
 *
 *
 */

function saveCommit(commit) {

}





var dd = {
  start: start,
  //check: check,
  configure: conf.configure
}



module.exports = dd
