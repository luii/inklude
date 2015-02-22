/*
 * NOTICE OF LICENSE
 *
 * Licensed under the 3-clause BSD License.
 *
 * This source file is subject to the 3-clause BSD License that is
 * bundled with this package in the LICENSE file. It is also available at
 * the following URL: http://www.opensource.org/licenses/BSD-3-Clause
 *
 * @version    1.0.1
 * @module     Inklude
 * @author     luii
 * @copyright  luii
 * @license    BSD License (3-clause)
 */

// Dependencies
var fs = require("fs"),
    _  = require("lodash");

module.exports = inklude;

/**
 * Inklude Constructor
 * @param  {Object}   options This is the Options object, where you
 *                            define the rules, how it filters and exclude things
 * @param  {Function} cb      Callback Function
 * @return {Function}         Returns a Callback Function which holds, if all is ok
 *                            as first param null (for the err) and as last param
 *                            the collected (required) data.
 */
function inklude (options, callback) {

  // if dirname isnt a string or is undefined then it'll be throw an error
  if (!_.isString(options.dirname) || _.isUndefined(options.dirname)) {
    return callback(new Error("Please check if the entered [dirname] is defined and a valid String!"));
  }

  // If none of these following options are included
  // we'll set them for you.
  if (!options.filter) options.filter = /(.*)/
  if (!options.exclude) options.exclude = /^\.(git|svn)$/
  if (!options.optional) options.optional = false

  // TRY to read the directory.
  // If it fail a Error will be passed on the Callback
  // If optional flag is set it will only return a empty object
  fs.readdir(options.dirname, function (err, files) {
    if (err) {
      if (options.optional) return {};
      return callback(err);
    };

    var modules = {},
        length = files.length;

    // Loop trough each of the files
    _.each(files, function(file) {

      var filepath, filtered;

      // create the full filepath to the file/dir
      filepath = options.dirname + "/" + file;

      // Check if filepath is a directory
      fs.stat(filepath, function (err, stats) {
        if (err) return callback(err);
        if (excludeDirectory(file)) return;

        // if the this is true it'll
        // call inklude on the folder
        if (stats.isDirectory()) {

          // require the nested folders
          modules[file] = inklude({
            dirname: options.dirname,
            filter: options.filter,
            exclude: options.exclude,
            optional: options.optional,
          }, callback);
        } else {

          filtered = file.match(options.filter);
          if (!filtered) return;

          // require the files
          modules[filtered[1]] = require(filepath);

          if (!--length) {
            return process.nextTick(function () {
              callback(null, modules);
            });
          };
        };
      });
    });
  });

  /**
   * Returns bool if it is the directory to exclude
   * @param  {string} dirname
   * @return {bool}
   */
  function excludeDirectory(dirname) {
    return options.exclude && dirname.match(options.exclude);
  }
};

/**
 * Aggregate Function, to merge plain Objects together.
 * For Example a Config directory.
 * @param  {Object}   options An object to set the Options for "Inklude"
 * @param  {Function} cb      Callback Function
 * @return {Object}           Returns an aggregated Object of the modules.
 */
module.exports.aggregate = function (options, callback) {
  // Firstly set the required options
  options.aggregate = true;
  options.optional  = true;

  var aggregated = {};

  // Attempt to require the modules
  inklude(options, function (err, files) {
    // If an error occoured, pass it on.
    if (err) return callback(err);

    // Loop trough each file in the "files" object
    _.each(files, function (module) {
      if (options.aggregate) {

        // If this is false, it will loudly fail with an error.
        if (!_.isPlainObject(module)) {
            return callback(new Error("Module must be an object", module));
        };

        // in the end, the plain object modules (e.g. config) will be
        // merged together into another object.
        _.merge(aggregated, module);

      };
    });

    // if a accumulator is given it'll place the required stuff
    // in the accumulator
    if (options.accumulator) {

      // the accumulator must be an object, otherwise it'll fail
      if (!_.isObject(options.accumulator)) return callback(new Error("Accumulator must be an object"));

      // merge the aggregated in the accumulator
      _.merge(options.accumulator, aggregated);
    }

    // Finally it'll return the merged object
    callback(null, aggregated);
  });
};

/**
 * Optional Function for Inklude, if the loading of a
 * Module / Directory fails, then it will silently fail with
 * an empty object
 * @param  {Object}   otions Options Object for Inklude
 * @param  {Function} cb     Callback Function
 * @return {Object}          Returns an object with the required modules,
 *                           the modules will be loaded into the memory.
 */
module.exports.optional = function (options, callback) {
  options.optional = true;
  return inklude(options, callback);
};

/**
 * Alias for the default inklude function
 * @param  {Object}   options  Options for inklude
 * @param  {Function} callback Callback Function
 * @return {Object}            Returns an object with the required modules
 */
module.exports.required = function (options, callback) {
  return inklude(options, callback);
};
