/*global dessert, troop, sntls, evan, milkman */
troop.postpone(milkman, 'PushStateProxy', function () {
    "use strict";

    var base = milkman.LocationProxy,
        self = base.extend();

    /**
     * Creates a PushStateProxy instance.
     * You may create a HashProxy instance by instantiating LocationProxy under a browser environment,
     * and when the config variable milkman.usePushState is set to true (false by default).
     * @name milkman.PushStateProxy.create
     * @function
     * @returns {milkman.PushStateProxy}
     */

    /**
     * Implements low-level routing for pushstate-based applications.
     * @class
     * @extends milkman.LocationProxy
     */
    milkman.PushStateProxy = self
        .addPrivateMethods(/** @lends milkman.PushStateProxy# */{
            /**
             * @param {object} state
             * @param {string} title
             * @param {string} url
             * @private
             */
            _pushStateProxy: function (state, title, url) {
                return window.history.pushState(state, title, url);
            },

            /**
             * @param {string} eventName
             * @returns {Event}
             * @private
             */
            _createEventProxy: function (eventName) {
                return document.createEvent(eventName);
            },

            /**
             * @param {Event} event
             * @private
             */
            _dispatchEventProxy: function (event) {
                document.dispatchEvent(event);
            },

            /** @private */
            _triggerFauxPopState: function () {
                var customEvent = this._createEventProxy('CustomEvent');
                customEvent.initCustomEvent('faux-popstate', true, true, {});
                this._dispatchEventProxy(customEvent);
            }
        })
        .addMethods(/** @lends milkman.PushStateProxy# */{
            /**
             * Sets the current application route based on pushstate.
             * @param {milkman.Route} route
             * @returns {milkman.PushStateProxy}
             */
            setRoute: function (route) {
                dessert.isRoute(route, "Invalid route");

                var currentRoute = this.getRoute();
                if (!currentRoute.equals(route)) {
                    this._pushStateProxy(route.routePath, '', '/' + route.toString());
                    this._triggerFauxPopState();
                }

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
        .addSurrogate(milkman, 'PushStateProxy', function () {
            return window && !!milkman.usePushState;
        });
});

(function () {
    "use strict";

    if (window) {
        // reacting to hash changes
        window.addEventListener('popstate', function (event) {
            if (milkman.usePushState) {
                milkman.LocationProxy.create().onRouteChange(event);
            }
        });
    }

    if (document) {
        document.addEventListener('faux-popstate', function (event) {
            if (milkman.usePushState) {
                milkman.LocationProxy.create().onRouteChange(event);
            }
        });
    }
}());
