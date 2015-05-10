/*global dessert, troop, sntls, evan, flock, milkman */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Route");

    test("Instantiation", function () {
        raises(function () {
            milkman.Route.create();
        }, "should raise exception on no arguments");

        raises(function () {
            milkman.Route.create('foo>bar>baz');
        }, "should raise exception on invalid arguments");

        var routePath = 'foo>bar>baz'.toPath(),
            route = milkman.Route.create(routePath);

        strictEqual(route.eventSpace, milkman.routingEventSpace,
            "should set event space to routing event space");

        strictEqual(route.routePath, routePath,
            "should set route path to path specified in slash notation");

        ok(route.eventPath.equals('route>foo>bar>baz'.toPath()),
            "should set event path to route path prepended with 'route'");
    });

    test("Conversion from string", function () {
        var route = 'foo/bar'.toRoute();
        ok(route.isA(milkman.Route), "should return a Route instance");
        ok(route.routePath.equals('foo>bar'.toPath()), "should set route path property based on string");
    });

    test("Conversion from Array", function () {
        var route = ['foo', 'bar'].toRoute();
        ok(route.isA(milkman.Route), "should return a Route instance");
        ok(route.routePath.equals('foo>bar'.toPath()), "should set route path property based on array");
    });

    test("Conversion from Path", function () {
        var path = 'foo>bar'.toPath(),
            route = path.toRoute();

        ok(route.isA(milkman.Route), "should return a Route instance");
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
        expect(2);

        var router = milkman.Router.create(),
            route = 'foo/bar'.toRoute();

        router.addMocks({
            navigateToRoute: function (targetRoute) {
                strictEqual(targetRoute, route, "should navigate to current route");
            }
        });

        strictEqual(route.navigateTo(), route, "should be chainable");

        router.removeMocks();
    });

    test("Silent navigation", function () {
        expect(2);

        var route = 'foo/bar'.toRoute();

        milkman.Router.addMocks({
            navigateToRouteSilent: function (targetRoute) {
                strictEqual(targetRoute, route, "should navigate to current route");
            }
        });

        strictEqual(route.navigateToSilent(), route, "should be chainable");

        milkman.Router.removeMocks();
    });

    test("Asynchronous navigation", function () {
        expect(2);

        var route = 'foo/bar'.toRoute(),
            promise = {};

        milkman.Router.addMocks({
            navigateToRouteAsync: function (targetRoute) {
                strictEqual(targetRoute, route, "should navigate to current route");
                return promise;
            }
        });

        strictEqual(route.navigateToAsync(), promise, "should return promise returned by router");

        milkman.Router.removeMocks();
    });

    test("Debounced navigation", function () {
        expect(2);

        var route = 'foo/bar'.toRoute(),
            promise = {};

        milkman.Router.addMocks({
            navigateToRouteDebounced: function (targetRoute) {
                strictEqual(targetRoute, route, "should navigate to current route");
                return promise;
            }
        });

        strictEqual(route.navigateToDebounced(), promise,
            "should return promise returned by router");

        milkman.Router.removeMocks();
    });
}());
