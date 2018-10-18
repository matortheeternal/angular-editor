var app = angular.module('test', ['angularEditor']);

app.directive('testDirective', function() {
    return {
        restrict: 'E',
        template: '<p>{{::text}}</p>\n<div ng-transclude></div>',
        transclude: true,
        scope: {
            text: '@'
        }
    }
});

app.run(function(directiveService) {
    directiveService.availableDirectives.unshift({
        name: 'Test Directive',
        tagName: 'test-directive',
        code: '<test-directive text="">\n  <p>Transcluded content here</p>\n</test-directive>'
    });
});

app.run(function(editorStyleService) {
    for (var i = 1; i <= 6; i++)
        editorStyleService.addHeaderStyle(i);
    editorStyleService.addInlineClassStyle('Custom Class 1', 'custom-class-1');
});