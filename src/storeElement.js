app.directive('storeElement', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope[attrs.storeElement] = element;
        }
    }
});