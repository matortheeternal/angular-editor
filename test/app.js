var app = angular.module('test', ['angular-editor']);

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

app.run(function(directiveService) {
    directiveService.availableDirectives.shift({
        name: 'Test Directive',
        tagName: 'editor-test-directive',
        code: '<editor-test-directive text="">\n  <p>Transcluded content here</p>\n</editor-test-directive>'
    });
});