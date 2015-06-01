/*global dessert, troop, sntls, evan, flock, milkman */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("PushStateProxy", {
        setup   : function () {
            milkman.usePushState = true;
        },
        teardown: function () {
            milkman.usePushState = false;
        }
    });

    test("Conversion from LocationHash", function () {
        var locationProxy = milkman.LocationProxy.create();
        ok(locationProxy.isA(milkman.PushStateProxy), "should return PushStateProxy instance");
    });

    test("Changing push state path", function () {
        expect(6);

        var pushStateProxy = milkman.PushStateProxy.create();

        raises(function () {
            pushStateProxy.setRoute();
        }, "should raise exception on missing arguments");

        raises(function () {
            pushStateProxy.setRoute('foo');
        }, "should raise exception on invalid arguments");

        pushStateProxy.addMocks({
            getRoute: function () {
                ok(true, "should fetch current route");
                return ''.toRoute();
            },

            _pushStateProxy: function (state, title, url) {
                equal(url, '/bar', "should push history state with correct URL");
            },

            _triggerFauxPopState: function () {
                ok(true, "should trigger faux popstate");
            }
        });

        strictEqual(pushStateProxy.setRoute('bar'.toRoute()), pushStateProxy, "should be chainable");
    });
}());
