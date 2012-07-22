var _ = require('underscore')
var async = require('async')
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

var lastCommitHash = ''


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

  if (!lastCommitHash)
    db.getLatestCommit(function(err, commits) {
      if (!err && commits && commits.length > 0)
        lastCommitHash = commits[0].hash
      getLatestCommits(lastCommitHash)
    })
  else
    getLatestCommits(lastCommitHash)
}



/**
 *
 *
 */

function getLatestCommits(last) {
  async.series({
    pull: repository.pull,
    commits: function(cb) { repository.commits(last, cb) }
  },
  function(err, results) {
    if (err) return console.log(err)
    async.series([
      async.apply(async.forEach, results.commits, processCommit),
      async.apply(async.forEach, results.commits, saveCommit)
    ])
    // async.forEach(results.commits, processCommmit, function(){})
    // async.forEach(results.commits, saveCommmit, function(){})
  })
}

/**
 *
 *
 */

function processCommit(commit, cb) {
  commit.score = 1
  var bugRx = /bug|fixed|helpspot|hs\#/i
  if (bugRx.test(commit.message)) {
    commit.score += 4
  }

  cb()
}

/**
 *
 *
 */

function saveCommit(commit, cb) {
  async.waterfall([
    db.saveCommit(commit, cb)

  ])
}





var dd = {
  start: start,
  //check: check,
  configure: conf.configure
}



module.exports = dd
