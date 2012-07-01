
var path = require('path')
var Git = require('../lib/git.js')

exports.git = {

  setUp: function(fn) { fn() },
  tearDown: function(fn) { fn() },

  'Git': {

    setUp: function(fn) { fn() },

    tearDown: function(fn) { fn() },

    nonExistantPath: function(test) {
      //test.expect(2)
        test.done()
      // Git.openRepository('/badRepoPath/random/sdjk9393kdkdflksjf', function(err, repo) {
      //   // test.strictEqual(err, 'Directory does not exist', 'should respond with an error')
      //   // test.ok(!repo, 'repository should be falsy')
      //   console.log('test ran')
      //   test.done()
      // })
    }//,

    // nonRepoPath: function(test) {
    //   test.expect(2)
    //   Git.openRepository(__dirname, function(err, repo) {
    //     test.strictEqual(err, 'Git repo does not exist', 'should respond with an error')
    //     test.ok(!repo, 'repository should be falsey')
    //     test.done()
    //   })
    // }

  },

  'Repository': {

    setUp: function(fn) {
      this.repoPath = path.resolve(__dirname, '../')
      Git.openRepository(this.repoPath, function(err, repo) {
        console.log(err, repo)
        this.repo = repo
        fn()
      })
    },

    tearDown: function(fn) {
      fn()
    },

    init: function(test) {
      console.log(this, this.repo)
      test.expect(2)
      test.ok(this.repo instanceof Git.Repository, 'instance should be instance of \'Git.Repository\'')
      test.strictEqual(this.repo.path, this.repoPath, 'repository path should be set correctly')
      test.done()
    },

    commits: function(test) {
      test.expect(1)
      test.strictEqual(typeof this.repo.commits, 'function', 'has commits function')
      test.done()
    }

  }

}
