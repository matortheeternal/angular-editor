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

app.controller('editorController', function($scope, $sce, $compile, editorActionService, editorStyleService, hotkeyService) {
    editorStyleService.trustStyles();
    $scope.actionGroups = editorActionService.groups;
    if (!$scope.text) $scope.text = '';
    var directiveExpr = /<!-- START DIRECTIVE -->([\s\S]*)<!-- END DIRECTIVE -->/g;

    // helper function
    var processDirectives = function() {
        $scope.directiveSources = [];
        return $scope.text.replace(directiveExpr, function(match, code) {
            var index = $scope.directiveSources.push(code.trim()) - 1;
            return '<directive-block index="' + index +
                '"></directive-block>';
        });
    };

    var getPreviewHtml = function() {
        var html = processDirectives();
        return $sce.trustAsHtml(html).toString();
    };

    var updateEditorHtml = function() {
        $scope.editor.html(getPreviewHtml());
        $compile($scope.editor.contents())($scope);
    };

    var focusNode = function(node) {
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(node, 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    };

    // scope functions
    $scope.invokeAction = function(action) {
        return action.callback($scope.editor);
    };

    $scope.selectChanged = function(action) {
        if (!action.activeOption) return;
        action.activeOption.callback($scope.editor);
    };

    // event handlers
    $scope.$watch('text', updateEditorHtml);

    $scope.$on('escape', function(e, index) {
        e.stopPropagation();
        var block = $scope.editor.find('directive-block')[index],
            nextSibling = block.nextElementSibling;
        if (!nextSibling) {
            nextSibling = document.createElement('p');
            nextSibling.innerHTML = '&nbsp;';
            block.parentNode.appendChild(nextSibling);
        }
        nextSibling.click();
        focusNode(nextSibling);
    });

    $scope.$on('delete', function(e, index) {
        e.stopPropagation();
        $scope.editor.find('directive-block')[index].remove();
    });

    // initialization
    var hotkeys = [];

    $scope.actionGroups.forEach(function(group) {
        group.actions.forEach(function(action) {
            if (!action.hotkey) return;
            hotkeyService.addHotkey(hotkeys, action);
        });
    });

    console.log(hotkeys);
    $scope.onKeyDown = hotkeyService.buildOnKeyDown(hotkeys, $scope.invokeAction);
});