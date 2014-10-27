/*global dessert, troop, sntls, evan, flock, m$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("PushStateProxy", {
        setup   : function () {
            m$.usePushState = true;
        },
        teardown: function () {
            m$.usePushState = false;
        }
    });

    test("Conversion from LocationHash", function () {
        var locationProxy = m$.LocationProxy.create();
        ok(locationProxy.isA(m$.PushStateProxy), "should return PushStateProxy instance");
    });

    test("Route getter", function () {
        m$.PushStateProxy.addMocks({
            _pathNameGetterProxy: function () {
                ok(true, "should fetch URL path name");
                return '/foo';
            }
        });

        var route = m$.PushStateProxy.create().getRoute();

        ok(route.isA(m$.Route), "should return Route instance");
        equal(route.toString(), 'foo', "should set route content");

        m$.PushStateProxy.removeMocks();
    });

    test("Route setter", function () {
        expect(7);

        var pushStateProxy = m$.PushStateProxy.create();

        raises(function () {
            pushStateProxy.setRoute();
        }, "should raise exception on missing arguments");

        raises(function () {
            pushStateProxy.setRoute('foo');
        }, "should raise exception on invalid arguments");

        m$.PushStateProxy.addMocks({
            getRoute: function () {
                ok(true, "should fetch current route");
                return 'foo'.toRoute();
            },

            _pushStateProxy: function (state, title, url) {
                equal(url, '/bar', "should push history state with correct URL");
            },

            _triggerFauxPopState: function () {
                ok(true, "should trigger faux popstate");
            }
        });

        strictEqual(pushStateProxy.setRoute('bar'.toRoute()), pushStateProxy, "should be chainable");

        // will trigger only the current route getter
        pushStateProxy.setRoute('foo'.toRoute());

        m$.PushStateProxy.removeMocks();
    });
}());
