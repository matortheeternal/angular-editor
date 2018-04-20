app.directive('testDirective', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/testDirective.html',
        transclude: true,
        scope: {
            text: '@'
        }
    }
});