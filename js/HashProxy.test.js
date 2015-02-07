/*global dessert, troop, sntls, evan, flock, milkman */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("HashProxy", {
        setup: function () {
            milkman.usePushState = false;
        }
    });

    test("Conversion from LocationHash", function () {
        var locationProxy = milkman.LocationProxy.create();

        ok(locationProxy.isA(milkman.HashProxy), "should return HashProxy instance");
    });

    test("Route getter", function () {
        milkman.HashProxy.addMocks({
            _hashGetterProxy: function () {
                ok(true, "should fetch URL hash");
                return '#foo';
            }
        });

        var route = milkman.HashProxy.create().getRoute();

        ok(route.isA(milkman.Route), "should return Route instance");
        equal(route.toString(), 'foo', "should set route content");

        milkman.HashProxy.removeMocks();
    });

    test("Route setter", function () {
        expect(4);

        var hashProxy = milkman.HashProxy.create();

        raises(function () {
            hashProxy.setRoute();
        }, "should raise exception on missing arguments");

        raises(function () {
            hashProxy.setRoute('foo');
        }, "should raise exception on invalid arguments");

        milkman.HashProxy.addMocks({
            _hashSetterProxy: function (hash) {
                equal(hash, '#foo', "should set URL hash");
            }
        });

        strictEqual(hashProxy.setRoute('foo'.toRoute()), hashProxy, "should be chainable");

        milkman.HashProxy.removeMocks();
    });
}());
