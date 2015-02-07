/*global dessert, troop, sntls, evan, milkman */
troop.postpone(milkman, 'RoutingEvent', function () {
    "use strict";

    var base = evan.Event,
        self = base.extend();

    /**
     * Creates a RoutingEvent instance. A RoutingEvent will be created when Event is instantiated,
     * passing milkman.eventSpace as the event space.
     * @name milkman.RoutingEvent.create
     * @function
     * @param {string} eventName Event name
     * @param {evan.EventSpace} eventSpace Event space associated with event
     * @returns {milkman.RoutingEvent}
     */

    /**
     * Represents an event traversing the routing event space.
     * Carries information about the route(s) involved in the event.
     * @class
     * @extends evan.Event
     */
    milkman.RoutingEvent = self
        .addMethods(/** @lends milkman.RoutingEvent# */{
            /**
             * @param {string} eventName Event name
             * @param {evan.EventSpace} eventSpace Event space associated with event
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /**
                 * Route path before navigation.
                 * @type {milkman.Route}
                 */
                this.beforeRoute = undefined;

                /**
                 * Route path after navigation.
                 * @type {milkman.Route}
                 */
                this.afterRoute = undefined;
            },

            /**
             * Sets 'before' route path.
             * @param {milkman.Route} beforeRoute
             * @returns {milkman.RoutingEvent}
             */
            setBeforeRoute: function (beforeRoute) {
                dessert.isRoute(beforeRoute, "Invalid before route");
                this.beforeRoute = beforeRoute;
                return this;
            },

            /**
             * Sets 'after' route path.
             * @param {milkman.Route} afterRoute
             * @returns {milkman.RoutingEvent}
             */
            setAfterRoute: function (afterRoute) {
                dessert.isRoute(afterRoute, "Invalid after route");
                this.afterRoute = afterRoute;
                return this;
            },

            /**
             * Clones event.
             * @param {sntls.Path} [currentPath]
             */
            clone: function (currentPath) {
                return base.clone.call(this, currentPath)
                    .setBeforeRoute(this.beforeRoute)
                    .setAfterRoute(this.afterRoute);
            }
        });
});

troop.amendPostponed(evan, 'Event', function () {
    "use strict";

    evan.Event
        .addSurrogate(milkman, 'RoutingEvent', function (eventName, eventSpace) {
            return eventSpace === milkman.routingEventSpace;
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /**
         * Determines whether the specified expression is a routing event.
         * @param {milkman.RoutingEvent} expr
         */
        isRoutingEvent: function (expr) {
            return milkman.RoutingEvent.isBaseOf(expr);
        },

        /**
         * Determines whether the specified expression is a routing event. (optional)
         * @param {milkman.RoutingEvent} expr
         */
        isRoutingEventOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   milkman.RoutingEvent.isBaseOf(expr);
        }
    });
}());
