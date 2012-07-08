


var ENV = process.env.NODE_ENV || 'development'
var config = []

/**
 * Adds a configuration function to be called later
 *
 * @param {String|Function} env or fn
 * @param {Function} fn
 * @api public
 */

function configure(env, fn) {
  if (typeof env == 'function') fn = env
  if (typeof env == 'string' && env.length && env != ENV) return
  if (typeof fn != 'function') return
  config.push(fn)
}

/**
 * Calls all configuration functions
 *
 * @param {Object} defaults
 * @return {Object}
 * @api public
 */

function getConfiguration(defaults) {
  var options = extend({}, defaults);
  for (var i = 0; i < config.length; i++) {
    options = extend({}, options, config[i](options))
  }
  return options
}

/**
 * Basic object extender
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

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