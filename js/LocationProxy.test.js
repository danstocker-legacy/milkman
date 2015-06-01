/*global dessert, troop, sntls, evan, flock, milkman */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("LocationProxy");

    test("Path name based tester", function () {
        var locationProxy = milkman.LocationProxy.create();

        locationProxy.addMocks({
            _pathNameGetterProxy: function () {
                return '/';
            },

            _hashGetterProxy: function () {
                return '';
            }
        });

        ok(locationProxy.isPurelyPathNameBased(), "should return true when there is no hash component");

        locationProxy
            .removeMocks()
            .addMocks({
                _pathNameGetterProxy: function () {
                    return '/foo';
                },

                _hashGetterProxy: function () {
                    return '#bar';
                }
            });

        ok(!locationProxy.isPurelyPathNameBased(), "should return false when there is hash component");
    });

    test("Hash based tester", function () {
        var locationProxy = milkman.LocationProxy.create();

        locationProxy.addMocks({
            _pathNameGetterProxy: function () {
                return '/';
            },

            _hashGetterProxy: function () {
                return '';
            }
        });

        ok(locationProxy.isPurelyHashBased(), "should return true when there is no path name component");

        locationProxy
            .removeMocks()
            .addMocks({
                _pathNameGetterProxy: function () {
                    return '/foo';
                },

                _hashGetterProxy: function () {
                    return '#bar';
                }
            });

        ok(!locationProxy.isPurelyHashBased(), "should return false when there is path name component");
    });

    test("Route getter", function () {
        var locationProxy = milkman.LocationProxy.create(),
            route;

        locationProxy.addMocks({
            _pathNameGetterProxy: function () {
                return '/foo/bar';
            },

            _hashGetterProxy: function () {
                return '';
            }
        });

        route = locationProxy.getRoute();
        ok(route.isA(milkman.Route), "should return Route instance");
        equal(route.toString(), 'foo/bar', "should include path name when only path name is populated");

        locationProxy
            .removeMocks()
            .addMocks({
                _pathNameGetterProxy: function () {
                    return '/';
                },

                _hashGetterProxy: function () {
                    return '#baz/qux';
                }
            });

        route = locationProxy.getRoute();
        equal(route.toString(), 'baz/qux', "should include hash when only hash is populated");

        locationProxy
            .removeMocks()
            .addMocks({
                _pathNameGetterProxy: function () {
                    return '/foo/bar';
                },

                _hashGetterProxy: function () {
                    return '#baz/qux';
                }
            });

        route = locationProxy.getRoute();
        equal(route.toString(), 'foo/bar/baz/qux',
            "should include both path name and hash when both are populated");
    });
}());
