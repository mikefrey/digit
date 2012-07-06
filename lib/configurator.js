


var ENV = process.env.NODE_ENV || 'development'
var config = []

function configure(env, fn) {
  if (typeof env == 'function') fn = env
  if (typeof env == 'string' && env.length && env != ENV) return
  if (typeof fn != 'function') return
  config.push(fn)
}

function getConfiguration(defaults) {
  var options = extend({}, defaults);
  for (var i = 0; i < config.length; i++) {
    options = extend({}, options, config[i](options))
  }
  return options
}

function extend(obj) {
  Array.prototype.slice.call(arguments, 1).forEach(function(source) {
    for (var prop in source)
      obj[prop] = source[prop]
  })
  return obj
}


module.exports = {
  configure: configure,
  getConfiguration: getConfiguration
}