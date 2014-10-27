/*global dessert, troop, sntls, evan, flock, m$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("HashProxy", {
        setup: function () {
            m$.usePushState = false;
        }
    });

    test("Conversion from LocationHash", function () {
        var locationProxy = m$.LocationProxy.create();

        ok(locationProxy.isA(m$.HashProxy), "should return HashProxy instance");
    });

    test("Route getter", function () {
        m$.HashProxy.addMocks({
            _hashGetterProxy: function () {
                ok(true, "should fetch URL hash");
                return '#foo';
            }
        });

        var route = m$.HashProxy.create().getRoute();

        ok(route.isA(m$.Route), "should return Route instance");
        equal(route.toString(), 'foo', "should set route content");

        m$.HashProxy.removeMocks();
    });

    test("Route setter", function () {
        expect(4);

        var hashProxy = m$.HashProxy.create();

        raises(function () {
            hashProxy.setRoute();
        }, "should raise exception on missing arguments");

        raises(function () {
            hashProxy.setRoute('foo');
        }, "should raise exception on invalid arguments");

        m$.HashProxy.addMocks({
            _hashSetterProxy: function (hash) {
                equal(hash, '#foo', "should set URL hash");
            }
        });

        strictEqual(hashProxy.setRoute('foo'.toRoute()), hashProxy, "should be chainable");

        m$.HashProxy.removeMocks();
    });
}());
