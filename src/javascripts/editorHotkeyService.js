editor.service('editorHotkeyService', function() {
    var sortActions = function(actions) {
        actions.sort(function(a, b) {
            return b.modifiers.length -  a.modifiers.length;
        });
    };

    var buildModifiers = function(modifiers) {
        return {
            shiftKey: modifiers.indexOf('Shift') >= 0,
            ctrlKey: modifiers.indexOf('Ctrl') >= 0,
            altKey: modifiers.indexOf('Alt') >= 0
        };
    };

    var addHotkey = function(hotkeys, action) {
        var modifiers = action.hotkey.split(' + '),
            key = modifiers.pop().toUpperCase();
        if (!hotkeys.hasOwnProperty(key)) hotkeys[key] = [];
        hotkeys[key].push({
            modifiers: buildModifiers(modifiers),
            action: action
        });
        if (hotkeys[key].length > 1) sortActions(hotkeys[key]);
    };

    var loadHotkeys = function(scope) {
        var hotkeys = {
            'BACKSPACE': [{
                modifiers: {},
                action: {callback: scope.deleteFocusedNode}
            }],
            'DELETE': [{
                modifiers: {},
                action: {callback: scope.deleteFocusedNode}
            }]/*,
            'ENTER': [{
                modifiers: {},
                action: {callback: scope.createNewParagraph}
            }]*/
        };
        scope.actionGroups.forEach(function(group) {
            group.actions.forEach(function(action) {
                if (!action.hotkey) return;
                addHotkey(hotkeys, action);
            });
        });
        return hotkeys;
    };

    var getTargetAction = function(hotkeys, e) {
        // TODO: IE Shim for KeyboardEvent.key
        var actions = hotkeys[e.key.toUpperCase()];
        return actions && actions.find(function(action) {
            return e.shiftKey === !!action.modifiers.shiftKey
                && e.ctrlKey === !!action.modifiers.ctrlKey
                && e.altKey === !!action.modifiers.altKey;
        });
    };

    this.bind = function(scope) {
        var hotkeys = loadHotkeys(scope);
        scope.onKeyDown = function(e) {
            var t = getTargetAction(hotkeys, e);
            if (t && scope.invokeAction(t.action)) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
            scope.defaultKeyPress();
        };
    };
});