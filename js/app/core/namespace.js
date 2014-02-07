(function (window, $, undefined) {
    'use strict';

    var createNamespace = function () {
        var a = arguments, o = null, i, j, d;
        for (i = 0; i < a.length; i = i + 1) {
            d = a[i].split('.');
            o = window;
            for (j = 0; j < d.length; j = j + 1) {
                o[d[j]] = o[d[j]] || {};
                o = o[d[j]];
            }
        }
        return o;
    };

    function iterateThroughNamespace(parentNamespaceObject, namespaces) {
        for (var namespaceIndex = 0; namespaceIndex < namespaces.length; namespaceIndex++) {

            var childNamespace = namespaces[namespaceIndex];
            var childNamespaceObject = parentNamespaceObject[childNamespace];

            if (childNamespaceObject === undefined) {
                childNamespaceObject = {};
                parentNamespaceObject[childNamespace] = childNamespaceObject;
            }

            parentNamespaceObject = childNamespaceObject;
        }

        return parentNamespaceObject;
    }

    var addToNamespace = function(namespace, propertyContainer) {
        createNamespace(namespace);

        var namespaces = namespace.split('.');

        var parentObject = iterateThroughNamespace(window, namespaces);

        for (var property in propertyContainer) {
            if (propertyContainer.hasOwnProperty(property)) {
                parentObject[property] = propertyContainer[property];
            }
        }
    };

    createNamespace('GTDapp');

    window.namespace = createNamespace;
    window.addToNamespace = addToNamespace;

})(window, jQuery);

