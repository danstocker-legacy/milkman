/*global dessert, troop, sntls, evan, milkman */
troop.postpone(milkman, 'routingEventSpace', function () {
    "use strict";

    /**
     * Dedicated event space for routing events.
     * @type {evan.EventSpace}
     */
    milkman.routingEventSpace = evan.EventSpace.create();
});
