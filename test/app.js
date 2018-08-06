var app = angular.module('test', ['angular-editor']);

app.directive('editorTestDirective', function() {
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
    directiveService.availableDirectives.shift({
        name: 'Test Directive',
        tagName: 'editor-test-directive',
        code: '<editor-test-directive text="">\n  <p>Transcluded content here</p>\n</editor-test-directive>'
    });
});

app.run(function(editorStyleService) {
    editorStyleService.styles.push({
        label: 'Heading 5',
        preview: '<h5>Heading 5</h5>',
        apply: function(editorElement) {
            h.applyHeader('H5', editorElement);
        }
    }, {
        label: 'Heading 6',
        preview: '<h6>Heading 6</h6>',
        apply: function(editorElement) {
            h.applyHeader('H6', editorElement);
        }
    });
});