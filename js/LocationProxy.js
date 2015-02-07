/*global dessert, troop, sntls, evan, milkman */
troop.postpone(milkman, 'LocationProxy', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Creates a LocationProxy instance.
     * Depending on the environment (window global), and config settings (milkman.usePushState),
     * different subclasses of LocationProxy may be returned: SilentProxy under node,
     * HashProxy, or PushStateProxy under browsers.
     * @name milkman.LocationProxy.create
     * @function
     * @returns {milkman.LocationProxy}
     */

    /**
     * Base class for low level routing.
     * @class
     * @extends troop.Base
     */
    milkman.LocationProxy = self
        .addMethods(/** @lends milkman.LocationProxy# */{
            /** @ignore */
            init: function () {
            }
        });

    /**
     * Gets the current route.
     * @name milkman.LocationProxy#getRoute
     * @function
     * @returns {milkman.Route}
     */

    /**
     * Sets the current route.
     * @name milkman.LocationProxy#setRoute
     * @param {milkman.Route} route
     * @returns {milkman.LocationProxy}
     */

    /**
     * Triggered when the route changes.
     * @name milkman.LocationProxy#onRouteChange
     * @function
     * @param {Event} event
     */
});
