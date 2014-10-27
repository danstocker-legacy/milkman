/*global dessert, troop, sntls, evan, milkman */
troop.postpone(milkman, 'PushStateProxy', function () {
    "use strict";

    var base = milkman.LocationProxy,
        self = base.extend();

    /**
     * @name milkman.PushStateProxy.create
     * @function
     * @returns {milkman.PushStateProxy}
     */

    /**
     * @class
     * @extends milkman.LocationProxy
     */
    milkman.PushStateProxy = self
        .addPrivateMethods(/** @lends milkman.PushStateProxy# */{
            /**
             * @returns {string}
             * @private
             */
            _pathNameGetterProxy: function () {
                return window.location.pathname;
            },

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
            /** @returns {milkman.Route} */
            getRoute: function () {
                var path = this._pathNameGetterProxy();
                path = path.substr(1);
                return path.toRoute();
            },

            /**
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

            /** @param {Event} event */
            onRouteChange: function (event) {
                milkman.Router.create().onRouteChange(event);
            }
        });
});

troop.amendPostponed(milkman, 'LocationProxy', function () {
    "use strict";

    milkman.LocationProxy
        .addSurrogate(milkman, 'PushStateProxy', function () {
            return !!milkman.usePushState;
        });
});

(function () {
    "use strict";

    // reacting to hash changes
    window.addEventListener('popstate', function (event) {
        if (milkman.usePushState) {
            milkman.LocationProxy.create().onRouteChange(event);
        }
    });

    document.addEventListener('faux-popstate', function () {
        if (milkman.usePushState) {
            milkman.LocationProxy.create().onRouteChange(event);
        }
    });
}());
