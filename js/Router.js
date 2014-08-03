/*global dessert, troop, sntls, evan, jQuery, window, milkman */
troop.postpone(milkman, 'Router', function () {
    "use strict";

    /**
     * @name milkman.Router.create
     * @function
     * @returns {milkman.Router}
     */

    /**
     * Deals with application routing according to URL hash changes.
     * Triggers routing events in the global event space.
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
             * Effectuates the specified hash in the URL.
             * @param {string} hash Valid hash expression ("#foo")
             * @private
             */
            _hashSetterProxy: function (hash) {
                window.location.hash = hash;
            },

            /**
             * Retrieves the current hash from the URL.
             * @returns {string}
             * @private
             */
            _hashGetterProxy: function () {
                return window.location.hash;
            },

            /**
             * Applies route change as specified by the routing event.
             * @param {milkman.RoutingEvent} routingEvent
             * @private
             */
            _applyRouteChange: function (routingEvent) {
                var newRoute = routingEvent.afterRoute,
                    oldRoute = routingEvent.beforeRoute;

                if (!newRoute.equals(oldRoute)) {
                    // when route has changed
                    // setting route
                    this.currentRoute = newRoute;

                    // triggering events for changed route
                    routingEvent.triggerSync(oldRoute.eventPath);
                }
            },

            /**
             * Adds routing event to the buffer for retrieval on hash change matching the specified hash.
             * @param {string} hash
             * @param {milkman.RoutingEvent} routingEvent
             * @private
             */
            _pushRoutingEvent: function (hash, routingEvent) {
                var nextRoutingEvents = this._nextRoutingEvents,
                    queue = nextRoutingEvents.getItem(hash);

                if (!queue) {
                    queue = [];
                    nextRoutingEvents.setItem(hash, queue);
                }

                queue.push(routingEvent);
            },

            /**
             * Retrieves next available routing event associated with the specified hash.
             * @param {string} hash
             * @returns {*}
             * @private
             */
            _shiftRoutingEvent: function (hash) {
                var queue = this._nextRoutingEvents.getItem(hash);

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
                return this._hashGetterProxy().toRoute();
            },

            /**
             * Sets the application route.
             * If route has nextOriginalEvent or nextPayload set, they will be transferred to the event.
             * @param {milkman.Route} route
             * @returns {milkman.Router}
             */
            navigateToRoute: function (route) {
                dessert.isRoute(route, "Invalid route path");

                milkman.routingEventSpace.spawnEvent(this.EVENT_ROUTE_LEAVE)
                    .setOriginalEvent(route.nextOriginalEvent)
                    .setPayload(route.nextPayload)
                    .setBeforeRoute(this.currentRoute)
                    .setAfterRoute(route)
                    .triggerSync(route.eventPath);

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

                var routingEvent = milkman.routingEventSpace.spawnEvent(this.EVENT_ROUTE_LEAVE)
                    .setOriginalEvent(route.nextOriginalEvent)
                    .setPayload(route.nextPayload)
                    .setBeforeRoute(this.currentRoute)
                    .setAfterRoute(route);

                this._applyRouteChange(routingEvent);

                return this;
            },

            /**
             * When route leave was detected.
             * @param {milkman.RoutingEvent} event
             */
            onRouteLeave: function (event) {
                if (event.defaultPrevented) {
                    return;
                }

                // resuming default behavior
                // triggering route change
                var hash = event.afterRoute.toHash(),
                    routeChangeEvent = milkman.routingEventSpace.spawnEvent(milkman.Router.EVENT_ROUTE_CHANGE)
                        .setBeforeRoute(event.beforeRoute)
                        .setAfterRoute(event.afterRoute)
                        .setOriginalEvent(event)
                        .setPayload(event.payload);

                // pushing routing event containing custom information about routing
                // after hash change this will be taken
                this._pushRoutingEvent(hash, routeChangeEvent);

                // modifying browser hash
                this._hashSetterProxy(hash);
            },

            /**
             * When the browser hash changes.
             */
            onHashChange: function () {
                var routingEvent = this._shiftRoutingEvent(this._hashGetterProxy());
                if (routingEvent) {
                    this._applyRouteChange(routingEvent);
                }
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

(function () {
    "use strict";

    // reacting to hash changes
    window.addEventListener('hashchange', function () {
        milkman.Router.create()
            .onHashChange();
    });

    // running hash change handler when document loads
    document.addEventListener('DOMContentLoaded', function () {
        milkman.Router.create()
            .onHashChange();
    }, false);
}());
