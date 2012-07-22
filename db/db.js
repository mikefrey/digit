var sqlite3 = require('sqlite3')
var migrations = require('./migrations')
var database = null



// initialization
function initialize(file, cb) {
  if (database != null) { return }

  database = new sqlite3.Database(file, function (err) {
    if (err) { return cb(err) }
    migrations.run(database, cb)
  })
}




// DATA ACCESS


/**
 * Inserts the commit into the database
 *
 * @param {Object} commit
 * @param {Function} cb
 * @api public
 */

function saveCommit(commit, cb) {
  var sql  = "INSERT OR REPLACE INTO commit (hash, timestamp, message, score) VALUES('?', ?, '?', ?)"
  var args = [commit.hash, commit.timestamp, commit.message, commit.score]
  database.query(sql, args, function(err) {
    return cb(err, this.lastID)
  })
}

/**
 * Retrieves a range of commits
 *
 * @param {Array} ids
 * @param {Function} cb
 * @api public
 */

function loadCommits(ids, cb) {
  var sql = "SELECT * FROM commit WHERE hash IN('" + ids.join("', '") + "')"
  database.query(sql, [], cb)
}

/**
 * Retrieve the most recent commit
 *
 * @param {Function} cb
 * @api public
 */

function getLatestCommit(cb) {
  var sql = 'SELECT * FROM commit ORDER BY timestamp DESC LIMIT 1'
  database.query(sql, [], function(err, rows) {
    return cb(err, rows[0])
  })
}

/**
 * Insert or update the given file data
 *
 * @param {Number} id
 * @param {String} file
 * @param {Object} commit
 * @param {Function} cb
 * @api public
 */

function saveFile(id, file, commit, cb) {
  var sql, args
  if (id) {
	sql = "INSERT INTO file (path, score) VALUES('?', ?)"
    args = [file, commit.score]
  } else {
    sql = "UPDATE file SET path = '?', score = score + ? WHERE id = ?"
    args = [file, commit.score, id]
  }
  database.query(sql, args, function(err) {
    if (err) return cb(err)
    id = id || this.lastID
    return cb(null, id)
  })
}

/**
 *
 *
 *
 */

function associateFileAndCommit(fileId, commitHash, score, cb) {
  var sql = "INSERT OR REPLACE file_commit (file_id, commit_hash, score) VALUES(?, '?', ?)"
  var args = [fileId, commitHash, score]
  database.query(sql, args, cb)
}

/**
 * Retrieve a list of commits for the given file
 *
 * @param {Number|String} idOrPath
 * @param {Function} cb
 * @api public
 */

function getCommitsForFile(idOrPath, cb) {
  var sql = 'SELECT commit_hash as hash, score FROM file_commit '
  var args = [idOrPath]
  if (typeof idOrPath == 'number')
    sql += 'WHERE file_id = ?'
  else
    sql += "INNER JOIN file ON file_commit.file_id = file.id WHERE file.path = '?'"

  database.query(sql, args, cb)
}




/**
 *
 */

function loadFilesByScore(cb) {
  var sql = "SELECT id, path, score FROM file ORDER BY DESC"
  database.query(sql, [], function(err, rows) {
	return cb(err, rows)
  }
}

// exports
module.exports.initialize = initialize
module.exports.saveCommit  = saveCommit
module.exports.loadCommits = loadCommits
module.exports.getLatestCommit = getLatestCommit
module.exports.getCommitsForFile = getCommitsForFile
module.exports.saveFile = saveFile

