editor.directive('editor', function() {
    return {
        restrict: 'E',
        template:
        '<editor-toolbar></editor-toolbar>\n' +
        '<div ng-hide="showCode" class="html-editor" contenteditable="true" store-element="editor" ng-keydown="onKeyDown($event)" ng-mousedown="onMouseDown($event)"></div>\n' +
        '\n' +
        '<textarea class="code-editor" ng-show="showCode" ng-model="text" title></textarea>\n' +
        '\n' +
        '<div ng-if="modalOptions" class="{{modalOptions.class}}">\n' +
        '    <div class="modal-container">\n' +
        '        <div class="modal">\n' +
        '            <div class="close-modal" ng-click="$emit(\'closeModal\')"></div>\n' +
        '\n' +
        '            <h3>{{::modalOptions.label}}</h3>\n' +
        '\n' +
        '            <section>\n' +
        '                <label>\n' +
        '                    <span class="input-label">URL</span>\n' +
        '                    <input type="text" ng-model="modalOptions.url">\n' +
        '                </label>\n' +
        '            </section>\n' +
        '\n' +
        '            <div class="primary-actions">\n' +
        '                <button class="action-btn" ng-click="$emit(\'applyUrl\')">OK</button>\n' +
        '                <button class="action-btn" ng-show="modalOptions.tag && modalOptions.remove" ng-click="$emit(\'removeUrl\')">Remove</button>\n' +
        '                <button class="action-btn" ng-click="$emit(\'closeModal\')">Cancel</button>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>',
        scope: {
            text: '=?',
            customModals: '=?'
        },
        controller: 'editorController'
    }
});

editor.controller('editorController', function($scope, $sce, $compile, editorActionService, editorStyleService, editorModalService, editorHotkeyService, editorSelectionService, editorHtmlService, editorHtmlHelpers, directiveService) {
    // initialization
    editorStyleService.trustStyles();
    $scope.actionGroups = editorActionService.groups;
    $scope.showCode = false;
    if (!$scope.text) $scope.text = '';

    var s = editorSelectionService,
        h = editorHtmlService,
        elementIsChild = editorHtmlHelpers.elementIsChild,
        directiveBlockExpr = /<directive-block index="(\d+)"[\s\S]*?<\/directive-block>/g,
        ngScopeClassExpr = / class="([^"]*ng-scope[^"]*)"/g,
        focusableTags = ['IMG'],
        updateTextTimeout;

    // helper function
    var processDirectives = function() {
        $scope.directiveSources = [];
        var directiveExpr = directiveService.buildDirectiveExpr();
        return $scope.text.replace(directiveExpr, function(match) {
            var index = $scope.directiveSources.push(match) - 1;
            return '<directive-block index="' + index + '"></directive-block>';
        });
    };

    var getPreviewHtml = function() {
        var html = processDirectives();
        return $sce.trustAsHtml(html).toString();
    };

    var getCodeText = function() {
        var html = $scope.editor[0].innerHTML;
        return html.replace(directiveBlockExpr, function(match, index) {
            return $scope.directiveSources[parseInt(index)];
        }).replace(ngScopeClassExpr, function(match, classes) {
            classes = classes.replace('ng-scope', '');
            if (classes.trim() !== '') return 'class="' + classes + '"';
            return '';
        });
    };

    var focusNode = function(node) {
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(node, 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    };

    var getDirectiveBlock = function(index) {
        var blocks = $scope.editor.find('directive-block');
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            if (parseInt(block.getAttribute('index')) === index)
                return block;
        }
    };

    var getChildOfEditor = function(node) {
        while (node.parentNode) {
            if (node.parentNode === $scope.editor[0]) return node;
            node = node.parentNode;
        }
    };

    // scope functions
    $scope.invokeAction = function(action) {
        return action.callback($scope.editor[0], $scope);
    };

    $scope.selectChanged = function(action) {
        if (!action.activeItem) return;
        action.activeItem.apply($scope.editor[0]);
    };

    $scope.addDirective = function(source) {
        var editorEl = $scope.editor[0];
        var dbTag = h.insert('directive-block', editorEl);
        var newIndex = $scope.directiveSources.push(source) - 1;
        dbTag.setAttribute('index', newIndex);
        $compile(dbTag)($scope);
    };

    $scope.updateEditorHtml = function() {
        if (!$scope.editor) return;
        if ($scope.skipNextUpdate)
            return delete $scope.skipNextUpdate;
        $scope.editor.html(getPreviewHtml());
        $compile($scope.editor.contents())($scope);
    };

    $scope.updateEditorText = function() {
        if (!$scope.editor) return;
        $scope.skipNextUpdate = true;
        $scope.text = getCodeText();
    };

    $scope.deleteFocusedNode = function() {
        if (!s.activeElement) return;
        s.activeElement.remove();
        s.activeElement = undefined;
    };

    $scope.createNewParagraph = function() {
        setTimeout(function() {
            var sel = window.getSelection ?
                window.getSelection() : document.selection;
            var node = getChildOfEditor(sel.focusNode);
            if (node.tagName === 'P') return;
            var p = document.createElement('P');
            p.innerHTML = node.innerHTML;
            node.parentNode.replaceChild(p, node);
        });
    };

    $scope.defaultKeyPress = function() {
        if (updateTextTimeout) clearTimeout(updateTextTimeout);
        updateTextTimeout = setTimeout(function() {
            $scope.$applyAsync($scope.updateEditorText);
        }, 500);
    };

    // inherited event handlers
    editorModalService.bind($scope);
    editorHotkeyService.bind($scope);

    // event handlers
    $scope.$watch('text', $scope.updateEditorHtml);
    $scope.$watch('showCode', function() {
        if ($scope.showCode) $scope.updateEditorText();
    });

    $scope.onMouseDown = function(e) {
        $scope.$broadcast('dropdownCallback', function(scope) {
            var action = scope.action;
            if (action.title !== 'Style') return;
            action.activeItem = action.options.find(function(style) {
                return h.testStyle(e.target, $scope.editor[0], style);
            }) || action.options[0];
        });
        if (focusableTags.indexOf(e.target.tagName) === -1)
            return s.activeElement = undefined;
        s.activeElement = e.target;
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

    var onLinkClick = function(e) {
        if (e.target.tagName !== 'A') return;
        var inEditor = elementIsChild(e.target, $scope.editor[0]);
        if (inEditor) e.preventDefault();
    };

    window.addEventListener('click', onLinkClick);
    $scope.$on('destroy', function() {
        window.removeEventListener('click', onLinkClick);
    });
});