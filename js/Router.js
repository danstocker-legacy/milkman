/*global console, dessert, troop, sntls, evan, jQuery, window, milkman */
troop.postpone(milkman, 'Router', function () {
    "use strict";

    /**
     * Creates or returns the only Router instance that exists in the application.
     * @name milkman.Router.create
     * @function
     * @returns {milkman.Router}
     */

    /**
     * Deals with application routing according to changes in either URL hash, or location pushstate.
     * Triggers routing events in the global routing event space.
     * Singleton.
     * @class
     * @extends troop.Base
     */
    milkman.Router = troop.Base.extend()
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addConstants(/** @lends milkman.Router */{
            /**
             * Signals a route change.
             * @type {string}
             * @constant
             */
            EVENT_ROUTE_CHANGE: 'route-change',

            /**
             * Signals that a route was left.
             * @type {string}
             * @constant
             */
            EVENT_ROUTE_LEAVE: 'route-leave'
        })
        .addPrivateMethods(/** @lends milkman.Router */{
            /**
             * Applies route change as specified by the routing event.
             * @param {milkman.RoutingEvent} routingEvent
             * @private
             */
            _applyRouteChange: function (routingEvent) {
                var beforeRoute = routingEvent.beforeRoute,
                    afterRoute = routingEvent.afterRoute;

                if (!afterRoute.equals(beforeRoute)) {
                    // when route has changed
                    // setting route
                    this.currentRoute = afterRoute;

                    // triggering events for changed route
                    routingEvent.triggerSync(afterRoute.eventPath);
                }
            },

            /**
             * Adds routing event to the buffer for retrieval on route change matching the specified route.
             * @param {milkman.Route} route
             * @param {milkman.RoutingEvent} routingEvent
             * @private
             */
            _pushRoutingEvent: function (route, routingEvent) {
                var nextRoutingEvents = this._nextRoutingEvents,
                    serializedRoute = route.toString(),
                    queue = nextRoutingEvents.getItem(serializedRoute);

                if (!queue) {
                    queue = [];
                    nextRoutingEvents.setItem(serializedRoute, queue);
                }

                queue.push(routingEvent);
            },

            /**
             * Retrieves next available routing event associated with the specified hash.
             * @param {milkman.Route} route
             * @returns {*}
             * @private
             */
            _shiftRoutingEvent: function (route) {
                var queue = this._nextRoutingEvents.getItem(route.toString());

                if (queue && queue.length) {
                    return queue.shift();
                } else {
                    return undefined;
                }
            }
        })
        .addMethods(/** @lends milkman.Router# */{
            /** @ignore */
            init: function () {
                /**
                 * Current application route.
                 * @type {milkman.Route}
                 */
                this.currentRoute = [].toRoute();

                /** @type {milkman.LocationProxy} */
                this.locationProxy = milkman.LocationProxy.create();

                /**
                 * Stores routing events to be triggered after hash change.
                 * (With optional custom payload.)
                 * @type {sntls.Collection}
                 * @private
                 */
                this._nextRoutingEvents = sntls.Collection.create();
            },

            /**
             * Retrieves the current hash as route path.
             * @returns {milkman.Route}
             */
            getCurrentRoute: function () {
                return this.locationProxy.getRoute();
            },

            /**
             * Sets the application route.
             * If route has nextOriginalEvent or nextPayload set, they will be transferred to the event.
             * @param {milkman.Route} route
             * @returns {milkman.Router}
             */
            navigateToRoute: function (route) {
                dessert.isRoute(route, "Invalid route path");

                if (!route.equals(this.currentRoute)) {
                    milkman.routingEventSpace.spawnEvent(this.EVENT_ROUTE_LEAVE)
                        .setBeforeRoute(this.currentRoute)
                        .setAfterRoute(route)
                        .triggerSync(route.eventPath);
                }

                return this;
            },

            /**
             * Sets application route without altering the browser hash.
             * If route has nextOriginalEvent or nextPayload set, they will be transferred to the event.
             * @param {milkman.Route} route
             * @returns {milkman.Router}
             */
            navigateToRouteSilent: function (route) {
                dessert.isRoute(route, "Invalid route path");

                var routingEvent;

                if (!route.equals(this.currentRoute)) {
                    routingEvent = milkman.routingEventSpace.spawnEvent(this.EVENT_ROUTE_CHANGE)
                        .setBeforeRoute(this.currentRoute)
                        .setAfterRoute(route);

                    this._applyRouteChange(routingEvent);
                }

                return this;
            },

            /**
             * @param {milkman.RoutingEvent} event
             * @ignore
             */
            onRouteLeave: function (event) {
                if (event.defaultPrevented) {
                    return;
                }

                // resuming default behavior
                // triggering route change
                var route = event.afterRoute,
                    routeChangeEvent = milkman.routingEventSpace.spawnEvent(milkman.Router.EVENT_ROUTE_CHANGE)
                        .setOriginalEvent(event)
                        .setPayload(event.payload)
                        .setBeforeRoute(event.beforeRoute)
                        .setAfterRoute(event.afterRoute);

                // pushing routing event containing custom information about routing
                // after hash change this will be taken
                this._pushRoutingEvent(route, routeChangeEvent);

                // modifying browser hash
                this.locationProxy.setRoute(route);
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onRouteChange: function (event) {
                var newRoute = this.locationProxy.getRoute(),
                    routingEvent = this._shiftRoutingEvent(newRoute);

                if (!routingEvent) {
                    routingEvent = milkman.routingEventSpace.spawnEvent(milkman.Router.EVENT_ROUTE_CHANGE)
                        .setBeforeRoute(this.currentRoute)
                        .setAfterRoute(newRoute)
                        .setOriginalEvent(event);
                }

                this._applyRouteChange(routingEvent);
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onDocumentLoad: function (event) {
                var routingEvent = milkman.routingEventSpace.spawnEvent(milkman.Router.EVENT_ROUTE_CHANGE)
                    .setAfterRoute(this.locationProxy.getRoute())
                    .setOriginalEvent(event);

                this._applyRouteChange(routingEvent);
            }
        });
});

troop.amendPostponed(milkman, 'Route', function () {
    "use strict";

    [].toRoute()
        .subscribeTo(milkman.Router.EVENT_ROUTE_LEAVE, function (/**milkman.RoutingEvent*/event) {
            milkman.Router.create().onRouteLeave(event);
        });
});

troop.postpone(milkman, 'logRoutingEvents', function () {
    "use strict";

    milkman.logRoutingEvents = function () {
        [].toRoute()
            .subscribeTo(milkman.Router.EVENT_ROUTE_LEAVE, function (event) {
                console.info("route left", event.beforeRoute.toString(), event);
            })
            .subscribeTo(milkman.Router.EVENT_ROUTE_CHANGE, function (event) {
                console.info("route changed", event.afterRoute.toString(), event);
            });
    };
});

(function () {
    "use strict";

    if (document) {
        // running hash change handler when document loads
        document.addEventListener('DOMContentLoaded', function (event) {
            milkman.Router.create().onDocumentLoad(event);
        }, false);
    }
}());
