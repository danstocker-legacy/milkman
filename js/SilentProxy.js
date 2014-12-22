/*global dessert, troop, sntls, evan, milkman */
troop.postpone(milkman, 'SilentProxy', function () {
    "use strict";

    var base = milkman.LocationProxy,
        self = base.extend();

    /**
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
            /** @type {milkman.Route} */
            currentRoute: undefined
        })
        .addMethods(/** @lends milkman.SilentProxy# */{
            /** @returns {milkman.Route} */
            getRoute: function () {
                return self.currentRoute;
            },

            /**
             * @param {milkman.Route} route
             * @returns {milkman.SilentProxy}
             */
            setRoute: function (route) {
                dessert.isRoute(route, "Invalid route");
                self.currentRoute = route;
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
