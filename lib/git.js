


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





function Repository(path) {
  this.path = path
}

Repository.prototype = {

  commits: function(cb) {
    exec('git log --no-merges --pretty=format:"%H"', { cwd:this.path }, function(err, stdout, stderr) {
      console.log(stdout.toString())
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
