app.service('hotkeyService', function() {
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

    this.addHotkey = function(hotkeys, action) {
        var modifiers = action.hotkey.split(' + '),
            key = modifiers.pop().toUpperCase();
        if (!hotkeys.hasOwnProperty(key)) hotkeys[key] = [];
        hotkeys[key].push({
            modifiers: buildModifiers(modifiers),
            action: action
        });
        if (hotkeys[key].length > 1) sortActions(hotkeys[key]);
    };

    this.buildOnKeyDown = function(hotkeys, invokeAction) {
        return function(e) {
            // TODO: IE Shim for KeyboardEvent.key
            var actions = hotkeys[e.key.toUpperCase()],
                targetAction = actions && actions.find(function(action) {
                    return e.shiftKey === !!action.modifiers.shiftKey
                        && e.ctrlKey === !!action.modifiers.ctrlKey
                        && e.altKey === !!action.modifiers.altKey;
                });
            if (!targetAction) return;
            if (invokeAction(targetAction.action)) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }
    };
});