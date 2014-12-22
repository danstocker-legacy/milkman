/*global dessert, troop, sntls, evan, flock, m$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("SilentProxy", {
        setup: function () {
            m$.SilentProxy.currentRoute = undefined;
        }
    });

    test("Route getter", function () {
        var locationProxy = m$.SilentProxy.create(),
            currentRoute = {};

        m$.SilentProxy.currentRoute = currentRoute;

        strictEqual(locationProxy.getRoute(), currentRoute, "should return route instance stored on class");
    });

    test("Route setter", function () {
        var locationProxy = m$.SilentProxy.create();

        raises(function () {
            locationProxy.setRoute();
        }, "should raise exception on missing arguments");

        raises(function () {
            locationProxy.setRoute('foo');
        }, "should raise exception on invalid arguments");

        strictEqual(locationProxy.setRoute('foo'.toRoute()), locationProxy, "should be chainable");

        ok(m$.SilentProxy.currentRoute.isA(m$.Route), "should set current route as Route instance");
        equal(m$.SilentProxy.currentRoute.toString(), 'foo', "should set current route on class");
    });
}());
