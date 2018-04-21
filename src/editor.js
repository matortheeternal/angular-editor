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

    // helper function
    var getCurrentSelection = function() {
        // TODO
    };

    var processDirectives = function() {
        $scope.directiveSources = [];
        var tokens = $scope.text.split(/<!-- (START|END) DIRECTIVE -->/);
        return tokens.reduce(function(html, token, index) {
            if (index % 2 === 0) return html + token;
            var sourceIndex = $scope.directiveSources.push(token) - 1;
            return html + '<directive-block code="directiveSources[' +
                sourceIndex + ']"></directive-block>';
        }, '');
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