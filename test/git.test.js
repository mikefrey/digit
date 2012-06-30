
var path = require('path')
var Git = require('../lib/git.js')

function createBadRepo() {
  new Git.Repository('/badPath')
}

exports.git = {

  'Repository': {

    setUp: function(fn) {
      this.repoPath = path.resolve(__dirname, '../')
      this.repo = new Git.Repository(this.repoPath)
      fn()
    },

    tearDown: function(fn) {
      fn()
    },

    init: function(test) {
      test.expect(3)
      test.ok(!!Git.Repository, 'class should exist')
      test.ok(this.repo instanceof Git.Repository, 'instance should be instance of \'Git.Repository\'')
      test.strictEqual(this.repo.path, this.repoPath, 'repository path should be set correctly')
      //test.throws(createBadRepo, 'Git repo does not exist', 'should throw if repo does not exist')
      test.done()
    },

    commits: function(test) {
      test.expect(1)
      test.strictEqual(typeof this.repo.commits, 'function', 'has commits function')
      test.done()
    }

  }

}
