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

editor.controller('editorController', function($scope, $sce, $compile, editorActionService, editorStyleService, editorModalService, editorHotkeyService, editorSelectionService, editorHtmlService) {
    // initialization
    editorStyleService.trustStyles();
    $scope.actionGroups = editorActionService.groups;
    $scope.showCode = false;
    if (!$scope.text) $scope.text = '';

    var s = editorSelectionService,
        h = editorHtmlService,
        directiveExpr = /<!-- START DIRECTIVE -->([\s\S]*)<!-- END DIRECTIVE -->/g,
        directiveBlockExpr = /<directive-block index="(\d+)"[\s\S]*<\/directive-block>/g,
        ngScopeClassExpr = / class="([^"]*ng-scope[^"]*)"/g,
        focusableTags = ['IMG'];

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

    var getCodeText = function() {
        var html = $scope.editor[0].innerHTML;
        return html.replace(directiveBlockExpr, function(match, index) {
            return ['<!-- START DIRECTIVE -->',
                $scope.directiveSources[parseInt(index)],
                '<!-- END DIRECTIVE -->'].join('\n');
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

    var deleteFocusedNode = function() {
        if (!s.activeElement) return;
        s.activeElement.remove();
        s.activeElement = undefined;
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
                editorHotkeyService.addHotkey(hotkeys, action);
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

    // inherited event handlers
    editorModalService.bind($scope);

    // event handlers
    $scope.$watch('text', $scope.updateEditorHtml);
    $scope.$watch('showCode', function() {
        if ($scope.showCode) $scope.updateEditorText();
    });

    $scope.onMouseDown = function(e) {
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

    // initialization
    var buildOnKeyDown = editorHotkeyService.buildOnKeyDown;
    $scope.onKeyDown = buildOnKeyDown(loadHotkeys(), $scope.invokeAction);
});