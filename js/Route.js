/*global dessert, troop, sntls, evan, milkman */
troop.postpone(milkman, 'Route', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Creates a Route instance.
     * You may create route instances by conversion from string, array, and sntls.Path instances
     * by calling '.toRoute()' on them.
     * @example
     * 'user/joe'.toRoute().navigateTo();
     * // or to capture events
     * [].toRoute().subscribeTo(...);
     * @name milkman.Route.create
     * @function
     * @param {sntls.Path} routePath
     * @returns {milkman.Route}
     */

    /**
     * Describes an application route, which reflects the current state of the application.
     * The same route should generally yield the same application state when applied via the routing
     * mechanism.
     * This is the class you'll ultimately use for routing, both for navigation and for intercepting routing events.
     * @class
     * @extends troop.Base
     * @extends evan.Evented
     */
    milkman.Route = self
        .addTraitAndExtend(evan.Evented)
        .addConstants(/** @lends milkman.Route */{
            /**
             * Root path for all route event paths.
             * @constant
             * @type {string}
             */
            ROUTE_EVENT_PATH_ROOT: 'route'
        })
        .addMethods(/** @lends milkman.Route# */{
            /**
             * @param {sntls.Path} routePath
             * @ignore
             */
            init: function (routePath) {
                dessert.isPath(routePath, "Invalid route path");

                /**
                 * Path associated with route.
                 * @type {sntls.Path}
                 */
                this.routePath = routePath;

                var eventPath = routePath.clone()
                    .prependKey(this.ROUTE_EVENT_PATH_ROOT);

                // setting event path as self
                this.setEventSpace(milkman.routingEventSpace)
                    .setEventPath(eventPath);
            },

            /**
             * Tells if the specified route is equivalent to the current one.
             * @param {milkman.Route} route
             * @returns {boolean}
             */
            equals: function (route) {
                return route && this.routePath.equals(route.routePath);
            },

            /**
             * Navigates app to current route path.
             * @param {*} [payload]
             * @param {evan.Event} [originalEvent]
             * @returns {milkman.Route}
             */
            navigateTo: function (payload, originalEvent) {
                milkman.Router.create()
                    .navigateToRoute(this, payload, originalEvent);
                return this;
            },

            /**
             * Navigates app to current route path silently.
             * @param {*} [payload]
             * @param {evan.Event} [originalEvent]
             * @returns {milkman.Route}
             */
            navigateToSilent: function (payload, originalEvent) {
                milkman.Router.create()
                    .navigateToRouteSilent(this, payload, originalEvent);
                return this;
            },

            /**
             * @returns {string}
             * @ignore
             */
            toString: function () {
                return this.routePath.asArray.join('/');
            }
        });
});

troop.amendPostponed(sntls, 'Path', function () {
    "use strict";

    sntls.Path.addMethods(/** @lends sntls.Path */{
        /**
         * Converts normal path to route path.
         * @returns {milkman.Route}
         */
        toRoute: function () {
            return milkman.Route.create(this);
        }
    });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** @param {milkman.Route} expr */
        isRoute: function (expr) {
            return milkman.Route.isBaseOf(expr);
        },

        /** @param {milkman.Route} [expr] */
        isRouteOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   milkman.Route.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Creates a new Route instance based on the current string.
             * @returns {milkman.Route}
             */
            toRoute: function () {
                return milkman.Route.create(this.split('/').toPath());
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Creates a new Route instance based on the current array.
             * @returns {milkman.Route}
             */
            toRoute: function () {
                return milkman.Route.create(this.toPath());
            }
        },
        false, false, false
    );
}());
