
var async = require('async')
var exec = require('child_process').exec
var fs = require('fs')
var noop = function(){}


/**
 * Repository class
 *
 * @param {String} path
 * @api public
 */

function Repository(path) {
  this.path = path
}

Repository.prototype = {

  /**
   * Get all commits starting from optional startHash or first commit
   *
   * @param {String|Function} startHash or cb
   * @param {Function} cb
   * @api public
   */

  commits: function(startHash, cb) {
    cb = cb || noop
    if (typeof startHash == 'function') {
      cb = startHash
      startHash = ''
    }
    else if (startHash && typeof startHash == 'string') {
      startHash += '..'
    }
    var cmd = 'git log --pretty="format:hash:%H%ndate:%ci%nmess:%n%s%nfile:" --name-only ' + startHash
    exec(cmd, { cwd:this.path }, function(err, stdout, stderr) {
      var out = stdout.toString().split(/\n/)

      if (out.length) {
        var line, commit, commits = []
        for (var i = 0, l = out.length; i < l; i++) {
          line = out[0]
          // grab the hash and create a new Commit instance
          if (!line.indexOf('hash:')) { commits.unshift(commit = new Commit(line.substring(5))) }
          // grab the date and create a Date obj
          else if (!line.indexOf('date:')) { commit.timestamp = new Date(line.substring(5)) }
          // grab the message
          else if (!line.indexOf('mess:')) { commit.message = line.substring(5) }
          // detect the files list
          else if (!line.indexOf('file:')) {
            // loop through subsequent lines and add them to the files array
            for (; i < l && out[i+1]; i++) {
              commit.files.push(out[i])
            }
          }
        }
        return cb(null, commits)
      }
      return cb('No commits found')
    })
  },

  /**
   * Perform a pull on the repo
   *
   * @param {Function} cb
   * @api public
   */

  pull: function(cb) {
    cb = cb || noop
    exec('git pull', { cwd:this.path }, function(err, stdout, stderr) {
      if (err) cb(err)
      if (~stdout.toString().indexOf('Already up-to-date.')) return cb(null, false)
      if (stderr) return cb(stderr)
      return cb(null, true)
    })
  }

}

/**
 * Commit class
 *
 * @param {String} hash
 * @api public
 */

function Commit(hash) {
  this.hash = hash
  this.files = []
}




module.exports = {
  openRepository: function(path, cb) {
    cb = cb || noop
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
