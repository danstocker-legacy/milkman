/*global dessert, troop, sntls, e$, m$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    var router;

    module("Router", {
        setup: function () {
            m$.Router.clearInstanceRegistry();
            router = m$.Router.create();
        }
    });

    test("Applying route change", function () {
        expect(2);

        var routingEvent = m$.routingEventSpace.spawnEvent('foo')
            .setBeforeRoute('hello'.toRoute())
            .setAfterRoute('world'.toRoute());

        routingEvent.addMocks({
            triggerSync: function (targetPath) {
                strictEqual(targetPath, routingEvent.afterRoute.eventPath, "should fire event on before path");
            }
        });

        router._applyRouteChange(routingEvent);

        strictEqual(router.currentRoute, routingEvent.afterRoute,
            "should set currentRoute to the afterRoute property of the event");
    });

    test("Re-applying route change", function () {
        expect(1);

        m$.Router.clearInstanceRegistry();

        var routingEvent = m$.routingEventSpace.spawnEvent('foo')
            .setBeforeRoute('hello'.toRoute())
            .setAfterRoute('hello'.toRoute());

        routingEvent.addMocks({
            triggerSync: function () {
                ok(true, "should not fire event");
            }
        });

        router._applyRouteChange(routingEvent);

        equal(router.currentRoute.toString(), '', "should not alter the current route");
    });

    test("Pushing first routing event", function () {
        expect(4);

        var routingEvent = m$.routingEventSpace.spawnEvent('hello');

        router._nextRoutingEvents.addMocks({
            getItem: function (itemName) {
                equal(itemName, 'foo', "should fetch queue from collection");
            },

            setItem: function (itemName, itemValue) {
                equal(itemName, 'foo', "should set queue in collection");
                deepEqual(itemValue, [], "should pass empty queue to item setter");
                return sntls.Collection.setItem.apply(this, arguments);
            }
        });

        router._pushRoutingEvent('foo', routingEvent);

        router._nextRoutingEvents.removeMocks();

        deepEqual(router._nextRoutingEvents.getItem('foo'), [routingEvent],
            "should add event to specified queue");
    });

    test("Pushing subsequent routing events", function () {
        expect(2);

        var routingEvent1 = m$.routingEventSpace.spawnEvent('hello'),
            routingEvent2 = m$.routingEventSpace.spawnEvent('world');

        router._pushRoutingEvent('foo', routingEvent1);

        router._nextRoutingEvents.addMocks({
            getItem: function (itemName) {
                equal(itemName, 'foo', "should fetch queue from collection");
                return sntls.Collection.getItem.apply(this, arguments);
            }
        });

        router._pushRoutingEvent('foo', routingEvent2);

        router._nextRoutingEvents.removeMocks();

        deepEqual(router._nextRoutingEvents.getItem('foo'), [routingEvent1, routingEvent2],
            "should add event to specified queue");
    });

    test("Shifting routing event in queue", function () {
        expect(2);

        var queue = [1, 2, 3, 4];

        router._nextRoutingEvents.addMocks({
            getItem: function (itemName) {
                equal(itemName, 'foo', "should fetch queue from collection");
                return queue;
            }
        });

        router._shiftRoutingEvent('foo');

        router._nextRoutingEvents.removeMocks();

        deepEqual(queue, [2, 3, 4], "should shift specified queue contents by 1");
    });

    test("Instantiation", function () {
        m$.Router.clearInstanceRegistry();

        var router = m$.Router.create();

        ok(router.currentRoute.isA(m$.Route), "should set currentRoute property");
        ok(router.currentRoute.equals([].toRoute()), "should set currentRoute property to empty route");
        ok(router._nextRoutingEvents.isA(sntls.Collection), "should set _nextRoutingEvents property");
        deepEqual(router._nextRoutingEvents.items, {},
            "should set contents of _nextRoutingEvents property to empty object");

        strictEqual(m$.Router.create(), router, "should be singleton");
    });

    test("Current route getter", function () {
        m$.HashProxy.addMocks({
            getRoute: function () {
                ok(true, "should fetch route from proxy");
                return 'foo/bar'.toRoute();
            }
        });

        var route = router.getCurrentRoute();

        m$.HashProxy.removeMocks();

        ok(route.isA(m$.Route), "should return a Route instance");
        ok(route.routePath.equals('foo>bar'.toPath()), "should set route path to current route's path");
    });

    test("Navigation", function () {
        expect(7);

        var route = 'foo/bar'.toRoute()
                .setNextOriginalEvent(m$.routingEventSpace.spawnEvent('foo'))
                .setNextPayload({}),
            routingEvent;

        router.currentRoute = 'foo/baz'.toRoute();

        m$.RoutingEvent.addMocks({
            setOriginalEvent: function (originalEvent) {
                routingEvent = this;

                strictEqual(originalEvent, route.nextOriginalEvent,
                    "should set original event to next original event stored on route");
                return this;
            },

            setPayload: function (payload) {
                strictEqual(payload, route.nextPayload,
                    "should set payload to next payload stored on route");
                return this;
            },

            setBeforeRoute: function (beforeRoute) {
                strictEqual(beforeRoute, router.currentRoute,
                    "should set before route to current route on router");
                return this;
            },

            setAfterRoute: function (afterRoute) {
                strictEqual(afterRoute, route, "should set after route to specified route");
                return this;
            },

            triggerSync: function (targetPath) {
                equal(this.eventName, m$.Router.EVENT_ROUTE_LEAVE, "should trigger route-leave event");
                strictEqual(targetPath, route.eventPath, "should trigger event on specified route");
                return this;
            }
        });

        strictEqual(router.navigateToRoute(route), router, "should be chainable");

        m$.RoutingEvent.removeMocks();
    });

    test("Navigation to the same route", function () {
        expect(0);

        var route = 'foo/bar'.toRoute();

        router.currentRoute = 'foo/bar'.toRoute();

        m$.RoutingEvent.addMocks({
            triggerSync: function () {
                ok(true, "should NOT trigger event");
            }
        });

        router.navigateToRoute(route);

        m$.RoutingEvent.removeMocks();
    });

    test("Silent navigation", function () {
        expect(7);

        var route = 'foo/bar'.toRoute()
                .setNextOriginalEvent(m$.routingEventSpace.spawnEvent('foo'))
                .setNextPayload({}),
            routingEvent;

        router.currentRoute = 'foo/baz'.toRoute();

        m$.RoutingEvent.addMocks({
            setOriginalEvent: function (originalEvent) {
                routingEvent = this;

                equal(this.eventName, m$.Router.EVENT_ROUTE_LEAVE, "should spawn a route-leave event");
                strictEqual(originalEvent, route.nextOriginalEvent,
                    "should set original event to next original event stored on route");
                return this;
            },

            setPayload: function (payload) {
                strictEqual(payload, route.nextPayload,
                    "should set payload to next payload stored on route");
                return this;
            },

            setBeforeRoute: function (beforeRoute) {
                strictEqual(beforeRoute, router.currentRoute,
                    "should set before route to current route on router");
                return this;
            },

            setAfterRoute: function (afterRoute) {
                strictEqual(afterRoute, route, "should set after route to specified route");
                return this;
            }
        });

        router.addMocks({
            _applyRouteChange: function (leaveEvent) {
                strictEqual(leaveEvent, routingEvent, "should apply routing event");
            }
        });

        strictEqual(router.navigateToRouteSilent(route), router, "should be chainable");

        m$.RoutingEvent.removeMocks();
    });

    test("Silent navigation to the same route", function () {
        expect(0);

        var route = 'foo/bar'.toRoute();

        router.currentRoute = 'foo/bar'.toRoute();

        router.addMocks({
            _applyRouteChange: function () {
                ok(true, "should NOT apply route change");
            }
        });

        router.navigateToRouteSilent(route);
    });

    test("Route leave handler", function () {
        expect(8);

        var leaveEvent = m$.routingEventSpace.spawnEvent(m$.Router.EVENT_ROUTE_LEAVE)
                .setBeforeRoute('foo/bar'.toRoute())
                .setAfterRoute('hello/world'.toRoute())
                .setPayload({}),
            routingEvent;

        m$.RoutingEvent.addMocks({
            setOriginalEvent: function (originalEvent) {
                routingEvent = this;

                equal(this.eventName, m$.Router.EVENT_ROUTE_CHANGE, "should spawn a route-leave event");
                strictEqual(originalEvent, leaveEvent,
                    "should set original event to leave event");
                return this;
            },

            setPayload: function (payload) {
                strictEqual(payload, leaveEvent.payload,
                    "should set payload to leave event's payload");
                return this;
            },

            setBeforeRoute: function (beforeRoute) {
                strictEqual(beforeRoute, leaveEvent.beforeRoute,
                    "should set before route to leave event's before route");
                return this;
            },

            setAfterRoute: function (afterRoute) {
                strictEqual(afterRoute, leaveEvent.afterRoute,
                    "should set after route to leave event's after route");
                return this;
            }
        });

        m$.HashProxy.addMocks({
            setRoute: function (route) {
                equal(route.toString(), 'hello/world', "should set the current route");
            }
        });

        router.addMocks({
            _pushRoutingEvent: function (route, event) {
                equal(route.toString(), 'hello/world', "should pass right route to event pusher");
                strictEqual(event, routingEvent, "should push route change event to queue");
            }
        });

        router.onRouteLeave(leaveEvent);

        m$.RoutingEvent.removeMocks();
        m$.HashProxy.removeMocks();
    });

    test("Route change handler when URL has hash", function () {
        var event = m$.routingEventSpace.spawnEvent('foo');

        m$.HashProxy.addMocks({
            getRoute: function () {
                ok(true, "should get route from proxy");
                return 'foo/bar'.toRoute();
            }
        });

        router.addMocks({
            _shiftRoutingEvent: function (route) {
                equal(route.toString(), 'foo/bar', "should get next event matching route");
                return event;
            },

            _applyRouteChange: function (routingEvent) {
                strictEqual(routingEvent, event, "should apply routing event");
            }
        });

        router.onRouteChange();

        m$.HashProxy.removeMocks();
    });

    test("Hash change handler with no hash", function () {
        expect(5);

        var event = m$.routingEventSpace.spawnEvent('foo'),
            hashChangeEvent = {};

        m$.HashProxy.addMocks({
            getRoute: function () {
                return 'hello/world'.toRoute();
            }
        });

        router.addMocks({
            _shiftRoutingEvent: function () {
                ok(true, "should get next event matching hash");
                return undefined;
            },

            _applyRouteChange: function (routingEvent) {
                ok(routingEvent.isA(m$.RoutingEvent), "should apply a routing event");
                ok(routingEvent.beforeRoute.equals('foo/bar'.toRoute()), "should set before route to old hash");
                ok(routingEvent.afterRoute.equals('hello/world'.toRoute()), "should set after route to new hash");
                strictEqual(routingEvent.originalEvent, hashChangeEvent,
                    "should set original event to DOM hash event");
            }
        });

        m$.Router.create().currentRoute = 'foo/bar'.toRoute();

        router.onRouteChange(hashChangeEvent);

        m$.HashProxy.removeMocks();
    });

    test("Document load handler", function () {
        expect(5);

        var event = m$.routingEventSpace.spawnEvent('foo'),
            documentLoadEvent = {};

        m$.HashProxy.addMocks({
            getRoute: function () {
                ok(true, "should fetch the current route");
                return 'foo/bar'.toRoute();
            }
        });

        router.addMocks({
            _applyRouteChange: function (routingEvent) {
                ok(routingEvent.isA(m$.RoutingEvent), "should apply a routing event");
                equal(typeof routingEvent.beforeRoute, 'undefined', "should leave before route as undefined");
                ok(routingEvent.afterRoute.equals('foo/bar'.toRoute()), "should set after route to current hash");
                strictEqual(routingEvent.originalEvent, documentLoadEvent,
                    "should set original event to DOM hash event");
            }
        });

        router.onDocumentLoad(documentLoadEvent);

        m$.HashProxy.removeMocks();
    });

    test("Global route-leave handler", function () {
        expect(1);

        m$.Router.addMocks({
            onRouteLeave: function () {
                ok(true, "should call router's route-leave handler");
            }
        });

        m$.routingEventSpace.spawnEvent(m$.Router.EVENT_ROUTE_LEAVE)
            .triggerSync('foo/bar'.toRoute().eventPath);

        m$.Router.removeMocks();
    });
    //
    //    test("Global route-change handler", function () {
    //        expect(1);
    //
    //        function onRouteChange(event) {
    //            ok(event.originalPath.equals('route>hello>world'.toPath()), "should capture route changes");
    //        }
    //
    //        [].toRoute()
    //            .subscribeTo(m$.Router.EVENT_ROUTE_CHANGE, onRouteChange);
    //
    //        router.navigateToRoute('hello/world'.toRoute());
    //
    //        [].toRoute()
    //            .unsubscribeFrom(m$.Router.EVENT_ROUTE_CHANGE, onRouteChange);
    //    });
}());
