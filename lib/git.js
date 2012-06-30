


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

  fs.exists(path, function(exists){
    if (!exists) throw 'Git repo does not exist'
    exec('git status', { cwd:path }, function(err) {
      if (err) throw 'Git repo does not exist'
    })
  })
}

Repository.prototype = {

  commits: function() {

  }

}




module.exports = {
  Repository: Repository
}
