app.directive('editorTestDirective', function() {
    return {
        restrict: 'E',
        template:
        '<p>{{::text}}</p>\n' +
        '<div ng-transclude></div>',
        transclude: true,
        scope: {
            text: '@'
        }
    }
});