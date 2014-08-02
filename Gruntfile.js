/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'js/namespace.js',
            'js/routingEventSpace.js',
            'js/Route.js',
            'js/RoutingEvent.js',
            'js/Router.js',
            'js/exports.js'
        ],

        test: [
            'js/keys/jsTestDriver.conf'
        ],

        globals: {
            dessert: true,
            troop  : true,
            sntls  : true,
            evan   : true
        }
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};
