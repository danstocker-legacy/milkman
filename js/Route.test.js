/*global dessert, troop, sntls, evan, flock, m$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Route");

    test("Instantiation", function () {
        raises(function () {
            m$.Route.create();
        }, "should raise exception on no arguments");

        raises(function () {
            m$.Route.create('foo>bar>baz');
        }, "should raise exception on invalid arguments");

        var routePath = 'foo>bar>baz'.toPath(),
            route = m$.Route.create(routePath);

        strictEqual(route.eventSpace, m$.routingEventSpace,
            "should set event space to routing event space");

        strictEqual(route.routePath, routePath,
            "should set route path to path specified in slash notation");

        ok(route.eventPath.equals('route>foo>bar>baz'.toPath()),
            "should set event path to route path prepended with 'route'");
    });

    test("Conversion from string", function () {
        var route = 'foo/bar'.toRoute();
        ok(route.isA(m$.Route), "should return a Route instance");
        ok(route.routePath.equals('foo>bar'.toPath()), "should set route path property based on string");
    });

    test("Conversion from Array", function () {
        var route = ['foo', 'bar'].toRoute();
        ok(route.isA(m$.Route), "should return a Route instance");
        ok(route.routePath.equals('foo>bar'.toPath()), "should set route path property based on array");
    });

    test("Conversion from Path", function () {
        var path = 'foo>bar'.toPath(),
            route = path.toRoute();

        ok(route.isA(m$.Route), "should return a Route instance");
        ok(route.routePath.equals('foo>bar'.toPath()), "should set route path property based on array");
    });

    test("Conversion to string", function () {
        var route = 'foo/bar'.toRoute();
        equal(route.toString(), 'foo/bar', "should return route in slash notation");
    });

    test("Equality tester", function () {
        ok(!'foo/bar'.toRoute().equals(undefined), "should return false for no argument");
        ok(!'foo/bar'.toRoute().equals('hello/world'.toRoute()), "should return false for different route");
        ok('foo/bar'.toRoute().equals('foo/bar'.toRoute()), "should return true for route w/ same content");
    });

    test("Navigation", function () {
        expect(3);

        var route = 'foo/bar'.toRoute(),
            payload = {};

        m$.Router.addMocks({
            navigateToRoute: function (targetRoute, targetPayload) {
                strictEqual(targetRoute, route, "should pass route to navigation");
                strictEqual(targetPayload, payload, "should pass payload to navigation");
            }
        });

        strictEqual(route.navigateTo(payload), route, "should be chainable");

        m$.Router.removeMocks();
    });

    test("Silent navigation", function () {
        expect(3);

        var route = 'foo/bar'.toRoute(),
            payload = {};

        m$.Router.addMocks({
            navigateToRouteSilent: function (targetRoute, targetPayload) {
                strictEqual(targetRoute, route);
                strictEqual(targetPayload, payload);
            }
        });

        strictEqual(route.navigateToSilent(payload), route, "should be chainable");

        m$.Router.removeMocks();
    });
}());
