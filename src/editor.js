app.directive('editor', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/editor.html',
        scope: {
            text: '=?'
        },
        controller: 'editorController'
    }
});

app.controller('editorController', function($scope, $sce, $compile, editorActionService, editorStyleService) {
    editorStyleService.trustStyles();
    $scope.actionGroups = editorActionService.groups;
    if (!$scope.text) $scope.text = '';
    var directiveExpr = /<!-- START DIRECTIVE -->([\s\S]*)<!-- END DIRECTIVE -->/g;

    // helper function
    var getCurrentSelection = function() {
        // TODO
    };

    var processDirectives = function() {
        $scope.directiveSources = [];
        return $scope.text.replace(directiveExpr, function(match, code) {
            var index = $scope.directiveSources.push(code.trim()) - 1;
            return '<directive-block code="directiveSources[' + index +
                ']"></directive-block>';
        });
    };

    var getPreviewHtml = function() {
        var html = processDirectives();
        return $sce.trustAsHtml(html).toString();
    };

    // scope functions
    $scope.invokeAction = function(action) {
        action.callback(getCurrentSelection());
    };

    $scope.selectChanged = function(action) {
        if (!action.activeOption) return;
        action.activeOption.callback(getCurrentSelection());
    };

    // event handlers
    $scope.$watch('text', function() {
        $scope.editor.html(getPreviewHtml());
        $compile($scope.editor.contents())($scope);
    });
});