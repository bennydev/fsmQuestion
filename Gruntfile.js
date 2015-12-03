"use strict";
module.exports = function (grunt){

    // Reads package.json and loads grunt tasks automatically
    var loadGruntTasks = require('load-grunt-tasks');
    loadGruntTasks(grunt);

    // Time how long tasks take. Can help when optimizing build times
    var timeGrunt = require('time-grunt');
    timeGrunt(grunt);

    // Load in our build configuration file.
    var userConfig = require('./build.config.js');

//    First version, the simple approach
//    TODO: 1. Copy files from src to dist folder.
//    TODO: 2. Bump up version property in bower.json.
//    TODO: 3. Publish to git repo
};