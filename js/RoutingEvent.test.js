/*global dessert, troop, sntls, evan, m$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Routing Event");

    test("Instantiation", function () {
        var eventSpace = evan.EventSpace.create(),
            event = m$.RoutingEvent.create('foo', eventSpace);

        ok(event.hasOwnProperty('beforeRoute'), "should add beforeRoute property");
        equal(typeof event.beforeRoute, 'undefined', "should set beforeRoute to undefined");
        ok(event.hasOwnProperty('afterRoute'), "should add afterRoute property");
        equal(typeof event.afterRoute, 'undefined', "should set afterRoute to undefined");
    });

    test("Conversion from Event", function () {
        var event = evan.Event.create('foo', m$.routingEventSpace);
        ok(event.isA(m$.RoutingEvent), "should return RoutingEvent instance");
    });

    test("Before route setter", function () {
        var event = m$.RoutingEvent.create('foo', evan.EventSpace.create());

        raises(function () {
            event.setBeforeRoute('foo');
        }, "should raise exception on invalid argument");

        strictEqual(event.setBeforeRoute('foo/bar'.toRoute()), event, "should be chainable");

        equal(event.beforeRoute.toString(), 'foo/bar', "should set beforeRoute property");
    });

    test("After route setter", function () {
        var event = m$.RoutingEvent.create('foo', evan.EventSpace.create());

        raises(function () {
            event.setAfterRoute('foo');
        }, "should raise exception on invalid argument");

        strictEqual(event.setAfterRoute('foo/bar'.toRoute()), event, "should be chainable");

        equal(event.afterRoute.toString(), 'foo/bar', "should set afterRoute property");
    });

    test("Cloning", function () {
        var eventSpace = evan.EventSpace.create(),
            beforeRoute = 'foo'.toRoute(),
            afterRoute = 'bar'.toRoute(),
            event = m$.RoutingEvent.create('foo', eventSpace)
                .setBeforeRoute(beforeRoute)
                .setAfterRoute(afterRoute),
            clonedEvent = event.clone('hello>world'.toPath());

        strictEqual(clonedEvent.beforeRoute, event.beforeRoute,
            "should set before route");
        strictEqual(clonedEvent.afterRoute, event.afterRoute,
            "should set after route");
    });
}());
