/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'js/namespace.js',
            'js/routingEventSpace.js',
            'js/Route.js',
            'js/RoutingEvent.js',
            'js/LocationProxy.js',
            'js/HashProxy.js',
            'js/PushStateProxy.js',
            'js/SilentProxy.js',
            'js/Router.js',
            'js/exports.js'
        ],

        test: [
            'js/jsTestDriver.conf'
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
