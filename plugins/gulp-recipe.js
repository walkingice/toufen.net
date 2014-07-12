// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var recipeBlock = /\<!--\s*recipe:.*--\>/;
var recipePattern = /\<!--\s*recipe:(.+?) .*--\>/;
var paramsPattern = /\<!--\s*recipe:.+? ingredients:\[(.+?)\].*--\>/;

var rootDir = process.cwd() + '/';

// Consts
const PLUGIN_NAME = 'gulp-recipe';

// Plugin level function(dealing with files)
function gulpRecipe(opts) {
    opts = !!opts ? opts : {}
    opts.cookDir = !!opts.cookDir ? opts.cookDir : './';

    // Creating a stream through which each file will pass
    var stream = through.obj(function(file, enc, callback) {
        var contents, recipe, params, cook, result;

        if (file.isNull()) {
            // Do nothing if no contents
        }

        if (file.isBuffer()) {
            contents = String(file.contents);
            if (contents.match(recipeBlock)) {
                recipe = recipePattern.exec(contents)[1];
                params = paramsPattern.exec(contents)[1].split(',');
                params.unshift(rootDir);

                cook = require(rootDir + opts.cookDir + '/' + recipe);
                result = cook.apply(cook, params);

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
