

exports.run = run

var database = null

var migrations = [
  {up:createCommitsTableUp, dn:createCommitsTableDn},
  {up:createFilesTableUp, dn:createFilesTableDn},
  {up:createFileCommitTableUp, dn:createFileCommitTableDn}
]



function run(db, cb) {
  if (database) return cb()

  database = db

  getRevision(function(err, version) {
    if (err) { return cb(err) }

    executeMigrations(migrations, version, migrations.length, function(err) {
      cb(err)
    })
  })
}




function getRevision(cb) {
  var sql = 'SELECT version FROM revisions where name=\'schema\''

  database.get(sql, [], function (err, row) {
    if (!err) { return cb(null, row.version) }

    createRevisionTable(function(err) {
      if (err) { return cb(err) }

      getRevision(cb)
    })
  })
}

function createRevisionTable(cb) {
  database.run('DROP TABLE IF EXISTS revisions', [], function (err) {
    if (err) { return cb(err) }

    database.run('CREATE TABLE revisions(name VARCHAR(32) NOT NULL, version INTEGER DEFAULT 0, PRIMARY KEY(name))', [], function (err) {
      if (err) { return cb(err) }

      database.run('INSERT INTO revisions(name, version) VALUES(\'schema\', 0)', [], function (err) {
        return cb(err)
      })
    })
  })
}

// migration manager
function executeMigrations(migrations, from, to, cb) {
  if (from == to) {
    return cb()
  }

  if (from < to) {
    runForewardMigrations(migrations, from, to, function(err) {
      cb(err)
    })
  }
  else {
    runRewindMigrations(migrations, from, to, function(err) {
      cb(err)
    })
  }
}

function runForewardMigrations(migrations, from, to, cb) {
  if (from >= to || !migrations[from]) { return cb() }

  migrations[from++].up(database, function(err) {
    if (err) { return cb(err) }

    database.run('UPDATE revisions SET version=? WHERE name=\'schema\'', [from], function (err) {
      if (err) { return cb(err) }

      runForewardMigrations(migrations, from, to, cb)
    })
  })
}

function runRewindMigrations(migrations, from, to, cb) {
  if (from <= to || !migrations[from]) { return cb() }

  migrations[--from].dn(database, function(err) {
    if (err) { return cb(err) }

    database.run('UPDATE revisions SET version=? WHERE name=\'schema\'', [from], function (err) {
      if (err) { return cb(err) }

      runRewindMigrations(migrations, from--, to, cb)
    })
  })
}






// migrations
function createCommitsTableUp(database, cb) {
  var sql = 'CREATE TABLE IF NOT EXISTS commit (' +
            //'    id INT NOT NULL AUTO_INCREMENT, ' +
            '    hash CHAR(40) NOT NULL, ' +
            '    timestamp INT NOT NULL,' +
            '    message VARCHAR(100) NOT NULL, ' +
            '    score INT NOT NULL DEFAULT 0, ' +
            '    PRIMARY KEY(hash)' +
            ')'

  database.query(sql, [], function (err) {
    cb(err)
  })
}
function createCommitsTableDn(database, cb) {
  var sql = 'DROP TABLE IF EXISTS commit'

  database.query(sql, [], function (err) {
    cb(err)
  })
}


function createFilesTableUp(database, cb) {
  var sql = 'CREATE TABLE IF NOT EXISTS file (' +
            '    id INT NOT NULL AUTO_INCREMENT, ' +
            '    path VARCHAR(2048) NOT NULL, ' +
            '    score INT NOT NULL,' +
            '    PRIMARY KEY(id)' +
            ')'

  database.query(sql, [], function (err) {
    cb(err)
  })
}
function createFilesTableDn(database, cb) {
  var sql = 'DROP TABLE IF EXISTS file'

  database.query(sql, [], function (err) {
    cb(err)
  })
}


function createFileCommitTableUp(database, cb) {
  var sql = 'CREATE TABLE IF NOT EXISTS file_commit (' +
            '    file_id INT NOT NULL REFERENCES file (id) ON DELETE CASCADE, ' +
            '    commit_hash VARCHAR(40) NOT NULL REFERENCES commit (hash) ON DELETE CASCADE, ' +
            '    score INT NOT NULL,' +
            '    PRIMARY KEY(file_id, commit_hash)' +
            ')'

  database.query(sql, [], function (err) {
    cb(err)
  })
}
function createFileCommitTableDn(database, cb) {
  var sql = 'DROP TABLE IF EXISTS file_commit'

  database.query(sql, [], function (err) {
    cb(err)
  })
}

