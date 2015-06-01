/*global dessert, troop, sntls, evan, milkman */
troop.postpone(milkman, 'HashProxy', function () {
    "use strict";

    var base = milkman.LocationProxy,
        self = base.extend();

    /**
     * Creates a HashProxy instance.
     * You may create a HashProxy instance by instantiating LocationProxy under a browser environment,
     * and when the config variable milkman.usePushState is set to false (default).
     * @name milkman.HashProxy.create
     * @function
     * @returns {milkman.HashProxy}
     */

    /**
     * Implements low-level routing for URL hash-based applications.
     * @class
     * @extends milkman.LocationProxy
     */
    milkman.HashProxy = self
        .addPrivateMethods(/** @lends milkman.HashProxy# */{
            /**
             * Effectuates the specified hash in the URL.
             * @param {string} hash Valid hash expression ("#foo")
             * @private
             */
            _hashSetterProxy: function (hash) {
                window.location.hash = hash;
            }
        })
        .addMethods(/** @lends milkman.HashProxy# */{
            /**
             * Sets the current application state via the URL hash.
             * @param {milkman.Route} route
             * @returns {milkman.HashProxy}
             */
            setRoute: function (route) {
                dessert.isRoute(route, "Invalid route");
                var hash = '#' + route.toString();
                this._hashSetterProxy(hash);
                return this;
            },

            /**
             * @param {Event} event
             * @ignore
             */
            onRouteChange: function (event) {
                milkman.Router.create().onRouteChange(event);
            }
        });
});

troop.amendPostponed(milkman, 'LocationProxy', function () {
    "use strict";

    milkman.LocationProxy
        .addSurrogate(milkman, 'HashProxy', function () {
            return window && !milkman.usePushState;
        });
});

(function () {
    "use strict";

    if (window) {
        // reacting to hash changes
        window.addEventListener('hashchange', function (event) {
            if (!milkman.usePushState) {
                milkman.LocationProxy.create().onRouteChange(event);
            }
        });
    }
}());
