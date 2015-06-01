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

    test("Changing route", function () {
        expect(6);

        var hashProxy = milkman.HashProxy.create();

        raises(function () {
            hashProxy.setRoute();
        }, "should raise exception on missing arguments");

        raises(function () {
            hashProxy.setRoute('foo');
        }, "should raise exception on invalid arguments");

        hashProxy.addMocks({
            getRoute: function () {
                ok(true, "should fetch current route");
                return ''.toRoute();
            },

            isHashBased: function () {
                ok(true, "should check if route is purely hash based");
                return true;
            },

            _hashSetterProxy: function (hash) {
                equal(hash, '#foo', "should set URL hash");
            }
        });

        strictEqual(hashProxy.setRoute('foo'.toRoute()), hashProxy, "should be chainable");
    });

    test("Hard redirection", function () {
        expect(6);

        var hashProxy = milkman.HashProxy.create();

        raises(function () {
            hashProxy.setRoute();
        }, "should raise exception on missing arguments");

        raises(function () {
            hashProxy.setRoute('foo');
        }, "should raise exception on invalid arguments");

        hashProxy.addMocks({
            getRoute: function () {
                ok(true, "should fetch current route");
                return ''.toRoute();
            },

            isHashBased: function () {
                ok(true, "should check if route is purely hash based");
                return false;
            },

            _documentLocationSetterProxy: function (hash) {
                equal(hash, '/#foo', "should redirect to new page with hash in it");
            }
        });

        strictEqual(hashProxy.setRoute('foo'.toRoute()), hashProxy, "should be chainable");
    });
}());
