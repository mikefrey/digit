/*
 * digit commit inspector
 * Copyright(c) 2012 Mike Frey <frey.mike@gmail.com>
 * MIT Licensed
 */

// module dependencies

var git = require('gitteh')
var EventEmitter = require('events').EventEmitter


// factory method for creating new Inspectors
//  * repoPath - file path to the repository
//  * [freq] - commit check frequency (in seconds [default 300])

function create(repoPath, freq) {
  return new Inspector(repoPath, freq * 1000 || 300 * 1000)
}


// watches the git repo for commits

function Inspector(repoPath, freq) {
  this.repoPath = path.join(repoPath, '.git')
  this.freq = freq

  git.openRepository(this.repoPath, function(err, repo) {
    if (!err)
      this.repo = repo;
    else
      this.emit('error', err)
  }.bind(this))
}




Inspector.prototype.__proto__ = EventEmitter.prototype

Inspector.prototype.check() {
  var repo = this.repo
  var head = repo.getReference('HEAD')
  head = head.resolve()
  var walker = repo.createWalker()
  walker.sort(git.GIT_SORT_TIME)
  walker.push(head.target)

  var commit, i = 0
  while (commit = walker.next()) {
    this.emit('commit', commit)
    // console.log('%s %s - %s',
    //   commit.id.substring(0,7),
    //   commit.author.name,
    //   commit.message.replace(/\n/, '').substring(0,30))
    if (i++ > 30) break
  }
}





exports.create = create;