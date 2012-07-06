


//var spawn = require('child_process').spawn
var exec = require('child_process').exec
var fs = require('fs')


// function exec(path, args, fn) {
//  var proc = spawn('git', args, { cwd:path })
//  var data = []
//  var errs = []
//  proc.stdout.on('data', function(d) {
//    data.push(d.toString())
//  })
//  proc.stderr.on('data', function(e) {
//    errs.push(e.toString())
//  })
//  proc.on('exit', function(code){
//    fn(errs, data, code)
//  })
// }



/**
 * Repository class
 *
 * @param {String} path
 * @return {Object}
 * @api public
 */

function Repository(path) {
  this.path = path
}

Repository.prototype = {

  /**
   * Get all commit hashes starting from optional startHash or first commit
   *
   * @param {String|Function} startHash or cb
   * @param {Function} cb
   * @api public
   */

  commits: function(startHash, cb) {
    if (typeof startHash == 'function') {
      cb = startHash
      startHash = false
    }
    exec('git log --no-merges --pretty=format:"%H"', { cwd:this.path }, function(err, stdout, stderr) {
      var hashes = stdout.toString()
      console.log(hashes)
      if (!hashes.length) {

        hashes = hashes.split('\n').reverse()

        for (var i = 0, l = hash.length; i < l; i++) {
          if (!startHash) return cb(null, hashes.slice(i))
          if (startHash == hashes[i]) startHash = false
        }
      }
      return cb('No commits found')
    })
  }

}


function Commit(repo) {
  this.repository = repo
}




module.exports = {
  openRepository: function(path, cb) {
    fs.exists(path, function(exists){
      //console.log('EXISTS: ' + exists)
      if (!exists) cb('Directory does not exist')
      exec('git status', { cwd:path }, function(err) {
        //console.log('IS REPO: ' + (!!err))
        if (err) cb('Git repo does not exist')
        cb(null, new Repository(path))
      })
    })
  },

  Repository: Repository,
  Commit: Commit
}
