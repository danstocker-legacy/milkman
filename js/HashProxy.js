/*global dessert, troop, sntls, evan, milkman */
troop.postpone(milkman, 'HashProxy', function () {
    "use strict";

    var base = milkman.LocationProxy,
        self = base.extend();

    /**
     * @name milkman.HashProxy.create
     * @function
     * @returns {milkman.HashProxy}
     */

    /**
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
            },

            /**
             * Retrieves the current hash from the URL.
             * @returns {string}
             * @private
             */
            _hashGetterProxy: function () {
                return window.location.hash;
            }
        })
        .addMethods(/** @lends milkman.HashProxy# */{
            /** @returns {milkman.Route} */
            getRoute: function () {
                var hash = this._hashGetterProxy(),
                    path = hash.substr(1);

                return path.toRoute();
            },

            /**
             * @param {milkman.Route} route
             * @returns {milkman.HashProxy}
             */
            setRoute: function (route) {
                var hash = '#' + route.toString();
                this._hashSetterProxy(hash);
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
        .addSurrogate(milkman, 'HashProxy', function () {
            return !milkman.usePushState;
        });
});

(function () {
    "use strict";

    // reacting to hash changes
    window.addEventListener('hashchange', function (event) {
        if (!milkman.usePushState) {
            milkman.HashProxy.create()
                .onRouteChange(event);
        }
    });
}());
