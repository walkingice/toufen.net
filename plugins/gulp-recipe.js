// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var recipeBlock = /\<!--\s*recipe:.*--\>/;
var recipePattern = /\<!--\s*recipe:(.+?) .*--\>/;
var paramsPattern = /\<!--\s*recipe:.+? ingredients:\[(.+?)\].*--\>/;

var cook = require('../scripts/render_cost.js');

// Consts
const PLUGIN_NAME = 'gulp-recipe';

// Plugin level function(dealing with files)
function gulpRecipe(opts) {

  opts = !!opts ? opts : {cookAbsDir: __dirname + '/'}

  // Creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, callback) {
    if (file.isNull()) {
       // Do nothing if no contents
    }

    if (file.isBuffer()) {
        var contents = String(file.contents);
        if (contents.match(recipeBlock)) {
            var recipe = recipePattern.exec(contents)[1];
            var params = paramsPattern.exec(contents)[1].split(',');
            var cooker = require(opts.cookAbsDir + '/' + recipe);
            var result = cooker.apply(cooker, params);
            file.contents = new Buffer(contents.replace(recipeBlock, result));
        }
    }

    this.push(file);
    return callback();

  });

  // returning the file stream
  return stream;
};

// Exporting the plugin main function
module.exports = gulpRecipe;
