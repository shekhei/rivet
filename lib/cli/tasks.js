/**
 * Module dependencies.
 */
var path = require('path')
  , rivet = require('..')


/**
 * Display `tasks` in rivet `file`.
 *
 * @param {String} file
 * @api protected
 */
module.exports = function exec(file, options) {
  options = options || {};
  
  require(file)(rivet);
  Object.keys(rivet._tasks || {}).sort().forEach(function(name) {
    var task = rivet._tasks[name];
    if (task.desc || options.all) {
      // TODO: improve formatting of this output
      console.log('%s -> %s', task.name, task.desc || '');
    }
  })
}
