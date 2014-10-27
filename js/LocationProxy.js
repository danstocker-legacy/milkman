/*global dessert, troop, sntls, evan, milkman */
troop.postpone(milkman, 'LocationProxy', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name milkman.LocationProxy.create
     * @function
     * @returns {milkman.LocationProxy}
     */

    /**
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
     * @name milkman.LocationProxy#getRoute
     * @function
     * @returns {milkman.Route}
     */

    /**
     * @name milkman.LocationProxy#setRoute
     * @param {milkman.Route} route
     * @returns {milkman.LocationProxy}
     */

    /**
     * @name milkman.LocationProxy#onRouteChange
     * @function
     * @param {Event} event
     */
});
