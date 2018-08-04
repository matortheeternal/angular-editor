app.directive('editor', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/editor.html',
        scope: {
            text: '=?',
            customModals: '=?'
        },
        controller: 'editorController'
    }
});

app.controller('editorController', function($scope, $sce, $compile, editorActionService, editorStyleService, editorModalService, hotkeyService, selectionService, htmlService) {
    // initialization
    editorStyleService.trustStyles();
    $scope.actionGroups = editorActionService.groups;
    if (!$scope.text) $scope.text = '';
    var directiveExpr = /<!-- START DIRECTIVE -->([\s\S]*)<!-- END DIRECTIVE -->/g;
    var focusableTags = ['IMG'];

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

    var deleteFocusedNode = function() {
        if (!selectionService.activeElement) return;
        selectionService.activeElement.remove();
        selectionService.activeElement = undefined;
    };

    var getDirectiveBlock = function(index) {
        var blocks = $scope.editor.find('directive-block');
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            if (parseInt(block.getAttribute('index')) === index)
                return block;
        }
    };

    var loadHotkeys = function() {
        var hotkeys = {
            'BACKSPACE': [{
                modifiers: {},
                action: {callback: deleteFocusedNode}
            }],
            'DELETE': [{
                modifiers: {},
                action: {callback: deleteFocusedNode}
            }]
        };
        $scope.actionGroups.forEach(function(group) {
            group.actions.forEach(function(action) {
                if (!action.hotkey) return;
                hotkeyService.addHotkey(hotkeys, action);
            });
        });
        return hotkeys;
    };

    // scope functions
    $scope.invokeAction = function(action) {
        return action.callback($scope.editor[0], $scope);
    };

    $scope.selectChanged = function(action) {
        if (!action.activeItem) return;
        action.activeItem.apply($scope.editor);
    };

    $scope.addDirective = function(source) {
        var editorEl = $scope.editor[0];
        var dbTag = htmlService.insert('directive-block', editorEl);
        var newIndex = $scope.directiveSources.push(source) - 1;
        dbTag.setAttribute('index', newIndex);
        $compile(dbTag)($scope);
    };

    // inherited event handlers
    editorModalService.bind($scope);

    // event handlers
    $scope.$watch('text', updateEditorHtml);

    $scope.onMouseDown = function(e) {
        if (focusableTags.indexOf(e.target.tagName) === -1)
            return selectionService.activeElement = undefined;
        selectionService.activeElement = e.target;
    };

    $scope.$on('escapeDirective', function(e, index) {
        e.stopPropagation();
        var block = getDirectiveBlock(index),
            nextSibling = block.nextElementSibling;
        if (!nextSibling) {
            nextSibling = document.createElement('p');
            nextSibling.innerHTML = '&nbsp;';
            block.parentNode.appendChild(nextSibling);
        }
        nextSibling.click();
        focusNode(nextSibling);
    });

    $scope.$on('deleteDirective', function(e, index) {
        e.stopPropagation();
        getDirectiveBlock(index).remove();
    });

    // initialization
    var buildOnKeyDown = hotkeyService.buildOnKeyDown;
    $scope.onKeyDown = buildOnKeyDown(loadHotkeys(), $scope.invokeAction);
});