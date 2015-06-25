/*global dessert, troop, sntls, evan, milkman */
troop.postpone(milkman, 'SilentProxy', function () {
    "use strict";

    var base = milkman.LocationProxy,
        self = base.extend();

    /**
     * Creates a SilentProxy instance.
     * You may create a SilentProxy instance by instantiating LocationProxy,
     * in an environment that has no window global object (eg. node).
     * @name milkman.SilentProxy.create
     * @function
     * @returns {milkman.SilentProxy}
     */

    /**
     * Silent location proxy for cases when neither HashProxy nor PushStateProxy is applicable (eg. under node).
     * @class
     * @extends milkman.LocationProxy
     */
    milkman.SilentProxy = self
        .addPublic(/** @lends milkman.SilentProxy */{
            /**
             * Stores the current (fake) application route.
             * @type {milkman.Route}
             */
            currentRoute: undefined
        })
        .addMethods(/** @lends milkman.SilentProxy# */{
            /**
             * Retrieves the current (fake) application route.
             * @returns {milkman.Route}
             */
            getRoute: function () {
                return self.currentRoute;
            },

            /**
             * Sets the current (fake) application route.
             * @param {milkman.Route} route
             * @returns {milkman.SilentProxy}
             */
            setRoute: function (route) {
                dessert.isRoute(route, "Invalid route");

                self.currentRoute = route;

                // calling main location change handler with current last original event
                milkman.Router.create().onRouteChange(evan.originalEventStack.getLastEvent());

                return this;
            }
        });
});

troop.amendPostponed(milkman, 'LocationProxy', function () {
    "use strict";

    milkman.LocationProxy
        .addSurrogate(milkman, 'SilentProxy', function () {
            return !window;
        });
});
