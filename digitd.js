
var VERSION = '0.1'


var commander = require('commander')
var git = require('gitteh')
var path = require('path')
var spawn = require('child_process').spawn


commander
  .version(VERSION)
  .option('-r, --repo <path>', 'specify git repository path')
  .parse(process.argv)

var repoPath = path.resolve(__dirname, commander.repo)

console.log('digit daemon v%s', VERSION)
console.log('repository location: %s', repoPath)


git.openRepository(path.join(repoPath, '.git'), function(err, repo) {
  var head = repo.getReference('HEAD')
  head = head.resolve()
  var walker = repo.createWalker()
  walker.sort(git.GIT_SORT_TIME)
  walker.push(head.target)

  var commit, i = 0
  while (commit = walker.next()) {
    console.log('%s %s - %s',
      commit.id.substring(0,7),
      commit.author.name,
      commit.message.replace(/\n/, '').substring(0,30))
    if (i++ > 30) break
  }
})


// perform a git pull
var pull = spawn('git', ['pull'], { cwd:repoPath })

pull.stdout.on('data', function(data) {
  if (~data.toString().indexOf('Already up-to-date')) {
    console.log('Up to date')
  }
  console.log('stdout: %s', data)
})

pull.stderr.on('data', function(data) {
  console.log('stderr: %s', data)
})

pull.on('exit', function(code) {
  console.log('git pull process exited with code: %s', code)
})
