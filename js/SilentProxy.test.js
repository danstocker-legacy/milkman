/*global dessert, troop, sntls, evan, flock, milkman */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("SilentProxy", {
        setup: function () {
            milkman.SilentProxy.currentRoute = undefined;
        }
    });

    test("Route getter", function () {
        var locationProxy = milkman.SilentProxy.create(),
            currentRoute = {};

        milkman.SilentProxy.currentRoute = currentRoute;

        strictEqual(locationProxy.getRoute(), currentRoute, "should return route instance stored on class");
    });

    test("Route setter", function () {
        expect(6);

        var locationProxy = milkman.SilentProxy.create();

        raises(function () {
            locationProxy.setRoute();
        }, "should raise exception on missing arguments");

        raises(function () {
            locationProxy.setRoute('foo');
        }, "should raise exception on invalid arguments");

        milkman.Router.addMocks({
            onRouteChange: function (event) {
                strictEqual(event, evan.originalEventStack.getLastEvent(),
                    "should call main route change handler with last original event");
            }
        });

        strictEqual(locationProxy.setRoute('foo'.toRoute()), locationProxy, "should be chainable");

        milkman.Router.removeMocks();

        ok(milkman.SilentProxy.currentRoute.isA(milkman.Route), "should set current route as Route instance");
        equal(milkman.SilentProxy.currentRoute.toString(), 'foo', "should set current route on class");
    });
}());
