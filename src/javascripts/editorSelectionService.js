editor.service('editorSelectionService', function() {
    var service = this;

    var getSelection = function() {
        return window.getSelection ?
            window.getSelection() : document.selection;
    };

    var forEachRange = function(callback) {
        var sel = getSelection();
        for (var i = 0; i < sel.rangeCount; i++) {
            callback(sel.getRangeAt(i));
        }
    };

    var addSelections = function(node, selections) {
        if (node.nodeType === 3) {
            selections.push({ node: node });
        } else {
            for (var i = 0; i < node.childNodes.length; i++)
                addSelections(node.childNodes[i], selections);
        }
        return selections;
    };

    var indexOfNode = function(child) {
        var i = 0;
        while (!!(child = child.previousSibling)) i++;
        return i;
    };

    var makeStartSelectionObjects = function(range, groups) {
        var selections = [{
                node: range.startContainer,
                start: range.startOffset
            }],
            ancestor = range.startContainer;
        while (true) {
            var p = ancestor.parentNode;
            if (p === range.commonAncestorContainer) break;
            var n = indexOfNode(ancestor);
            for (var i = n + 1; i < p.childNodes.length; i++)
                addSelections(p.childNodes[i], selections);
            ancestor = p;
        }
        groups.push({ ancestor: ancestor, selections: selections });
    };

    var makeEndSelectionObjects = function(range, groups) {
        var selections = [],
            ancestor = range.endContainer;
        while (true) {
            var p = ancestor.parentNode;
            if (p === range.commonAncestorContainer) break;
            var n = indexOfNode(ancestor);
            for (var i = 0; i < n; i++)
                addSelections(p.childNodes[i], selections);
            ancestor = p;
        }
        selections.push({
            node: range.endContainer,
            end: range.endOffset
        });
        groups.push({ ancestor: ancestor, selections: selections });
    };

    var makeIntermediateSelectionObjects = function(range, groups) {
        var ancestor = range.commonAncestorContainer,
            startIndex = indexOfNode(groups[0].ancestor),
            endIndex = indexOfNode(groups[1].ancestor);
        for (var i = startIndex + 1; i < endIndex; i++) {
            var child = ancestor.childNodes[i];
            groups.splice(-1, 0, {
                ancestor: child,
                selections: addSelections(child, [])
            });
        }
    };

    var simpleSelection = function(range) {
        return {
            ancestor: range.commonAncestorContainer,
            selections: [{
                node: range.startContainer,
                start: range.startOffset,
                end: range.endOffset
            }]
        };
    };

    var isDescendentOf = function(el, supposedParent) {
        while (el) {
            if (el === supposedParent) return true;
            el = el.parentNode;
        }
    };

    var getActiveSelection = function(selections) {
        if (!service.activeElement) return;
        selections.push({
            ancestor: service.activeElement,
            selections: []
        });
    };

    var last = function(a) {
        return a[a.length - 1];
    };

    this.store = function(editorElement) {
        service.clearStore();
        service._store = service.getSelections(editorElement);
    };

    this.clearStore = function() {
        delete service._store;
    };

    this.select = function(groups) {
        service.clearSelections();
        var firstSel = groups[0].selections[0];
        var lastSel = last(last(groups).selections);
        var range = document.createRange();
        range.setStart(firstSel.node, firstSel.start);
        range.setEnd(lastSel.node, lastSel.end);
        getSelection().addRange(range);
    };

    this.clearSelections = function() {
        var sel = getSelection();
        sel.empty ? sel.empty() : sel.removeAllRanges();
    };

    this.getSelections = function(editorElement) {
        if (service._store) return service._store;
        var selections = [];
        getActiveSelection(selections);
        forEachRange(function(range) {
            if (!isDescendentOf(range.startContainer, editorElement) ||
                !isDescendentOf(range.endContainer, editorElement)) return;
            if (range.startContainer === range.endContainer)
                return selections.push(simpleSelection(range));
            makeStartSelectionObjects(range, selections);
            makeEndSelectionObjects(range, selections);
            makeIntermediateSelectionObjects(range, selections);
        });
        return selections;
    };
});