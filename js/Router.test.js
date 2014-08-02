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
                strictEqual(targetPath, routingEvent.beforeRoute.eventPath, "should fire event on before path");
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
        router.addMocks({
            _hashGetterProxy: function () {
                return 'foo/bar';
            }
        });

        var route = router.getCurrentRoute();

        ok(route.isA(m$.Route), "should return a Route instance");
        ok(route.routePath.equals('foo>bar'.toPath()), "should set route path to current hash");
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

        router.addMocks({
            _pushRoutingEvent: function (hash, event) {
                equal(hash, '#hello/world', "should pass hash to event pusher");
                strictEqual(event, routingEvent, "should push route change event to queue");
            },

            _hashSetterProxy: function (hash) {
                equal(hash, '#hello/world', "should set the URL hash");
            }
        });

        router.onRouteLeave(leaveEvent);

        m$.RoutingEvent.removeMocks();
    });

    test("Hash change handler", function () {
        var event = m$.routingEventSpace.spawnEvent('foo');

        router.addMocks({
            _hashGetterProxy: function () {
                ok(true, "should fetch URL hash");
                return '#foo/bar';
            },

            _shiftRoutingEvent: function (hash) {
                equal(hash, '#foo/bar', "should get next event matching hash");
                return event;
            },

            _applyRouteChange: function (routingEvent) {
                strictEqual(routingEvent, event, "should apply routing event");
            }
        });

        router.onHashChange();
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
}());
