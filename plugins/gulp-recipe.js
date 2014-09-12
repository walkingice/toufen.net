// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var recipeBlock = /\<!--\s*recipe:.*--\>/g;
var recipePattern = /\<!--\s*recipe:(.+?) .*--\>/;
var paramsPattern = /\<!--\s*recipe:.+? ingredients:\[(.+?)\].*--\>/;

var rootDir = process.cwd() + '/';

// Consts
const PLUGIN_NAME = 'gulp-recipe';

// Plugin level function(dealing with files)
function gulpRecipe(opts) {
    opts = !!opts ? opts : {}
    opts.cookDir = !!opts.cookDir ? opts.cookDir : './';

    function _process(file, contents, block) {
        recipe = recipePattern.exec(block)[1];
        params = paramsPattern.exec(block)[1].split(',');
        params.unshift(rootDir);

        cook = require(rootDir + opts.cookDir + '/' + recipe);
        result = cook.apply(cook, params);

        return contents.replace(block, result);
    }

    // Creating a stream through which each file will pass
    var stream = through.obj(function(file, enc, callback) {
        var contents, idx, match, recipe, params, cook, result;

        if (file.isNull()) {
            // Do nothing if no contents
        }

        if (file.isBuffer()) {
            contents = String(file.contents);
            match = contents.match(recipeBlock);
            for (idx in match) {
                contents = _process(file, contents, match[idx]);
            }
            file.contents = new Buffer(contents);
        }

        this.push(file);
        return callback();

    });

    // returning the file stream
    return stream;
};

// Exporting the plugin main function
module.exports = gulpRecipe;
