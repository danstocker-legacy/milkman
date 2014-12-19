/**
 * Top-Level Library Namespace
 */
/*global require */
/** @namespace */
var milkman = {
        usePushState: false
    },
    m$ = milkman;

/**
 * @class
 * @see https://github.com/production-minds/dessert
 */
var dessert = dessert || require('dessert');

/**
 * @namespace
 * @see https://github.com/production-minds/troop
 */
var troop = troop || require('troop');

/**
 * @namespace
 * @see https://github.com/danstocker/sntls
 */
var sntls = sntls || require('sntls');

/**
 * @namespace
 * @see https://github.com/danstocker/evan
 */
var evan = evan || require('evan');

if (typeof window === 'undefined') {
    /**
     * Built-in global window object.
     * @type {Window}
     */
    window = undefined;
}

if (typeof document === 'undefined') {
    /**
     * Built-in global document object.
     * @type {Document}
     */
    document = undefined;
}

/**
 * Native number class.
 * @name Number
 * @class
 */

/**
 * Native string class.
 * @name String
 * @class
 */

/**
 * Native array class.
 * @name Array
 * @class
 */

/**
 * @name sntls.Hash
 * @class
 */
