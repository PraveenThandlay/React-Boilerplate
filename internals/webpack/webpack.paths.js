/**
 * Created by mambig on 1/13/17.
 */

const path = require('path');

/**
 *
 *
 *Entry points for all the pages. For node-env keep only one path based on your need.
 *
 * pathName: path.join(cwd, 'path/to/app/index.js'),
 *
 * */
const cwd = process.cwd();

const pagesEntryPoints = {
  prepayLanding: path.join(cwd, 'app/app.js'),
};

module.exports = pagesEntryPoints;
